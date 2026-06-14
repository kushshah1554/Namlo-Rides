import {
  GEOAPIFY_API_KEY,
  GEOAPIFY_BASE_URL,
  KATHMANDU_BIAS,
  NEPAL_FILTER,
  DEFAULT_LIMIT,
} from "./config";
import type { GeoapifyFeature, LocationOption } from "./types";

/**
 * Fetches autocomplete suggestions from Geoapify API.
 * Filtered to Nepal, biased toward Kathmandu.
 */
export async function searchPlaces(query: string): Promise<LocationOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const url = `${GEOAPIFY_BASE_URL}/geocode/autocomplete?text=${encodeURIComponent(
      query
    )}&filter=${NEPAL_FILTER}&bias=${KATHMANDU_BIAS}&apiKey=${GEOAPIFY_API_KEY}&limit=${DEFAULT_LIMIT}`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.features?.length) return [];

    return data.features.map((item: GeoapifyFeature) => ({
      label: item.properties.formatted,
      lat: item.properties.lat,
      lng: item.properties.lon,
    }));
  } catch {
    return [];
  }
}