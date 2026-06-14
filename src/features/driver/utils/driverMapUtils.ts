import type { LatLng } from "@/components/Map/RideMap";
import type { CurrentRide } from "@/services/firebase";
import type { RidePhase } from "@/components/Map/RideMap";

export const DRIVER_INITIAL_LOCATION: LatLng = [27.71, 85.31];
export const LOCATION_UPDATE_INTERVAL = 4000;

export function derivePickupLatLng(
  ride: CurrentRide | null
): LatLng | undefined {
  if (!ride?.pickupLat || !ride?.pickupLng) return undefined;
  return [ride.pickupLat, ride.pickupLng];
}

export function deriveDropoffLatLng(
  ride: CurrentRide | null
): LatLng | undefined {
  if (!ride?.destinationLat || !ride?.destinationLng) return undefined;
  return [ride.destinationLat, ride.destinationLng];
}

export function deriveRidePhase(ride: CurrentRide | null): RidePhase {
  if (ride?.status === "accepted") return "accepted";
  if (ride?.status === "active") return "active";
  return "none";
}

export function buildRequestsList(ride: CurrentRide | null) {
  if (!ride || ride.status !== "requested") return [];
  return [
    {
      id: ride.id,
      pickup: ride.pickup,
      destination: ride.destination,
      requestedAt: ride.requestedAt,
    },
  ];
}