import type { RideStatus } from "@/services/firebase";
import StatusBadge from "./StatusBadge";

export default function TerminalPanel({ status }: { status: RideStatus }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4">
      <StatusBadge status={status} />
      <p className="text-xs text-zinc-500 mt-3">Clearing in a moment…</p>
    </div>
  );
}