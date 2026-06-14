import type { LatLng } from "./types";

export const KATHMANDU_CENTER: LatLng = [27.7172, 85.324];

export const MAP_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

export const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors';

export const ROUTE_COLORS = {
  accepted: "#3b82f6",
  active: "#f59e0b",
} as const;