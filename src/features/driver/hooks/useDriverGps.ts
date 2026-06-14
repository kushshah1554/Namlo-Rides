import { useEffect, useRef, useState } from "react";
import { updateDriverLocation } from "@/services/firebase";
import {
  DRIVER_INITIAL_LOCATION,
  LOCATION_UPDATE_INTERVAL,
} from "../utils/driverMapUtils";
import type { LatLng } from "@/components/Map/RideMap";

interface UseDriverGpsReturn {
  driverLocation: LatLng;
  initialCenterRef: React.RefObject<LatLng>;
}

export function useDriverGps(): UseDriverGpsReturn {
  const [driverLocation, setDriverLocation] = useState<LatLng>(
    DRIVER_INITIAL_LOCATION
  );
  const initialCenterRef = useRef<LatLng>(DRIVER_INITIAL_LOCATION);
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    // Initial location push
    const pushInitialLocation = async () => {
      try {
        await updateDriverLocation(
          DRIVER_INITIAL_LOCATION[0],
          DRIVER_INITIAL_LOCATION[1]
        );
      } catch {
        // Silent fail — interval will recover
      }
    };

    pushInitialLocation();

    // GPS simulation interval
    locationIntervalRef.current = setInterval(() => {
      setDriverLocation((prev) => {
        const jitter = () => (Math.random() - 0.5) * 0.002;
        const newLat = prev[0] + jitter();
        const newLng = prev[1] + jitter();

        updateDriverLocation(newLat, newLng).catch(() => {});

        return [newLat, newLng];
      });
    }, LOCATION_UPDATE_INTERVAL);

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  return { driverLocation, initialCenterRef };
}