import type { RideStatus } from "@/services/firebase";
import { RIDER_STATUS_CONFIG } from "../utils/riderStatusConfig";

interface StatusBadgeProps {
  status: RideStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = RIDER_STATUS_CONFIG[status];
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