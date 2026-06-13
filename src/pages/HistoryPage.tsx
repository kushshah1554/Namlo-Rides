// src/pages/HistoryPage.tsx

import { useMemo, useState } from "react";
import { useRideHistory } from "@/hooks/useRideHistory";
import type { RideHistoryEntry } from "@/services/rideApi";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  MapPin,
  Navigation,
  Car,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Status Config — with fallback
// ---------------------------------------------------------------------------
const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    icon: XCircle,
  },
  rejected: {
    label: "Rejected",
    color: "text-zinc-400 bg-zinc-800 border-zinc-700",
    icon: XCircle,
  },
} as const;

// Fallback for unknown statuses coming from MockAPI
const FALLBACK_CONFIG = {
  label: "Unknown",
  color: "text-zinc-500 bg-zinc-800 border-zinc-700",
  icon: HelpCircle,
};

// ---------------------------------------------------------------------------
// Status Badge — safe with fallback
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: string }) {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? FALLBACK_CONFIG;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDuration(
  startMs?: number | null,
  endMs?: number | null
): string {
  if (!startMs || !endMs) return "—";
  const diffMs = endMs - startMs;
  const mins = Math.floor(diffMs / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatTime(ms?: number | null): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Ride Row — uses index-based fallback key
// ---------------------------------------------------------------------------
function RideRow({
  ride,
  index,
}: {
  ride: RideHistoryEntry;
  index: number;
}) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors">
      <td className="py-4 px-4 text-xs text-zinc-500">#{index + 1}</td>

      <td className="py-4 px-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-white">
            <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-40">{ride.pickup}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Navigation className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-40">{ride.destination}</span>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <StatusBadge status={ride.status} />
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Car className="h-3.5 w-3.5 text-zinc-500" />
          {ride.driverId ? (
            <span className="truncate max-w-30">{ride.driverId}</span>
          ) : (
            <span className="text-zinc-600 italic">No driver</span>
          )}
        </div>
      </td>

      <td className="py-4 px-4 text-xs text-zinc-400">
        {formatDuration(ride.acceptedAt, ride.completedAt)}
      </td>

      <td className="py-4 px-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTime(ride.completedAt ?? ride.requestedAt)}
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Summary Cards
// ---------------------------------------------------------------------------
function SummaryCards({ rides }: { rides: RideHistoryEntry[] }) {
  const stats = useMemo(
    () => ({
      total: rides.length,
      completed: rides.filter((r) => r.status === "completed").length,
      cancelled: rides.filter((r) => r.status === "cancelled").length,
      rejected: rides.filter((r) => r.status === "rejected").length,
    }),
    [rides]
  );

  const cards = [
    { label: "Total Rides", value: stats.total, color: "text-white", border: "border-zinc-700" },
    { label: "Completed", value: stats.completed, color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Cancelled", value: stats.cancelled, color: "text-red-400", border: "border-red-500/20" },
    { label: "Rejected", value: stats.rejected, color: "text-zinc-400", border: "border-zinc-700" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border ${card.border} bg-zinc-900 px-4 py-3`}
        >
          <p className="text-xs text-zinc-500 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
        <Car className="h-7 w-7 text-zinc-500" />
      </div>
      <p className="text-sm font-medium text-zinc-400">No ride history yet</p>
      <p className="text-xs text-zinc-500 mt-1">
        Completed, cancelled, and rejected rides will appear here.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main HistoryPage
// ---------------------------------------------------------------------------
export default function HistoryPage() {
  const { rides, isLoading, error, refetch } = useRideHistory();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetch = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  // Deduplicate rides by Firebase ride ID to prevent duplicate key warnings
  // This handles the case where both tabs save the same ride to MockAPI
  const deduplicatedRides = useMemo(() => {
    const seen = new Set<string>();
    return rides.filter((ride) => {
      // MockAPI id is sequential (1,2,3) — use pickup+destination+requestedAt as unique fingerprint
      const fingerprint = `${ride.pickup}-${ride.destination}-${ride.requestedAt}`;
      if (seen.has(fingerprint)) return false;
      seen.add(fingerprint);
      return true;
    });
  }, [rides]);

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Ride History</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            All completed, cancelled, and rejected rides.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefetch}
          disabled={isLoading || isRefetching}
          className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-1.5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      ) : deduplicatedRides.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SummaryCards rides={deduplicatedRides} />

          <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">All Rides</CardTitle>
              <CardDescription className="text-zinc-400">
                {deduplicatedRides.length} ride{deduplicatedRides.length !== 1 ? "s" : ""} recorded
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {["#", "Route", "Status", "Driver", "Duration", "Time"].map((h) => (
                        <th
                          key={h}
                          className="py-3 px-4 text-left text-xs font-medium text-zinc-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deduplicatedRides.map((ride, index) => (
                      <RideRow
                        // Compound key: MockAPI id + index prevents collisions
                        key={`${ride.id}-${index}`}
                        ride={ride}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}