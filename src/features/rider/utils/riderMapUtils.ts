import type { LatLng } from "@/components/Map/RideMap";
import type { CurrentRide, DriverLocation } from "@/services/firebase";
import type { RidePhase } from "@/components/Map/RideMap";

export const KATHMANDU_CENTER: LatLng = [27.7172, 85.324];

export function derivePickupLatLng(ride: CurrentRide | null): LatLng | undefined {
  if (!ride?.pickupLat || !ride?.pickupLng) return undefined;
  return [ride.pickupLat, ride.pickupLng];
}

export function deriveDropoffLatLng(ride: CurrentRide | null): LatLng | undefined {
  if (!ride?.destinationLat || !ride?.destinationLng) return undefined;
  return [ride.destinationLat, ride.destinationLng];
}

export function deriveDriverLatLng(
  location: DriverLocation | null
): LatLng | undefined {
  if (!location) return undefined;
  return [location.lat, location.lng];
}

export function deriveRidePhase(ride: CurrentRide | null): RidePhase {
  if (ride?.status === "accepted") return "accepted";
  if (ride?.status === "active") return "active";
  return "none";
}