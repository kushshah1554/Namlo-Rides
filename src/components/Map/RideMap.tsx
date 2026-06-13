import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type LatLng = [number, number];

interface RideMapProps {
  center?: LatLng;
  riderLocation?: LatLng;
  driverLocation?: LatLng;
  pickupLocation?: LatLng;
  dropoffLocation?: LatLng;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const KATHMANDU_CENTER: LatLng = [27.7172, 85.324];

// ---------------------------------------------------------------------------
// OSRM Route Fetcher
// ---------------------------------------------------------------------------

/**
 * Decodes a Google-encoded polyline string into an array of [lat, lng] pairs.
 * OSRM returns geometry encoded in this format.
 */
function decodePolyline(encoded: string): LatLng[] {
  const coords: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    // Decode latitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    // Decode longitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coords.push([lat / 1e5, lng / 1e5]);
  }

  return coords;
}

/**
 * Fetches a road-following route from OSRM public API.
 * Returns an array of [lat, lng] waypoints that follow actual roads.
 */
async function fetchOsrmRoute(
  from: LatLng,
  to: LatLng
): Promise<LatLng[] | null> {
  try {
    // OSRM expects [lng, lat] order (GeoJSON standard)
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=polyline`;

    const res = await fetch(url);

    if (!res.ok) return null;

    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.length) return null;

    return decodePolyline(data.routes[0].geometry);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Custom Map Icons
// ---------------------------------------------------------------------------
const createCustomIcon = (color: string, iconPath: string) => {
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #18181b;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#18181b">
          ${iconPath}
        </svg>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -44],
  });
};

const riderIcon = createCustomIcon(
  "#f59e0b",
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
);

const driverIcon = createCustomIcon(
  "#ffffff",
  "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
);

const dropoffIcon = createCustomIcon(
  "#10b981",
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
);

// ---------------------------------------------------------------------------
// Map Controller
// ---------------------------------------------------------------------------
function MapController({ center }: { center?: LatLng }) {
  const map = useMap();
  const prevKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!center) return;

    // Round to 4 decimal places (~11m precision) to avoid flying on tiny GPS jitter
    const key = `${center[0].toFixed(4)},${center[1].toFixed(4)}`;

    if (prevKeyRef.current === key) return;

    prevKeyRef.current = key;
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);

  return null;
}

// ---------------------------------------------------------------------------
// Road Route Polyline Component
// ---------------------------------------------------------------------------
interface RoadRouteProps {
  from: LatLng;
  to: LatLng;
}

function RoadRoute({ from, to }: RoadRouteProps) {
  const [routeCoords, setRouteCoords] = useState<LatLng[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stable key to avoid re-fetching on every render
  const routeKey = useMemo(
    () => `${from[0]},${from[1]}-${to[0]},${to[1]}`,
    [from, to]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchOsrmRoute(from, to).then((coords) => {
      if (!cancelled) {
        setRouteCoords(coords);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [routeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !routeCoords) {
    // Fallback: straight dashed line while route is loading
    return (
      <Polyline
        pathOptions={{
          color: "#f59e0b",
          weight: 3,
          opacity: 0.4,
          dashArray: "8, 8",
        }}
        positions={[from, to]}
      />
    );
  }

  return (
    <>
      {/* Route shadow for depth */}
      <Polyline
        pathOptions={{
          color: "#000000",
          weight: 7,
          opacity: 0.2,
        }}
        positions={routeCoords}
      />

      {/* Main amber route line */}
      <Polyline
        pathOptions={{
          color: "#f59e0b",
          weight: 4,
          opacity: 0.9,
        }}
        positions={routeCoords}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main RideMap Component
// ---------------------------------------------------------------------------
export default function RideMap({
  center,
  riderLocation,
  driverLocation,
  pickupLocation,
  dropoffLocation,
  className = "h-full w-full z-0",
}: RideMapProps) {
  const initialCenter =
    center || riderLocation || driverLocation || KATHMANDU_CENTER;

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={initialCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController center={center} />

        {/* Road-following route between pickup and dropoff */}
        {pickupLocation && dropoffLocation && (
          <RoadRoute from={pickupLocation} to={dropoffLocation} />
        )}

        {/* Pickup Marker */}
        {pickupLocation && (
          <Marker position={pickupLocation} icon={riderIcon}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {/* Dropoff Marker */}
        {dropoffLocation && (
          <Marker position={dropoffLocation} icon={dropoffIcon}>
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}

        {/* Rider Live Location */}
        {riderLocation && !pickupLocation && (
          <Marker position={riderLocation} icon={riderIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Driver Live Location */}
        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon}>
            <Popup>Driver Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Edge gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-zinc-950/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-zinc-950/20 to-transparent" />
    </div>
  );
}