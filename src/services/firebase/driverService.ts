import { get, update, remove } from "firebase/database";
import { REFS } from "./refs";
import type { CurrentRide } from "./types";

/**
 * Driver accepts an incoming ride request.
 * Only valid when status is "requested".
 */
export async function acceptRide(driverId: string): Promise<void> {
  const snapshot = await get(REFS.currentRide());
  const ride = snapshot.val() as CurrentRide | null;

  if (!ride) throw new Error("No ride request found.");
  if (ride.status !== "requested") {
    throw new Error(`Cannot accept a ride with status: ${ride.status}`);
  }

  await update(REFS.currentRide(), {
    status: "accepted",
    driverId,
    acceptedAt: Date.now(),
  });
}

/**
 * Driver rejects an incoming ride request.
 * Only valid when status is "requested".
 */
export async function rejectRide(): Promise<void> {
  const snapshot = await get(REFS.currentRide());
  const ride = snapshot.val() as CurrentRide | null;

  if (!ride) throw new Error("No ride request found.");
  if (ride.status !== "requested") {
    throw new Error(`Cannot reject a ride with status: ${ride.status}`);
  }

  await update(REFS.currentRide(), {
    status: "rejected",
    completedAt: Date.now(),
  });
}

/**
 * Driver starts the ride (picks up rider).
 * Only valid when status is "accepted".
 */
export async function startRide(): Promise<void> {
  const snapshot = await get(REFS.currentRide());
  const ride = snapshot.val() as CurrentRide | null;

  if (!ride) throw new Error("No active ride found.");
  if (ride.status !== "accepted") {
    throw new Error(`Cannot start a ride with status: ${ride.status}`);
  }

  await update(REFS.currentRide(), { status: "active" });
}

/**
 * Driver completes the ride (reaches destination).
 * Only valid when status is "active".
 */
export async function completeRide(): Promise<void> {
  const snapshot = await get(REFS.currentRide());
  const ride = snapshot.val() as CurrentRide | null;

  if (!ride) throw new Error("No active ride found.");
  if (ride.status !== "active") {
    throw new Error(`Cannot complete a ride with status: ${ride.status}`);
  }

  await update(REFS.currentRide(), {
    status: "completed",
    completedAt: Date.now(),
  });
}

/**
 * Clears the currentRide node after terminal state is saved to MockAPI.
 */
export async function clearCurrentRide(): Promise<void> {
  await remove(REFS.currentRide());
}