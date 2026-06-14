import { useRef, useEffect } from "react";
import { X, LocateFixed } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { usePlaceAutocomplete } from "@/features/rider/hooks/usePlaceAutocomplete";
import type { LocationOption } from "@/services/geoapify";
import AutocompleteDropdown from "./AutocompleteDropdown";

interface AutocompleteInputProps {
  placeholder: string;
  dotColor: string;
  disabled: boolean;
  autocomplete: ReturnType<typeof usePlaceAutocomplete>;
  onValueChange: (value: string) => void;
  dropdownDirection?: "up" | "down";
  registerProps: UseFormRegisterReturn;
  isDetecting?: boolean;
}

export default function AutocompleteInput({
  placeholder,
  dotColor,
  disabled,
  autocomplete,
  onValueChange,
  registerProps,
  dropdownDirection = "down",
  isDetecting = false,
}: AutocompleteInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        autocomplete.setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [autocomplete]);

  const handleSelect = (option: LocationOption) => {
    autocomplete.selectOption(option);
    onValueChange(option.label);
  };

  const handleClear = () => {
    autocomplete.clearSelection();
    onValueChange("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    registerProps.onChange(e);
    autocomplete.setQuery(e.target.value);
    onValueChange(e.target.value);

    if (autocomplete.selectedOption) {
      autocomplete.clearSelection();
      autocomplete.setQuery(e.target.value);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Dot indicator */}
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full ${dotColor}`}
      />

      {/* Detecting state */}
      {isDetecting ? (
        <div className="flex items-center gap-2 pl-9 pr-3 h-9 bg-zinc-800 border border-zinc-700 rounded-md">
          <LocateFixed className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span className="text-xs text-zinc-400">
            Detecting current location…
          </span>
        </div>
      ) : (
        <>
          <Input
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            disabled={disabled}
            value={autocomplete.query}
            className="pl-9 pr-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 disabled:opacity-50"
            {...registerProps}
            onChange={handleChange}
            onFocus={() => {
              if (autocomplete.options.length > 0) {
                autocomplete.setIsOpen(true);
              }
            }}
          />

          {/* Clear button */}
          {autocomplete.query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <AutocompleteDropdown
            options={autocomplete.options}
            isLoading={autocomplete.isLoading}
            isOpen={autocomplete.isOpen}
            onSelect={handleSelect}
            direction={dropdownDirection}
          />
        </>
      )}
    </div>
  );
}