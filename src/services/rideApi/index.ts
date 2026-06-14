// Types
export type {
  RideHistoryEntry,
  SortField,
  SortOrder,
  TerminalStatus,
} from "./types";

export { TERMINAL_STATUSES } from "./types";

// Helpers
export { isTerminalStatus, handleResponse, sortRidesNewestFirst } from "./helpers";

// History service
export {
  saveRideToHistory,
  fetchRideHistory,
  fetchRideById,
  deleteRideFromHistory,
} from "./historyService";