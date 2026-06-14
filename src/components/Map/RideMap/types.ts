export type LatLng = [number, number];

export type RidePhase = "idle" | "accepted" | "active" | "none";

export interface RideMapProps {
  center?: LatLng;
  riderLocation?: LatLng;
  driverLocation?: LatLng;
  pickupLocation?: LatLng;
  dropoffLocation?: LatLng;
  ridePhase?: RidePhase;
  className?: string;
}