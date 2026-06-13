// src/services/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  update,
  remove,
  push,
  serverTimestamp,
  off,
  type Unsubscribe,
} from "firebase/database";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type RideStatus =
  | "idle"
  | "requested"
  | "accepted"
  | "active"
  | "completed"
  | "cancelled"
  | "rejected";

export interface DriverLocation {
  lat: number;
  lng: number;
  updatedAt: number | null;
}

export interface CurrentRide {
  id: string;
  pickup: string;
  destination: string;
  status: RideStatus;
  riderId: string;
  driverId?: string | null;
  requestedAt: number;
  acceptedAt?: number | null;
  completedAt?: number | null;
  pickupLat?: number | null;
  pickupLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
}

// ---------------------------------------------------------------------------
// Firebase Config
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ---------------------------------------------------------------------------
// Firebase Init (singleton — prevents re-init in React StrictMode)
// ---------------------------------------------------------------------------
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// ---------------------------------------------------------------------------
// DB Refs
// ---------------------------------------------------------------------------
const REFS = {
  currentRide: () => ref(db, "currentRide"),
  driverLocation: () => ref(db, "driverLocation"),
  rideStatus: () => ref(db, "currentRide/status"),
} as const;

// ---------------------------------------------------------------------------
// Ride Service — Rider Actions
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Ride Service — Driver Actions
// ---------------------------------------------------------------------------

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

  await update(REFS.currentRide(), {
    status: "active",
  });
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
 * Clears the currentRide node after a terminal state is saved to MockAPI.
 */
export async function clearCurrentRide(): Promise<void> {
  await remove(REFS.currentRide());
}

// ---------------------------------------------------------------------------
// Driver Location Service
// ---------------------------------------------------------------------------

/**
 * Updates driver's live GPS location in Firebase.
 * Called every few seconds while driver is active.
 */
export async function updateDriverLocation(
  lat: number,
  lng: number
): Promise<void> {
  await set(REFS.driverLocation(), {
    lat,
    lng,
    updatedAt: Date.now(),
  });
}

// ---------------------------------------------------------------------------
// Realtime Listeners
// ---------------------------------------------------------------------------

/**
 * Listens to currentRide changes in real time.
 * Used by both Rider and Driver pages.
 */
export function subscribeToCurrentRide(
  callback: (ride: CurrentRide | null) => void
): Unsubscribe {
  const rideRef = REFS.currentRide();

  const unsubscribe = onValue(rideRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as CurrentRide);
    } else {
      callback(null);
    }
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
    if (snapshot.exists()) {
      callback(snapshot.val() as DriverLocation);
    } else {
      callback(null);
    }
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

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export { db, REFS, serverTimestamp };