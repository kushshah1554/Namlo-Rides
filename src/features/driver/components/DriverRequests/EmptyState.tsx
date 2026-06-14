import { Navigation } from "lucide-react";

export default function EmptyState() {
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