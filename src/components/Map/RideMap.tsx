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

export type RidePhase = "idle" | "accepted" | "active" | "none";

interface RideMapProps {
  center?: LatLng;
  riderLocation?: LatLng;
  driverLocation?: LatLng;
  pickupLocation?: LatLng;
  dropoffLocation?: LatLng;
  ridePhase?: RidePhase;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const KATHMANDU_CENTER: LatLng = [27.7172, 85.324];

// ---------------------------------------------------------------------------
// OSRM Route Fetcher
// ---------------------------------------------------------------------------
function decodePolyline(encoded: string): LatLng[] {
  const coords: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

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

async function fetchOsrmRoute(
  from: LatLng,
  to: LatLng
): Promise<LatLng[] | null> {
  try {
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

// Standing person — Rider
const riderIcon = createCustomIcon(
  "#f59e0b",
  "M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm2 7h-4a2 2 0 0 0-2 2v5h2v6h4v-6h2v-5a2 2 0 0 0-2-2z"
);

// Motorcycle — Driver
const driverIcon = createCustomIcon(
  "#ffffff",
  "M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H5v2h2.82zM19 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
);

// Flag — Dropoff
const dropoffIcon = createCustomIcon(
  "#10b981",
  "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"
);

// ---------------------------------------------------------------------------
// Map Controller
// ---------------------------------------------------------------------------
function MapController({ center }: { center?: LatLng }) {
  const map = useMap();
  const prevKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!center) return;
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
  color?: string;
}

function RoadRoute({ from, to, color = "#f59e0b" }: RoadRouteProps) {
  const [routeCoords, setRouteCoords] = useState<LatLng[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const routeKey = useMemo(
    () =>
      `${from[0].toFixed(4)},${from[1].toFixed(4)}-${to[0].toFixed(4)},${to[1].toFixed(4)}`,
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
    return (
      <Polyline
        pathOptions={{
          color,
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
      <Polyline
        pathOptions={{
          color: "#000000",
          weight: 7,
          opacity: 0.2,
        }}
        positions={routeCoords}
      />
      <Polyline
        pathOptions={{
          color,
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
  ridePhase = "none",
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

        {/* ── Route: accepted → driver heading to pickup (blue dashed) ── */}
        {ridePhase === "accepted" && driverLocation && pickupLocation && (
          <RoadRoute from={driverLocation} to={pickupLocation} color="#3b82f6" />
        )}

        {/* ── Route: active → pickup to dropoff (amber solid) ── */}
        {ridePhase === "active" && pickupLocation && dropoffLocation && (
          <RoadRoute from={pickupLocation} to={dropoffLocation} color="#f59e0b" />
        )}

        {/* Pickup Marker */}
        {pickupLocation && (
          <Marker position={pickupLocation} icon={riderIcon}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {/* Dropoff Marker — only show during active ride */}
        {dropoffLocation && ridePhase === "active" && (
          <Marker position={dropoffLocation} icon={dropoffIcon}>
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}

        {/* Rider Live Location — only when no active ride */}
        {riderLocation && ridePhase === "none" && (
          <Marker position={riderLocation} icon={riderIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Driver Live Location — always visible */}
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