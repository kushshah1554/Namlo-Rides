import { useState } from "react";
import { Loader2, Car, CheckCircle2,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CurrentRide } from "@/services/firebase";
import StatusBadge from "./StatusBadge";
import MinimizeButton from "@/components/shared/MinimizeButton";


interface ActiveRidePanelProps {
  ride: CurrentRide;
  onStart: () => void;
  onComplete: () => void;
  isStarting: boolean;
  isCompleting: boolean;
}

export default function ActiveRidePanel({
  ride,
  onStart,
  onComplete,
  isStarting,
  isCompleting,
}: ActiveRidePanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4 space-y-4 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between relative">
        <StatusBadge status={ride.status} />

        <MinimizeButton
          isMinimized={isMinimized}
          onToggle={() => setIsMinimized((prev) => !prev)}
          style={"absolute right-0 top-1 -translate-y-1/2"}
        />
      </div>

      {!isMinimized && (
        <>
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
                <p className="text-sm text-white font-medium">
                  {ride.destination}
                </p>
              </div>
            </div>
          </div>

          {/* Rider ID */}
          <p className="text-xs text-zinc-500">
            Rider: <span className="text-zinc-300">{ride.riderId}</span>
          </p>

          {/* Actions */}
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
        </>
      )}
    </div>
  );
}
