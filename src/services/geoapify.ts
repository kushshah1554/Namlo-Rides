// src/services/geoapify.ts

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const BASE_URL = import.meta.env.VITE_GEOAPIFY_BASE_URL;

export interface LocationOption {
  label: string;
  lat: number;
  lng: number;
}

/**
 * Fetches autocomplete suggestions from Geoapify API.
 * Filtered to Nepal, biased toward Kathmandu center.
 */
export async function searchPlaces(query: string): Promise<LocationOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const url = `${BASE_URL}/geocode/autocomplete?text=${encodeURIComponent(
      query
    )}&filter=countrycode:np&bias=proximity:85.324,27.7172&apiKey=${API_KEY}&limit=5`;

    const res = await fetch(url);

    if (!res.ok) return [];

    const data = await res.json();

    if (!data.features?.length) return [];

    return data.features.map(
      (item: {
        properties: { formatted: string; lat: number; lon: number };
      }) => ({
        label: item.properties.formatted,
        lat: item.properties.lat,
        lng: item.properties.lon,
      })
    );
  } catch {
    return [];
  }
}