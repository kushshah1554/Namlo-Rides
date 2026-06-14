const BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL as string;

if (!BASE_URL) {
  console.warn(
    "[rideApi] VITE_MOCKAPI_BASE_URL is not set. Ride history will not work."
  );
}

export const RIDES_ENDPOINT = BASE_URL;