import { TERMINAL_STATUSES, type TerminalStatus } from "./types";

/**
 * Type guard — checks if a status is a terminal ride status.
 */
export function isTerminalStatus(status: string): status is TerminalStatus {
  return TERMINAL_STATUSES.includes(status as TerminalStatus);
}

/**
 * Handles fetch response — throws on non-ok status.
 */
export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `MockAPI error ${res.status}: ${text || res.statusText}`
    );
  }
  return res.json() as Promise<T>;
}

/**
 * Sorts rides newest first by completedAt or requestedAt.
 */
export function sortRidesNewestFirst<
  T extends { completedAt?: number | null; requestedAt: number }
>(rides: T[]): T[] {
  return rides.sort(
    (a, b) =>
      (b.completedAt ?? b.requestedAt) - (a.completedAt ?? a.requestedAt)
  );
}