
import { MapPin, Navigation, Check, X, Loader2,Minus, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RideRequest {
  id: string;
  pickup: string;
  destination: string;
  riderId?: string;
  requestedAt?: number;
}

interface DriverRequestsProps {
  requests: RideRequest[];
  onAccept: (rideId: string) => void | Promise<void>;
  onReject: (rideId: string) => void | Promise<void>;
  loadingId?: string | null;
}

// ---------------------------------------------------------------------------
// Single Request Card
// ---------------------------------------------------------------------------
function RequestCard({
  request,
  onAccept,
  onReject,
  isLoading,
}: {
  request: RideRequest;
  onAccept: () => void;
  onReject: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-4 transition-colors hover:border-zinc-700">
      {/* ── Route Info ── */}
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

      {/* ── Time ── */}
      {request.requestedAt && (
        <p className="text-xs text-zinc-500">
          Requested{" "}
          {new Date(request.requestedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      {/* ── Actions ── */}
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

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
        <Navigation className="h-6 w-6 text-zinc-500" />
      </div>
      <p className="text-sm font-medium text-zinc-400">No ride requests</p>
      <p className="text-xs text-zinc-500 mt-1">
        New requests will appear here in real time.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function DriverRequests({
  requests,
  onAccept,
  onReject,
  loadingId = null,
}: DriverRequestsProps) {
    const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl p-2 transition-all duration-300">
      <CardHeader className="pb-4 pt-5 px-6">
        <div className="flex items-center justify-between required:">
          <div>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Ride Requests
            </CardTitle>
            {!isMinimized && (
              <CardDescription className="text-zinc-400 mt-1">
                Incoming ride requests from riders.
              </CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2">
            {requests.length > 0 && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                {requests.length}
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsMinimized((prev) => !prev)}
              className={`${!isMinimized &&  "absolute right-4 top-5 -translate-y-1/2"} flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors`}
              aria-label={isMinimized ? "Expand requests" : "Minimize requests"}
            >
              {isMinimized ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="px-6 pb-6">
          {requests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 max-h-100 overflow-y-auto pr-1 custom-scrollbar">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => onAccept(request.id)}
                  onReject={() => onReject(request.id)}
                  isLoading={loadingId === request.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
