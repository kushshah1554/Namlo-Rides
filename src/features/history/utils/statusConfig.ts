import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export const STATUS_CONFIG = {
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

export const FALLBACK_CONFIG = {
  label: "Unknown",
  color: "text-zinc-500 bg-zinc-800 border-zinc-700",
  icon: HelpCircle,
};

export function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? FALLBACK_CONFIG
  );
}