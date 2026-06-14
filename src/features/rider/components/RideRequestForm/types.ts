export interface RideRequestData {
  pickup: string;
  pickupLat: number;
  pickupLng: number;
  destination: string;
  destinationLat: number;
  destinationLng: number;
}

export interface RideRequestFormProps {
  onSubmit: (data: RideRequestData) => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}