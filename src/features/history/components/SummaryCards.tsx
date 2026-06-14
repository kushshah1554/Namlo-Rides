import { useMemo } from "react";
import type { RideHistoryEntry } from "@/services/rideApi";

interface SummaryCardsProps {
  rides: RideHistoryEntry[];
}

const CARD_CONFIG = [
  { label: "Total Rides", key: "total", color: "text-white", border: "border-zinc-700" },
  { label: "Completed", key: "completed", color: "text-emerald-400", border: "border-emerald-500/20" },
  { label: "Cancelled", key: "cancelled", color: "text-red-400", border: "border-red-500/20" },
  { label: "Rejected", key: "rejected", color: "text-zinc-400", border: "border-zinc-700" },
] as const;

export default function SummaryCards({ rides }: SummaryCardsProps) {
  const stats = useMemo(
    () => ({
      total: rides.length,
      completed: rides.filter((r) => r.status === "completed").length,
      cancelled: rides.filter((r) => r.status === "cancelled").length,
      rejected: rides.filter((r) => r.status === "rejected").length,
    }),
    [rides]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border ${card.border} bg-zinc-900 px-4 py-3`}
        >
          <p className="text-xs text-zinc-500 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>
            {stats[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}