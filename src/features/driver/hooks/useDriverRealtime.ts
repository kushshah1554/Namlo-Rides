import { useEffect, useRef, useState } from "react";
import {
  subscribeToCurrentRide,
  clearCurrentRide,
  type CurrentRide,
} from "@/services/firebase";
import { saveRideToHistory } from "@/services/rideApi";
import { getUserRole } from "@/lib/auth";
import { Role } from "@/const/enum";

const TERMINAL_STATES = ["completed", "cancelled", "rejected"] as const;
type TerminalState = (typeof TERMINAL_STATES)[number];

interface UseDriverRealtimeReturn {
  currentRide: CurrentRide | null;
}

export function useDriverRealtime(): UseDriverRealtimeReturn {
  const [currentRide, setCurrentRide] = useState<CurrentRide | null>(null);
  const rideUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    rideUnsubRef.current = subscribeToCurrentRide((ride) => {
      setCurrentRide(ride);

      if (
        ride &&
        TERMINAL_STATES.includes(ride.status as TerminalState)
      ) {
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

    return () => {
      rideUnsubRef.current?.();
    };
  }, []);

  return { currentRide };
}