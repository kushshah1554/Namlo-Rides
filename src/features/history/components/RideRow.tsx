import { MapPin, Navigation, Car, Clock } from "lucide-react";
import type { RideHistoryEntry } from "@/services/rideApi";
import StatusBadge from "./StatusBadge";
import { formatDuration, formatTime } from "../utils/formatters";

interface RideRowProps {
  ride: RideHistoryEntry;
  index: number;
}

export default function RideRow({ ride, index }: RideRowProps) {
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