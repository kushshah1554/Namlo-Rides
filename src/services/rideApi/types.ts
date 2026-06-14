export interface RideHistoryEntry {
  id: string;
  pickup: string;
  destination: string;
  status: "completed" | "cancelled" | "rejected";
  riderId: string;
  driverId?: string | null;
  requestedAt: number;
  acceptedAt?: number | null;
  completedAt?: number | null;
}

export type SortField = "completedAt" | "requestedAt" | "status";
export type SortOrder = "asc" | "desc";

export const TERMINAL_STATUSES = [
  "completed",
  "cancelled",
  "rejected",
] as const;

export type TerminalStatus = (typeof TERMINAL_STATUSES)[number];