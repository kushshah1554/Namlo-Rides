import type { RideHistoryEntry } from "@/services/rideApi";

/**
 * Deduplicates rides by pickup + destination + requestedAt fingerprint.
 * Handles cases where both tabs save the same ride to MockAPI.
 */
export function deduplicateRides(rides: RideHistoryEntry[]): RideHistoryEntry[] {
  const seen = new Set<string>();

  return rides.filter((ride) => {
    const fingerprint = `${ride.pickup}-${ride.destination}-${ride.requestedAt}`;
    if (seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
}