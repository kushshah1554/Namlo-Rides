import { Loader2, MapPin } from "lucide-react";
import type { LocationOption } from "@/services/geoapify";

interface AutocompleteDropdownProps {
  options: LocationOption[];
  isLoading: boolean;
  isOpen: boolean;
  onSelect: (option: LocationOption) => void;
  direction?: "up" | "down";
}

export default function AutocompleteDropdown({
  options,
  isLoading,
  isOpen,
  onSelect,
  direction = "down",
}: AutocompleteDropdownProps) {
  if (!isOpen) return null;

  const positionClass =
    direction === "up" ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <div
      className={`absolute left-0 right-0 ${positionClass} z-50 max-h-48 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl custom-scrollbar`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-3 text-xs text-zinc-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Searching…
        </div>
      ) : options.length === 0 ? (
        <div className="px-3 py-3 text-xs text-zinc-500">No results found</div>
      ) : (
        options.map((option, index) => (
          <button
            key={`${option.lat}-${option.lng}-${index}`}
            type="button"
            onClick={() => onSelect(option)}
            className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span className="line-clamp-2 text-xs">{option.label}</span>
          </button>
        ))
      )}
    </div>
  );
}