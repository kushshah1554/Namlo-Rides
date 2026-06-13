// src/services/rideApi.ts

import type { CurrentRide } from "@/services/firebase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RideHistoryEntry {
  id: string;
  pickup: string;
  destination: string;
  status: "completed" | "cancelled" | "rejected";
  riderId: string;
  driverId?: string | null;
  requestedAt: number;
  acceptedAt?: number | null;
  completedAt?: number | null;
}

export type SortField = "completedAt" | "requestedAt" | "status";
export type SortOrder = "asc" | "desc";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL;
const RIDES_ENDPOINT = `${BASE_URL}`;

// Validate env on startup
if (!BASE_URL) {
  console.warn(
    "[rideApi] VITE_MOCKAPI_BASE_URL is not set. Ride history will not work."
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Terminal states that should be saved to history.
 */
const TERMINAL_STATUSES = ["completed", "cancelled", "rejected"] as const;
type TerminalStatus = (typeof TERMINAL_STATUSES)[number];

function isTerminalStatus(status: string): status is TerminalStatus {
  return TERMINAL_STATUSES.includes(status as TerminalStatus);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `MockAPI error ${res.status}: ${text || res.statusText}`
    );
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// POST — Save ride to history
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// GET — Fetch all ride history
// ---------------------------------------------------------------------------

/**
 * Fetches all rides from MockAPI.
 * Returns sorted by completedAt descending (newest first) by default.
 */
export async function fetchRideHistory(): Promise<RideHistoryEntry[]> {
  const res = await fetch(RIDES_ENDPOINT, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await handleResponse<RideHistoryEntry[]>(res);

  // Sort newest first
  return data.sort(
    (a, b) => (b.completedAt ?? b.requestedAt) - (a.completedAt ?? a.requestedAt)
  );
}

// ---------------------------------------------------------------------------
// GET — Fetch single ride by ID
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// DELETE — Remove a ride from history (optional utility)
// ---------------------------------------------------------------------------
export async function deleteRideFromHistory(id: string): Promise<void> {
  const res = await fetch(`${RIDES_ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  await handleResponse<unknown>(res);
}