import { get, onValue, off } from "firebase/database";
import type { Unsubscribe } from "firebase/database";
import { REFS } from "./refs";
import type { CurrentRide, DriverLocation } from "./types";

/**
 * Listens to currentRide changes in real time.
 * Used by both Rider and Driver pages.
 */
export function subscribeToCurrentRide(
  callback: (ride: CurrentRide | null) => void
): Unsubscribe {
  const rideRef = REFS.currentRide();

  const unsubscribe = onValue(rideRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as CurrentRide) : null);
  });

  return () => off(rideRef, "value", unsubscribe);
}

/**
 * Listens to driver location changes in real time.
 * Used by Rider page to show live driver marker on map.
 */
export function subscribeToDriverLocation(
  callback: (location: DriverLocation | null) => void
): Unsubscribe {
  const locationRef = REFS.driverLocation();

  const unsubscribe = onValue(locationRef, (snapshot) => {
    callback(
      snapshot.exists() ? (snapshot.val() as DriverLocation) : null
    );
  });

  return () => off(locationRef, "value", unsubscribe);
}

/**
 * One-time fetch of currentRide (no realtime).
 */
export async function getCurrentRide(): Promise<CurrentRide | null> {
  const snapshot = await get(REFS.currentRide());
  return snapshot.exists() ? (snapshot.val() as CurrentRide) : null;
}