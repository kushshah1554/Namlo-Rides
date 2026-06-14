import { MapPin, Navigation, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RideRequest {
  id: string;
  pickup: string;
  destination: string;
  riderId?: string;
  requestedAt?: number;
}

interface RequestCardProps {
  request: RideRequest;
  onAccept: () => void;
  onReject: () => void;
  isLoading: boolean;
}

export default function RequestCard({
  request,
  onAccept,
  onReject,
  isLoading,
}: RequestCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-4 transition-colors hover:border-zinc-700">
      {/* Route Info */}
      <div className="relative space-y-3">
        {/* Vertical connector */}
        <div className="absolute left-2.25 top-2.5 h-[calc(100%-16px)] w-0.5 bg-linear-to-b from-amber-500 to-emerald-500 opacity-30" />

        {/* Pickup */}
        <div className="flex items-start gap-3">
          <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
          <div>
            <p className="text-xs font-medium text-zinc-500 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-amber-400" />
              Pickup
            </p>
            <p className="text-sm text-white font-medium">{request.pickup}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3">
          <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
          <div>
            <p className="text-xs font-medium text-zinc-500 flex items-center gap-1">
              <Navigation className="h-3 w-3 text-emerald-400" />
              Destination
            </p>
            <p className="text-sm text-white font-medium">
              {request.destination}
            </p>
          </div>
        </div>
      </div>

      {/* Time */}
      {request.requestedAt && (
        <p className="text-xs text-zinc-500">
          Requested{" "}
          {new Date(request.requestedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onAccept}
          disabled={isLoading}
          className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              Accept
            </>
          )}
        </Button>

        <Button
          onClick={onReject}
          disabled={isLoading}
          variant="outline"
          className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 font-semibold disabled:opacity-60"
        >
          <X className="h-4 w-4 mr-1.5" />
          Reject
        </Button>
      </div>
    </div>
  );
}