// src/pages/DriverPage.tsx

import { useEffect, useRef, useState, useCallback } from "react";
import RideMap, { type LatLng } from "@/components/Map/RideMap";
import DriverRequests from "@/components/Driver/DriverRequests";
import { Button } from "@/components/ui/button";
import {
  Car,
  CheckCircle2,
  XCircle,
  X,
  Navigation,
  Loader2,
} from "lucide-react";
import {
  acceptRide,
  rejectRide,
  startRide,
  completeRide,
  clearCurrentRide,
  updateDriverLocation,
  subscribeToCurrentRide,
  type CurrentRide,
  type RideStatus,
} from "@/services/firebase";
import { getAuthUser, getUserRole } from "@/lib/auth";
import { saveRideToHistory } from "@/services/rideApi";
import { Role } from "@/const/enum";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
// const KATHMANDU_CENTER: LatLng = [27.7172, 85.324];

// Simulated driver starting location (slightly offset from center)
const DRIVER_INITIAL_LOCATION: LatLng = [27.71, 85.31];

// GPS update interval in ms
const LOCATION_UPDATE_INTERVAL = 4000;

// ---------------------------------------------------------------------------
// Status Config
// ---------------------------------------------------------------------------
const STATUS_CONFIG: Record<
  RideStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  idle: {
    label: "Waiting for requests…",
    color: "text-zinc-400 border-zinc-700 bg-zinc-800",
    icon: Car,
  },
  requested: {
    label: "New ride request",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Navigation,
  },
  accepted: {
    label: "Ride accepted — Head to pickup",
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
    label: "Rider cancelled the ride",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    icon: XCircle,
  },
  rejected: {
    label: "Ride rejected",
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
        className={`h-3.5 w-3.5 ${status === "requested" ? "animate-bounce" : ""}`}
      />
      {config.label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Ride Panel (shown when ride is accepted or active)
// ---------------------------------------------------------------------------
function ActiveRidePanel({
  ride,
  onStart,
  onComplete,
  isStarting,
  isCompleting,
}: {
  ride: CurrentRide;
  onStart: () => void;
  onComplete: () => void;
  isStarting: boolean;
  isCompleting: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4 space-y-4">
      {/* Status */}
      <StatusBadge status={ride.status} />

      {/* Route */}
      <div className="relative space-y-3">
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

      {/* Rider ID */}
      <p className="text-xs text-zinc-500">
        Rider: <span className="text-zinc-300">{ride.riderId}</span>
      </p>

      {/* Actions based on status */}
      {ride.status === "accepted" && (
        <Button
          onClick={onStart}
          disabled={isStarting}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold disabled:opacity-60"
        >
          {isStarting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Car className="h-4 w-4 mr-2" />
          )}
          Start Ride
        </Button>
      )}

      {ride.status === "active" && (
        <Button
          onClick={onComplete}
          disabled={isCompleting}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold disabled:opacity-60"
        >
          {isCompleting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          )}
          Complete Ride
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Terminal State Panel (completed / cancelled / rejected)
// ---------------------------------------------------------------------------
function TerminalPanel({ status }: { status: RideStatus }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4">
      <StatusBadge status={status} />
      <p className="text-xs text-zinc-500 mt-3">Clearing in a moment…</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main DriverPage
// ---------------------------------------------------------------------------
export default function DriverPage() {
  const user = getAuthUser();

  // ── State ──
  const [currentRide, setCurrentRide] = useState<CurrentRide | null>(null);
  const [driverLocation, setDriverLocation] = useState<LatLng>(
    DRIVER_INITIAL_LOCATION,
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Refs ──
  const rideUnsubRef = useRef<(() => void) | null>(null);
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const initialCenterRef = useRef<LatLng>(DRIVER_INITIAL_LOCATION);

  // ── Start GPS simulation interval ──
  useEffect(() => {
    // Initial location push

    updateDriverLocation(
      DRIVER_INITIAL_LOCATION[0],
      DRIVER_INITIAL_LOCATION[1],
    );

    locationIntervalRef.current = setInterval(() => {
      setDriverLocation((prev) => {
        const jitter = () => (Math.random() - 0.5) * 0.002;
        const newLat = prev[0] + jitter();
        const newLng = prev[1] + jitter();

        // Push to Firebase
        updateDriverLocation(newLat, newLng).catch(() => {});

        return [newLat, newLng];
      });
    }, LOCATION_UPDATE_INTERVAL);

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  // ── Subscribe to currentRide ──
  useEffect(() => {
    rideUnsubRef.current = subscribeToCurrentRide((ride) => {
      setCurrentRide(ride);

      // Auto-clear terminal states after 3s
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
        }, 3000);
      }
    });

    return () => {
      rideUnsubRef.current?.();
    };
  }, []);

  // ── Handlers ──
  const handleAccept = useCallback(
    async (rideId: string) => {
      if (!user?.email) return;

      setError(null);
      setLoadingId(rideId);

      try {
        await acceptRide(user.email);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to accept ride.");
      } finally {
        setLoadingId(null);
      }
    },
    [user],
  );

  const handleReject = useCallback(async (rideId: string) => {
    setError(null);
    setLoadingId(rideId);

    try {
      await rejectRide();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject ride.");
    } finally {
      setLoadingId(null);
    }
  }, []);

  const handleStartRide = useCallback(async () => {
    setError(null);
    setIsStarting(true);

    try {
      await startRide();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start ride.");
    } finally {
      setIsStarting(false);
    }
  }, []);

  const handleCompleteRide = useCallback(async () => {
    setError(null);
    setIsCompleting(true);

    try {
      await completeRide();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete ride.");
    } finally {
      setIsCompleting(false);
    }
  }, []);

  // ── Derive what panel to show ──
  const isTerminal =
    currentRide?.status === "completed" ||
    currentRide?.status === "cancelled" ||
    currentRide?.status === "rejected";

  const isActiveRide =
    currentRide?.status === "accepted" || currentRide?.status === "active";

  const showRequests = !currentRide || currentRide.status === "idle";

  // ── Build requests list for DriverRequests component ──
  const requests =
    currentRide && currentRide.status === "requested"
      ? [
          {
            id: currentRide.id,
            pickup: currentRide.pickup,
            destination: currentRide.destination,
            requestedAt: currentRide.requestedAt,
          },
        ]
      : [];

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
        center={initialCenterRef.current}
        driverLocation={driverLocation}
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
        {/* Terminal state */}
        {isTerminal && currentRide && (
          <TerminalPanel status={currentRide.status} />
        )}

        {/* Active ride panel — accepted or active */}
        {isActiveRide && currentRide && (
          <ActiveRidePanel
            ride={currentRide}
            onStart={handleStartRide}
            onComplete={handleCompleteRide}
            isStarting={isStarting}
            isCompleting={isCompleting}
          />
        )}

        {/* Incoming requests list */}
        {(showRequests || currentRide?.status === "requested") && (
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
