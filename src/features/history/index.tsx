import { useMemo, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRideHistory } from "./hooks/useRideHistory";
import { deduplicateRides } from "./utils/deduplicateRides";
import SummaryCards from "./components/SummaryCards";
import RideTable from "./components/RideTable";
import EmptyState from "./components/EmptyState";

export default function HistoryPage() {
  const { rides, isLoading, error, refetch } = useRideHistory();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetch = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  const deduplicatedRides = useMemo(
    () => deduplicateRides(rides),
    [rides]
  );

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
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

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      ) : deduplicatedRides.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SummaryCards rides={deduplicatedRides} />
          <RideTable rides={deduplicatedRides} />
        </>
      )}
    </div>
  );
}