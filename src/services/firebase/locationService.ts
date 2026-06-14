import { set } from "firebase/database";
import { REFS } from "./refs";

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