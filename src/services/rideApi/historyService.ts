import type { CurrentRide } from "@/services/firebase";
import { RIDES_ENDPOINT } from "./config";
import { isTerminalStatus, handleResponse, sortRidesNewestFirst } from "./helpers";
import type { RideHistoryEntry } from "./types";

/**
 * Saves a completed/cancelled/rejected ride to MockAPI.
 * Should be called right before clearCurrentRide() in Firebase.
 */
export async function saveRideToHistory(
  ride: CurrentRide
): Promise<RideHistoryEntry> {
  if (!isTerminalStatus(ride.status)) {
    throw new Error(
      `Cannot save ride with non-terminal status: ${ride.status}. ` +
        `Only completed, cancelled, or rejected rides can be saved.`
    );
  }

  const payload: Omit<RideHistoryEntry, "id"> = {
    pickup: ride.pickup,
    destination: ride.destination,
    status: ride.status,
    riderId: ride.riderId,
    driverId: ride.driverId ?? null,
    requestedAt: ride.requestedAt,
    acceptedAt: ride.acceptedAt ?? null,
    completedAt: ride.completedAt ?? Date.now(),
  };

  const res = await fetch(RIDES_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse<RideHistoryEntry>(res);
}

/**
 * Fetches all rides from MockAPI.
 * Returns sorted by completedAt descending (newest first).
 */
export async function fetchRideHistory(): Promise<RideHistoryEntry[]> {
  const res = await fetch(RIDES_ENDPOINT, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await handleResponse<RideHistoryEntry[]>(res);
  return sortRidesNewestFirst(data);
}

/**
 * Fetches a single ride by ID from MockAPI.
 */
export async function fetchRideById(
  id: string
): Promise<RideHistoryEntry | null> {
  const res = await fetch(`${RIDES_ENDPOINT}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 404) return null;

  return handleResponse<RideHistoryEntry>(res);
}

/**
 * Deletes a ride from MockAPI history.
 */
export async function deleteRideFromHistory(id: string): Promise<void> {
  const res = await fetch(`${RIDES_ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  await handleResponse<unknown>(res);
}