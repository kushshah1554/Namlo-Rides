import { Car, CheckCircle2, XCircle, Navigation } from "lucide-react";
import type { RideStatus } from "@/services/firebase";

export const DRIVER_STATUS_CONFIG: Record<
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