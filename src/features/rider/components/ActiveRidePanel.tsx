import { useState } from "react";
import { Loader2, X, ChevronUp, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CurrentRide } from "@/services/firebase";
import StatusBadge from "./StatusBadge";

interface ActiveRidePanelProps {
  ride: CurrentRide;
  onCancel: () => void;
  isCancelling: boolean;
}

export default function ActiveRidePanel({
  ride,
  onCancel,
  isCancelling,
}: ActiveRidePanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4 space-y-4 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <StatusBadge status={ride.status} />

        <button
          type="button"
          onClick={() => setIsMinimized((prev) => !prev)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label={isMinimized ? "Expand panel" : "Minimize panel"}
        >
          {isMinimized ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
        </button>
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

          {/* Cancel button */}
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
        </>
      )}
    </div>
  );
}