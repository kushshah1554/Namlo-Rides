import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import type { RideRequestFormValues } from "./schemas";
import FieldWrapper from "./FieldWrapper";
import AutocompleteInput from "./AutocompleteInput";
import type { usePlaceAutocomplete } from "@/features/rider/hooks/usePlaceAutocomplete";

interface RideFormBodyProps {
  form: UseFormReturn<RideRequestFormValues>;
  pickupAutocomplete: ReturnType<typeof usePlaceAutocomplete>;
  destinationAutocomplete: ReturnType<typeof usePlaceAutocomplete>;
  isLoading: boolean;
  isDisabled: boolean;
  isDetectingLocation: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RideFormBody({
  form,
  pickupAutocomplete,
  destinationAutocomplete,
  isLoading,
  isDisabled,
  isDetectingLocation,
  onSubmit,
}: RideFormBodyProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="relative space-y-5">
        {/* Vertical connector line */}
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
            isDetecting={isDetectingLocation}
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
        disabled={isDisabled || isDetectingLocation}
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
  );
}