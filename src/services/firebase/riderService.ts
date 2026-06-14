import { set, get, update, push, ref } from "firebase/database";
import { db } from "./config";
import { REFS } from "./refs";
import type { CurrentRide } from "./types";

/**
 * Creates a new ride request in Firebase.
 * Coordinates come pre-resolved from Geoapify autocomplete selection.
 */
export async function createRideRequest(
  pickup: string,
  destination: string,
  riderId: string,
  pickupLat: number,
  pickupLng: number,
  destinationLat: number,
  destinationLng: number
): Promise<string> {
  const rideRef = push(ref(db, "rides"));
  const rideId = rideRef.key!;

  const rideData: CurrentRide = {
    id: rideId,
    pickup,
    destination,
    status: "requested",
    riderId,
    driverId: null,
    requestedAt: Date.now(),
    acceptedAt: null,
    completedAt: null,
    pickupLat,
    pickupLng,
    destinationLat,
    destinationLng,
  };

  await set(REFS.currentRide(), rideData);
  return rideId;
}

/**
 * Rider cancels their ride request.
 * Only valid when status is "requested".
 */
export async function cancelRide(): Promise<void> {
  const snapshot = await get(REFS.currentRide());
  const ride = snapshot.val() as CurrentRide | null;

  if (!ride) throw new Error("No active ride found.");
  if (ride.status !== "requested") {
    throw new Error(`Cannot cancel a ride with status: ${ride.status}`);
  }

  await update(REFS.currentRide(), {
    status: "cancelled",
    completedAt: Date.now(),
  });
}