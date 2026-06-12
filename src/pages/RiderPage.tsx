import RideMap from "@/components/Map/RideMap";
import RideRequestForm from "@/components/Rider/RideRequestForm";

export default function RiderPage() {
  const handleRideRequest = async (data: {
    pickup: string;
    destination: string;
  }) => {
    console.log("Ride Requested:", data);
    // TODO: Write to Firebase Realtime DB
  };

  return (
    <div className="h-[calc(100vh-56px)] w-full">
     <RideMap
        center={[27.7172, 85.324]}
        riderLocation={[27.7172, 85.324]}
      />

      {/* Floating ride request form */}
      <div className="absolute bottom-6 right-6 w-full max-w-sm z-10">
        <RideRequestForm onSubmit={handleRideRequest} />
      </div>
    </div>
  );
}
