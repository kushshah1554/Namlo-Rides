export type RideStatus =
  | "idle"
  | "requested"
  | "accepted"
  | "active"
  | "completed"
  | "cancelled"
  | "rejected";

export interface DriverLocation {
  lat: number;
  lng: number;
  updatedAt: number | null;
}

export interface CurrentRide {
  id: string;
  pickup: string;
  destination: string;
  status: RideStatus;
  riderId: string;
  driverId?: string | null;
  requestedAt: number;
  acceptedAt?: number | null;
  completedAt?: number | null;
  pickupLat?: number | null;
  pickupLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
}