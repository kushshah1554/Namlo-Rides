import { useMemo } from "react";
import RideMap from "@/components/Map/RideMap";
import DriverRequests from "./components/DriverRequests";
import { useDriverGps } from "./hooks/useDriverGps";
import { useDriverRealtime } from "./hooks/useDriverRealtime";
import { useDriverActions } from "./hooks/useDriverActions";
import ActiveRidePanel from "./components/ActiveRidePanel";
import TerminalPanel from "./components/TerminalPanel";
import ErrorToast from "@/components/shared/ErrorToast";
import {
  derivePickupLatLng,
  deriveDropoffLatLng,
  deriveRidePhase,
  buildRequestsList,
} from "./utils/driverMapUtils";

export default function DriverPage() {
  const { driverLocation, initialCenterRef } = useDriverGps();
  const { currentRide } = useDriverRealtime();
  const {
    loadingId,
    isStarting,
    isCompleting,
    error,
    clearError,
    handleAccept,
    handleReject,
    handleStartRide,
    handleCompleteRide,
  } = useDriverActions();

  // ── Derived values ──
  const pickupLatLng = useMemo(
    () => derivePickupLatLng(currentRide),
    [currentRide]
  );
  const dropoffLatLng = useMemo(
    () => deriveDropoffLatLng(currentRide),
    [currentRide]
  );
  const ridePhase = useMemo(
    () => deriveRidePhase(currentRide),
    [currentRide]
  );
  const requests = useMemo(
    () => buildRequestsList(currentRide),
    [currentRide]
  );

  // ── Panel visibility ──
  const isTerminal =
    currentRide?.status === "completed" ||
    currentRide?.status === "cancelled" ||
    currentRide?.status === "rejected";

  const isActiveRide =
    currentRide?.status === "accepted" ||
    currentRide?.status === "active";

  const showRequests =
    !currentRide ||
    currentRide.status === "idle" ||
    currentRide.status === "requested";

  return (
    <div className="relative h-[calc(100vh-56px)] w-full">
      {/* Map */}
      <RideMap
        center={initialCenterRef.current}
        driverLocation={driverLocation}
        pickupLocation={pickupLatLng}
        dropoffLocation={dropoffLatLng}
        ridePhase={ridePhase}
      />

      {/* Error Toast */}
      {error && <ErrorToast error={error} onDismiss={clearError} />}

      {/* Bottom Right Panel */}
      <div className="absolute bottom-6 right-6 w-full max-w-md z-10 space-y-3">
        {/* Terminal state */}
        {isTerminal && currentRide && (
          <TerminalPanel status={currentRide.status} />
        )}

        {/* Active ride panel */}
        {isActiveRide && currentRide && (
          <ActiveRidePanel
            ride={currentRide}
            onStart={handleStartRide}
            onComplete={handleCompleteRide}
            isStarting={isStarting}
            isCompleting={isCompleting}
          />
        )}

        {/* Incoming requests */}
        {showRequests && (
          <DriverRequests
            requests={requests}
            onAccept={handleAccept}
            onReject={handleReject}
            loadingId={loadingId}
          />
        )}
      </div>
    </div>
  );
}