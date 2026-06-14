export const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY as string;
export const GEOAPIFY_BASE_URL = import.meta.env.VITE_GEOAPIFY_BASE_URL as string;

// Kathmandu bias for local search accuracy
export const KATHMANDU_BIAS = "proximity:85.324,27.7172";
export const NEPAL_FILTER = "countrycode:np";
export const DEFAULT_LIMIT = 4;