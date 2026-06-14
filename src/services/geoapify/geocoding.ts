import { GEOAPIFY_API_KEY, GEOAPIFY_BASE_URL } from "./config";
import type { LocationOption } from "./types";

/**
 * Converts lat/lng coordinates to a human-readable address.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<LocationOption | null> {
  try {
    const url = `${GEOAPIFY_BASE_URL}/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.features?.length) return null;

    const props = data.features[0].properties;

    return {
      label: props.formatted ?? "",
      lat: props.lat ?? lat,
      lng: props.lon ?? lng,
    };
  } catch {
    return null;
  }
}