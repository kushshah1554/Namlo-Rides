// src/components/Rider/RideRequestForm.tsx

import { useRef, useEffect } from "react";
import { useForm ,type UseFormRegisterReturn} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Navigation, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlaceAutocomplete } from "@/hooks/usePlaceAutocomplete";
import type { LocationOption } from "@/services/geoapify";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const rideRequestSchema = z.object({
  pickup: z.string().min(2, "Pickup location is required").max(100, "Too long"),
  destination: z
    .string()
    .min(2, "Destination is required")
    .max(100, "Too long"),
});

type RideRequestFormValues = z.infer<typeof rideRequestSchema>;

// ---------------------------------------------------------------------------
// Submitted data includes coordinates
// ---------------------------------------------------------------------------
export interface RideRequestData {
  pickup: string;
  pickupLat: number;
  pickupLng: number;
  destination: string;
  destinationLat: number;
  destinationLng: number;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface RideRequestFormProps {
  onSubmit: (data: RideRequestData) => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Field Wrapper
// ---------------------------------------------------------------------------
function FieldWrapper({
  label,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  error?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-amber-400" />
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Autocomplete Dropdown
// ---------------------------------------------------------------------------
function AutocompleteDropdown({
  options,
  isLoading,
  isOpen,
  onSelect,
  direction = "down",
}: {
  options: LocationOption[];
  isLoading: boolean;
  isOpen: boolean;
  onSelect: (option: LocationOption) => void;
  direction?: "up" | "down";
}) {
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

// ---------------------------------------------------------------------------
// Autocomplete Input
// ---------------------------------------------------------------------------
function AutocompleteInput({
  placeholder,
  dotColor,
  disabled,
  autocomplete,
  onValueChange,
  registerProps,
  dropdownDirection = "down",
}: {
  placeholder: string;
  dotColor: string;
  disabled: boolean;
  autocomplete: ReturnType<typeof usePlaceAutocomplete>;
  onValueChange: (value: string) => void;
  dropdownDirection?: "up" | "down";
  registerProps: UseFormRegisterReturn;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full ${dotColor}`}
      />

      <Input
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
        value={autocomplete.query}
        className="pl-9 pr-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 disabled:opacity-50"
        {...registerProps}
        onChange={(e) => {
          registerProps.onChange(e);
          autocomplete.setQuery(e.target.value);
          onValueChange(e.target.value);

          if (autocomplete.selectedOption) {
            autocomplete.clearSelection();
            autocomplete.setQuery(e.target.value);
          }
        }}
        onFocus={() => {
          if (autocomplete.options.length > 0) {
            autocomplete.setIsOpen(true);
          }
        }}
      />

      {autocomplete.query && (
        <button
          type="button"
          onClick={() => {
            autocomplete.clearSelection();
            onValueChange("");
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      <AutocompleteDropdown
        options={autocomplete.options}
        isLoading={autocomplete.isLoading}
        isOpen={autocomplete.isOpen}
        onSelect={(option) => {
          autocomplete.selectOption(option);
          onValueChange(option.label);
        }}
        direction={dropdownDirection}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Form Component
// ---------------------------------------------------------------------------
export default function RideRequestForm({
  onSubmit,
  isLoading = false,
  disabled = false,
}: RideRequestFormProps) {
  const pickupAutocomplete = usePlaceAutocomplete();
  const destinationAutocomplete = usePlaceAutocomplete();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<RideRequestFormValues>({
    resolver: zodResolver(rideRequestSchema),
    defaultValues: {
      pickup: "",
      destination: "",
    },
  });

  const handleFormSubmit = async (data: RideRequestFormValues) => {
    // Validate that user selected from autocomplete
    if (!pickupAutocomplete.selectedOption) {
      setError("pickup", {
        message: "Please select a pickup location from suggestions",
      });
      return;
    }

    if (!destinationAutocomplete.selectedOption) {
      setError("destination", {
        message: "Please select a destination from suggestions",
      });
      return;
    }

    const rideData: RideRequestData = {
      pickup: data.pickup,
      pickupLat: pickupAutocomplete.selectedOption.lat,
      pickupLng: pickupAutocomplete.selectedOption.lng,
      destination: data.destination,
      destinationLat: destinationAutocomplete.selectedOption.lat,
      destinationLng: destinationAutocomplete.selectedOption.lng,
    };

    await onSubmit(rideData);

    // Reset everything
    reset();
    pickupAutocomplete.clearSelection();
    destinationAutocomplete.clearSelection();
  };

  const isDisabled = isLoading || disabled;

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl p-2">
  <CardHeader className="pb-4 pt-5 px-6">
    <CardTitle className="text-white text-lg flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      Request a Ride
    </CardTitle>
    <CardDescription className="text-zinc-400">
      Enter pickup and destination to find a driver.
    </CardDescription>
  </CardHeader>

  <CardContent className="px-6 pb-6">
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-5"
    >
      <div className="relative space-y-5">
        <div className="absolute left-4.25 top-9.5 h-[calc(100%-60px)] w-0.5 bg-linear-to-b from-amber-500 to-emerald-500 opacity-30" />

        {/* Pickup */}
        <FieldWrapper
          label="Pickup"
          error={errors.pickup?.message}
          icon={MapPin}
        >
          <AutocompleteInput
            placeholder="e.g. Baneshwor, Kathmandu"
            dotColor="bg-amber-400 ring-2 ring-amber-400/20"
            disabled={isDisabled}
            autocomplete={pickupAutocomplete}
            onValueChange={(val) => setValue("pickup", val)}
            registerProps={register("pickup")}
            dropdownDirection="down"
          />
        </FieldWrapper>

        {/* Destination */}
        <FieldWrapper
          label="Destination"
          error={errors.destination?.message}
          icon={Navigation}
        >
          <AutocompleteInput
            placeholder="e.g. Thamel, Kathmandu"
            dotColor="bg-emerald-400 ring-2 ring-emerald-400/20"
            disabled={isDisabled}
            autocomplete={destinationAutocomplete}
            onValueChange={(val) => setValue("destination", val)}
            registerProps={register("destination")}
            dropdownDirection="up"
          />
        </FieldWrapper>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isDisabled}
        className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold transition-colors disabled:opacity-60"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Requesting…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Request Ride
          </span>
        )}
      </Button>
    </form>
  </CardContent>
</Card>
  );
}
