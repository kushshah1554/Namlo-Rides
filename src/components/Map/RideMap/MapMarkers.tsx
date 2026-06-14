import { Marker, Popup } from "react-leaflet";
import type { LatLng, RidePhase } from "./types";
import { riderIcon, driverIcon, dropoffIcon } from "./mapIcons";

interface MapMarkersProps {
  riderLocation?: LatLng;
  driverLocation?: LatLng;
  pickupLocation?: LatLng;
  dropoffLocation?: LatLng;
  ridePhase: RidePhase;
}

export default function MapMarkers({
  riderLocation,
  driverLocation,
  pickupLocation,
  dropoffLocation,
  ridePhase,
}: MapMarkersProps) {
  return (
    <>
      {/* Pickup marker */}
      {pickupLocation && (
        <Marker position={pickupLocation} icon={riderIcon}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {/* Dropoff marker — only during active ride */}
      {dropoffLocation && ridePhase === "active" && (
        <Marker position={dropoffLocation} icon={dropoffIcon}>
          <Popup>Dropoff Location</Popup>
        </Marker>
      )}

      {/* Rider location — only when no active ride */}
      {riderLocation && ridePhase === "none" && (
        <Marker position={riderLocation} icon={riderIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Driver location — always visible */}
      {driverLocation && (
        <Marker position={driverLocation} icon={driverIcon}>
          <Popup>Driver Location</Popup>
        </Marker>
      )}
    </>
  );
}