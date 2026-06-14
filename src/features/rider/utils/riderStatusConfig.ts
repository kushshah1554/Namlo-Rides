import { Car, MapPin, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { RideStatus } from "@/services/firebase";

export const RIDER_STATUS_CONFIG: Record<
  RideStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  idle: {
    label: "Idle",
    color: "text-zinc-400 border-zinc-700 bg-zinc-800",
    icon: MapPin,
  },
  requested: {
    label: "Finding a driver…",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Loader2,
  },
  accepted: {
    label: "Driver accepted",
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
    label: "Ride cancelled",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    icon: XCircle,
  },
  rejected: {
    label: "Ride rejected by driver",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    icon: XCircle,
  },
};