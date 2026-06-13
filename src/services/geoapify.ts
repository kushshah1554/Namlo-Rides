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
 */
export async function searchPlaces(query: string): Promise<LocationOption[]> {
  if (!query || query.length < 2) return [];

  try {
    const url = `${BASE_URL}/geocode/autocomplete?text=${encodeURIComponent(
      query
    )}&filter=countrycode:np&bias=proximity:85.324,27.7172&apiKey=${API_KEY}&limit=4`;

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

/**
 * Converts lat/lng coordinates to a human-readable address.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<LocationOption | null> {
  try {
    const url = `${BASE_URL}/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${API_KEY}`;

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

    // Fallback — return coords without address
    return {
      label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat,
      lng,
    };
  } catch {
    return null;
  }
}