import type { LatLng, RidePhase } from "./types";
import { ROUTE_COLORS } from "./constants";
import RoadRoute from "./RoadRoute";

interface MapRoutesProps {
  ridePhase: RidePhase;
  driverLocation?: LatLng;
  pickupLocation?: LatLng;
  dropoffLocation?: LatLng;
}

export default function MapRoutes({
  ridePhase,
  driverLocation,
  pickupLocation,
  dropoffLocation,
}: MapRoutesProps) {
  return (
    <>
      {/* accepted — driver heading to pickup */}
      {ridePhase === "accepted" && driverLocation && pickupLocation && (
        <RoadRoute
          from={driverLocation}
          to={pickupLocation}
          color={ROUTE_COLORS.accepted}
        />
      )}

      {/* active — pickup to dropoff */}
      {ridePhase === "active" && pickupLocation && dropoffLocation && (
        <RoadRoute
          from={pickupLocation}
          to={dropoffLocation}
          color={ROUTE_COLORS.active}
        />
      )}
    </>
  );
}