import { LocateFixed, LocateOff, Loader2 } from "lucide-react";

type GpsStatus = "pending" | "granted" | "denied" | "unsupported";

interface GpsStatusBannerProps {
  status: GpsStatus;
}

const STATUS_CONFIG = {
  pending: {
    show: true,
    icon: Loader2,
    message: "Acquiring your location…",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-400",
    spin: true,
  },
  granted: {
    show: false,
    icon: LocateFixed,
    message: "",
    className: "",
    spin: false,
  },
  denied: {
    show: true,
    icon: LocateOff,
    message:
      "Location access denied. Using approximate position. Enable GPS in browser settings.",
    className: "border-red-800 bg-red-950/80 text-red-300",
    spin: false,
  },
  unsupported: {
    show: true,
    icon: LocateOff,
    message: "Geolocation is not supported by your browser.",
    className: "border-red-800 bg-red-950/80 text-red-300",
    spin: false,
  },
} as const;

export default function GpsStatusBanner({ status }: GpsStatusBannerProps) {
  const config = STATUS_CONFIG[status];

  if (!config.show) return null;

  const Icon = config.icon;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
      <div
        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${config.className}`}
      >
        <Icon
          className={`h-4 w-4 shrink-0 ${config.spin ? "animate-spin" : ""}`}
        />
        <span>{config.message}</span>
      </div>
    </div>
  );
}