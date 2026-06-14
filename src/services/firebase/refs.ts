import { ref } from "firebase/database";
import { db } from "./config";

export const REFS = {
  currentRide: () => ref(db, "currentRide"),
  driverLocation: () => ref(db, "driverLocation"),
  rideStatus: () => ref(db, "currentRide/status"),
} as const;