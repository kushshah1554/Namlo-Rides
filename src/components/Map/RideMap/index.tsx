import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import type { RideMapProps } from "./types";
import { KATHMANDU_CENTER, MAP_TILE_URL, MAP_TILE_ATTRIBUTION } from "./constants";
import MapController from "./MapController";
import MapMarkers from "./MapMarkers";
import MapRoutes from "./MapRoutes";

export type { LatLng, RidePhase } from "./types";

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
          attribution={MAP_TILE_ATTRIBUTION}
          url={MAP_TILE_URL}
        />

        <MapController center={center} />

        <MapRoutes
          ridePhase={ridePhase}
          driverLocation={driverLocation}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
        />

        <MapMarkers
          riderLocation={riderLocation}
          driverLocation={driverLocation}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          ridePhase={ridePhase}
        />
      </MapContainer>

      {/* Edge gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-zinc-950/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-zinc-950/20 to-transparent" />
    </div>
  );
}