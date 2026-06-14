import { useState, useCallback } from "react";
import { createRideRequest, cancelRide } from "@/services/firebase";
import { getAuthUser } from "@/lib/auth";
import type { RideRequestData } from "@/features/rider/components/RideRequestForm";

interface UseRiderActionsReturn {
  isRequesting: boolean;
  isCancelling: boolean;
  error: string | null;
  clearError: () => void;
  handleRideRequest: (data: RideRequestData) => Promise<void>;
  handleCancelRide: () => Promise<void>;
}

export function useRiderActions(): UseRiderActionsReturn {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = getAuthUser();

  const handleRideRequest = useCallback(
    async (data: RideRequestData) => {
      if (!user?.email) {
        setError("You must be logged in to request a ride.");
        return;
      }

      setError(null);
      setIsRequesting(true);

      try {
        await createRideRequest(
          data.pickup,
          data.destination,
          user.email,
          data.pickupLat,
          data.pickupLng,
          data.destinationLat,
          data.destinationLng
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create ride request."
        );
      } finally {
        setIsRequesting(false);
      }
    },
    [user]
  );

  const handleCancelRide = useCallback(async () => {
    setError(null);
    setIsCancelling(true);

    try {
      await cancelRide();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel ride."
      );
    } finally {
      setIsCancelling(false);
    }
  }, []);

  return {
    isRequesting,
    isCancelling,
    error,
    clearError: () => setError(null),
    handleRideRequest,
    handleCancelRide,
  };
}