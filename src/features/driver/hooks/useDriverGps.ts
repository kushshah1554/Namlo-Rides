import { useEffect, useRef, useState, useCallback } from "react";
import { updateDriverLocation } from "@/services/firebase";
import {
  LOCATION_UPDATE_INTERVAL,
  KATHMANDU_FALLBACK,
} from "../utils/driverMapUtils";
import type { LatLng } from "@/components/Map/RideMap";

type GpsStatus = "pending" | "granted" | "denied" | "unsupported";

interface UseDriverGpsReturn {
  driverLocation: LatLng | null;
  initialCenterRef: React.RefObject<LatLng>;
  gpsStatus: GpsStatus;
}

/**
 * Gets the current GPS position wrapped in a Promise.
 */
function getBrowserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export function useDriverGps(): UseDriverGpsReturn {
  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("pending");

  const initialCenterRef = useRef<LatLng>(KATHMANDU_FALLBACK);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestLocationRef = useRef<LatLng | null>(null);

  // ── Push latest location to Firebase on interval ──
  const startPushInterval = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (latestLocationRef.current) {
        const [lat, lng] = latestLocationRef.current;
        updateDriverLocation(lat, lng).catch(() => {});
      }
    }, LOCATION_UPDATE_INTERVAL);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus("unsupported");

      // Fallback to Kathmandu center
      const fallback = KATHMANDU_FALLBACK;
      setDriverLocation(fallback);
      initialCenterRef.current = fallback;
      latestLocationRef.current = fallback;

      // Still push fallback to Firebase
      updateDriverLocation(fallback[0], fallback[1]).catch(() => {});
      startPushInterval();
      return;
    }

    // ── Step 1: Get initial position immediately ──
    getBrowserPosition()
      .then((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const latLng: LatLng = [lat, lng];

        setDriverLocation(latLng);
        setGpsStatus("granted");
        initialCenterRef.current = latLng;
        latestLocationRef.current = latLng;

        // Push initial location to Firebase immediately
        updateDriverLocation(lat, lng).catch(() => {});

        // Start push interval
        startPushInterval();
      })
      .catch(() => {
        setGpsStatus("denied");

        // Fallback to Kathmandu
        const fallback = KATHMANDU_FALLBACK;
        setDriverLocation(fallback);
        initialCenterRef.current = fallback;
        latestLocationRef.current = fallback;

        updateDriverLocation(fallback[0], fallback[1]).catch(() => {});
        startPushInterval();
      });

    // ── Step 2: Watch position for live updates ──
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const latLng: LatLng = [lat, lng];

        // Update local state — map marker moves
        setDriverLocation(latLng);
        setGpsStatus("granted");

        // Store latest for interval push
        latestLocationRef.current = latLng;
      },
      () => {
        // watchPosition error — silently use last known location
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 2000,
      }
    );

    // ── Cleanup ──
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startPushInterval]);

  return { driverLocation, initialCenterRef, gpsStatus };
}