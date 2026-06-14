export function formatDuration(
  startMs?: number | null,
  endMs?: number | null
): string {
  if (!startMs || !endMs) return "—";
  const diffMs = endMs - startMs;
  const mins = Math.floor(diffMs / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function formatTime(ms?: number | null): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}