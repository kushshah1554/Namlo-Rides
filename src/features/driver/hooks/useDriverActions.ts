import { useState, useCallback } from "react";
import {
  acceptRide,
  rejectRide,
  startRide,
  completeRide,
} from "@/services/firebase";
import { getAuthUser } from "@/lib/auth";

interface UseDriverActionsReturn {
  loadingId: string | null;
  isStarting: boolean;
  isCompleting: boolean;
  error: string | null;
  clearError: () => void;
  handleAccept: (rideId: string) => Promise<void>;
  handleReject: (rideId: string) => Promise<void>;
  handleStartRide: () => Promise<void>;
  handleCompleteRide: () => Promise<void>;
}

export function useDriverActions(): UseDriverActionsReturn {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = getAuthUser();

  const handleAccept = useCallback(
    async (rideId: string) => {
      if (!user?.email) return;

      setError(null);
      setLoadingId(rideId);

      try {
        await acceptRide(user.email);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to accept ride."
        );
      } finally {
        setLoadingId(null);
      }
    },
    [user]
  );

  const handleReject = useCallback(async (rideId: string) => {
    setError(null);
    setLoadingId(rideId);

    try {
      await rejectRide();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject ride."
      );
    } finally {
      setLoadingId(null);
    }
  }, []);

  const handleStartRide = useCallback(async () => {
    setError(null);
    setIsStarting(true);

    try {
      await startRide();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start ride."
      );
    } finally {
      setIsStarting(false);
    }
  }, []);

  const handleCompleteRide = useCallback(async () => {
    setError(null);
    setIsCompleting(true);

    try {
      await completeRide();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete ride."
      );
    } finally {
      setIsCompleting(false);
    }
  }, []);

  return {
    loadingId,
    isStarting,
    isCompleting,
    error,
    clearError: () => setError(null),
    handleAccept,
    handleReject,
    handleStartRide,
    handleCompleteRide,
  };
}