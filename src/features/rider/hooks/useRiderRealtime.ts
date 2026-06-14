import { useEffect, useRef, useState } from "react";
import {
  subscribeToCurrentRide,
  subscribeToDriverLocation,
  clearCurrentRide,
  type CurrentRide,
  type DriverLocation,
} from "@/services/firebase";
import { saveRideToHistory } from "@/services/rideApi";
import { getUserRole } from "@/lib/auth";
import { Role } from "@/const/enum";

const TERMINAL_STATES = ["completed", "cancelled", "rejected"] as const;

interface UseRiderRealtimeReturn {
  currentRide: CurrentRide | null;
  driverLocation: DriverLocation | null;
}

export function useRiderRealtime(): UseRiderRealtimeReturn {
  const [currentRide, setCurrentRide] = useState<CurrentRide | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(
    null
  );

  const rideUnsubRef = useRef<(() => void) | null>(null);
  const locationUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Subscribe to ride changes
    rideUnsubRef.current = subscribeToCurrentRide((ride) => {
      setCurrentRide(ride);

      // Handle terminal states
      if (ride && TERMINAL_STATES.includes(ride.status as typeof TERMINAL_STATES[number])) {
        setTimeout(async () => {
          if (getUserRole() === Role.RIDER) {
            try {
              await saveRideToHistory(ride);
            } catch (err) {
              console.error("[rideApi] Failed to save ride to history:", err);
            } finally {
              await clearCurrentRide();
              setCurrentRide(null);
            }
          }
        }, 1000);
      }
    });

    // Subscribe to driver location
    locationUnsubRef.current = subscribeToDriverLocation((location) => {
      setDriverLocation(location);
    });

    return () => {
      rideUnsubRef.current?.();
      locationUnsubRef.current?.();
    };
  }, []);

  return { currentRide, driverLocation };
}