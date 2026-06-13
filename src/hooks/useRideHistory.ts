// src/hooks/useRideHistory.ts

import { useState, useEffect, useCallback } from "react";
import {
  fetchRideHistory,
  type RideHistoryEntry,
} from "@/services/rideApi";

interface UseRideHistoryReturn {
  rides: RideHistoryEntry[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRideHistory(): UseRideHistoryReturn {
  const [rides, setRides] = useState<RideHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchRideHistory();
      setRides(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch ride history."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    rides,
    isLoading,
    error,
    refetch: fetchData,
  };
}