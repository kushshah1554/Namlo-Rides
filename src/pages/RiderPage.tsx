// src/pages/RiderPage.tsx

import { useEffect, useRef, useState, useCallback } from "react";
import RideMap, { type LatLng } from "@/components/Map/RideMap";
import RideRequestForm from "@/components/Rider/RideRequestForm";
import { Button } from "@/components/ui/button";
import { Loader2, X, Car, MapPin, CheckCircle2, XCircle } from "lucide-react";
import {
  createRideRequest,
  cancelRide,
  subscribeToCurrentRide,
  subscribeToDriverLocation,
  clearCurrentRide,
  type CurrentRide,
  type DriverLocation,
  type RideStatus,
} from "@/services/firebase";
import { getAuthUser, getUserRole } from "@/lib/auth";
import { saveRideToHistory } from "@/services/rideApi";
import { Role } from "@/const/enum";

import type { RideRequestData } from "@/components/Rider/RideRequestForm";

// ---------------------------------------------------------------------------
// Kathmandu default center
// ---------------------------------------------------------------------------
const KATHMANDU_CENTER: LatLng = [27.7172, 85.324];

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------
const STATUS_CONFIG: Record<
  RideStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  idle: {
    label: "Idle",
    color: "text-zinc-400 border-zinc-700 bg-zinc-800",
    icon: MapPin,
  },
  requested: {
    label: "Finding a driver…",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Loader2,
  },
  accepted: {
    label: "Driver accepted",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Car,
  },
  active: {
    label: "Ride in progress",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Car,
  },
  completed: {
    label: "Ride completed",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Ride cancelled",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    icon: XCircle,
  },
  rejected: {
    label: "Ride rejected by driver",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    icon: XCircle,
  },
};

function StatusBadge({ status }: { status: RideStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.color}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${status === "requested" ? "animate-spin" : ""}`}
      />
      {config.label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ride Info Panel (shown after request)
// ---------------------------------------------------------------------------
function ActiveRidePanel({
  ride,
  onCancel,
  isCancelling,
}: {
  ride: CurrentRide;
  onCancel: () => void;
  isCancelling: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4 space-y-4">
      {/* Status */}
      <div className="flex items-center justify-between">
        <StatusBadge status={ride.status} />
      </div>

      {/* Route */}
      <div className="relative space-y-3">
        {/* Connector line */}
        <div className="absolute left-2.25 top-2.5 h-[calc(100%-16px)] w-0.5 bg-linear-to-b from-amber-500 to-emerald-500 opacity-30" />

        <div className="flex items-start gap-3">
          <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
          <div>
            <p className="text-xs text-zinc-500">Pickup</p>
            <p className="text-sm text-white font-medium">{ride.pickup}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
          <div>
            <p className="text-xs text-zinc-500">Destination</p>
            <p className="text-sm text-white font-medium">{ride.destination}</p>
          </div>
        </div>
      </div>

      {/* Cancel button — only show when ride can still be cancelled */}
      {ride.status === "requested" && (
        <Button
          onClick={onCancel}
          disabled={isCancelling}
          variant="outline"
          className="w-full border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 font-semibold"
        >
          {isCancelling ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <X className="h-4 w-4 mr-2" />
          )}
          Cancel Ride
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main RiderPage
// ---------------------------------------------------------------------------
export default function RiderPage() {
  const user = getAuthUser();

  // ── State ──
  const [currentRide, setCurrentRide] = useState<CurrentRide | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(
    null,
  );
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Refs for cleanup ──
  const rideUnsubRef = useRef<(() => void) | null>(null);
  const locationUnsubRef = useRef<(() => void) | null>(null);

  // ── Derived map props ──
  const riderLatLng: LatLng = KATHMANDU_CENTER;

  const driverLatLng: LatLng | undefined = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : undefined;

  // ── Subscribe to Firebase on mount ──
  useEffect(() => {
    // Listen to currentRide
    rideUnsubRef.current = subscribeToCurrentRide((ride) => {
      setCurrentRide(ride);

      // Auto-clear terminal states after 3s so form reappears
      if (
        ride?.status === "completed" ||
        ride?.status === "cancelled" ||
        ride?.status === "rejected"
      ) {
        setTimeout(async () => {
          if (getUserRole() === Role.RIDER) {
            try {
              // 1. Save to MockAPI history first
              await saveRideToHistory(ride);
            } catch (err) {
              console.error("[rideApi] Failed to save ride to history:", err);
            } finally {
              // 2. Always clear Firebase regardless of MockAPI result
              await clearCurrentRide();
              setCurrentRide(null);
            }
          }
        }, 1000);
      }
    });

    // Listen to driver location
    locationUnsubRef.current = subscribeToDriverLocation((location) => {
      setDriverLocation(location);
    });

    // ── Cleanup on unmount ──
    return () => {
      rideUnsubRef.current?.();
      locationUnsubRef.current?.();
    };
  }, []);

  // ── Handlers ──
  const handleRideRequest = useCallback(
    async (data: RideRequestData) => {
      if (!user?.email) {
        setError("You must be logged in to request a ride.");
        return;
      }

      setError(null);
      setIsRequesting(true);

      try {
        await createRideRequest(
          data.pickup,
          data.destination,
          user.email,
          data.pickupLat,
          data.pickupLng,
          data.destinationLat,
          data.destinationLng,
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create ride request.",
        );
      } finally {
        setIsRequesting(false);
      }
    },
    [user],
  );

  const handleCancelRide = useCallback(async () => {
    setError(null);
    setIsCancelling(true);

    try {
      await cancelRide();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel ride.");
    } finally {
      setIsCancelling(false);
    }
  }, []);

  // ── Determine if form should show ──
  const showForm = !currentRide || currentRide.status === "idle";
  const showActivePanel = currentRide && currentRide.status !== "idle";

  const pickupLatLng: LatLng | undefined =
    currentRide?.pickupLat && currentRide?.pickupLng
      ? [currentRide.pickupLat, currentRide.pickupLng]
      : undefined;

  const dropoffLatLng: LatLng | undefined =
    currentRide?.destinationLat && currentRide?.destinationLng
      ? [currentRide.destinationLat, currentRide.destinationLng]
      : undefined;

  const ridePhase =
    currentRide?.status === "accepted"
      ? "accepted"
      : currentRide?.status === "active"
        ? "active"
        : "none";

  return (
    <div className="relative h-[calc(100vh-56px)] w-full">
      {/* ── Full screen map ── */}
      <RideMap
        center={pickupLatLng ?? KATHMANDU_CENTER}
        riderLocation={pickupLatLng ?? riderLatLng}
        driverLocation={driverLatLng}
        pickupLocation={pickupLatLng}
        dropoffLocation={dropoffLatLng}
        ridePhase={ridePhase}
      />

      {/* ── Error Toast ── */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
          <div className="flex items-center gap-2 rounded-xl border border-red-800 bg-red-950/90 px-4 py-3 text-sm text-red-300 shadow-lg backdrop-blur-sm">
            <XCircle className="h-4 w-4 shrink-0 text-red-400" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Right Panel ── */}
      <div className="absolute bottom-6 right-6 w-full max-w-sm z-10 space-y-3">
        {/* Active ride info panel */}
        {showActivePanel && (
          <ActiveRidePanel
            ride={currentRide}
            onCancel={handleCancelRide}
            isCancelling={isCancelling}
          />
        )}

        {/* Ride request form — hidden when ride is active */}
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
