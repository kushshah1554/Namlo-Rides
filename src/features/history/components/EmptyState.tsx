import { Car } from "lucide-react";

export default function EmptyState() {
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