import { useMemo } from "react";
import RideMap from "@/components/Map/RideMap";
import RideRequestForm from "./components/RideRequestForm";
import { useRiderRealtime } from "./hooks/useRiderRealtime";
import { useRiderActions } from "./hooks/useRiderActions";
import ActiveRidePanel from "./components/ActiveRidePanel";
import ErrorToast from "@/components/shared/ErrorToast";

import {
  KATHMANDU_CENTER,
  derivePickupLatLng,
  deriveDropoffLatLng,
  deriveDriverLatLng,
  deriveRidePhase,
} from "./utils/riderMapUtils";

export default function RiderPage() {
  const { currentRide, driverLocation } = useRiderRealtime();
  const {
    isRequesting,
    isCancelling,
    error,
    clearError,
    handleRideRequest,
    handleCancelRide,
  } = useRiderActions();

  // ── Derived values ──
  const pickupLatLng = useMemo(
    () => derivePickupLatLng(currentRide),
    [currentRide]
  );
  const dropoffLatLng = useMemo(
    () => deriveDropoffLatLng(currentRide),
    [currentRide]
  );
  const driverLatLng = useMemo(
    () => deriveDriverLatLng(driverLocation),
    [driverLocation]
  );
  const ridePhase = useMemo(
    () => deriveRidePhase(currentRide),
    [currentRide]
  );

  const showForm = !currentRide || currentRide.status === "idle";
  const showActivePanel = currentRide && currentRide.status !== "idle";

  return (
    <div className="relative h-[calc(100vh-56px)] w-full">
      {/* Map */}
      <RideMap
        center={pickupLatLng ?? KATHMANDU_CENTER}
        riderLocation={pickupLatLng ?? KATHMANDU_CENTER}
        driverLocation={driverLatLng}
        pickupLocation={pickupLatLng}
        dropoffLocation={dropoffLatLng}
        ridePhase={ridePhase}
      />

      {/* Error Toast */}
      {error && <ErrorToast error={error} onDismiss={clearError} />}

      {/* Bottom Right Panel */}
      <div className="absolute bottom-6 right-6 w-full max-w-sm z-10 space-y-3">
        {showActivePanel && (
          <ActiveRidePanel
            ride={currentRide}
            onCancel={handleCancelRide}
            isCancelling={isCancelling}
          />
        )}

        {showForm && (
          <RideRequestForm
            onSubmit={handleRideRequest}
            isLoading={isRequesting}
          />
        )}
      </div>
    </div>
  );
}