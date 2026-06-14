import type { LocationOption } from "./types";
import { reverseGeocode } from "./geocoding";

/**
 * Gets the user's current GPS position via browser Geolocation API.
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

/**
 * Gets current location as a LocationOption with address.
 * Combines getCurrentPosition + reverseGeocode.
 */
export async function getCurrentLocationOption(): Promise<LocationOption | null> {
  try {
    const position = await getCurrentPosition();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const location = await reverseGeocode(lat, lng);

    if (location) return location;

    // Fallback — coords without address label
    return {
      label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat,
      lng,
    };
  } catch {
    return null;
  }
}