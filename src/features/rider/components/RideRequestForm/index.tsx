import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MinimizeButton from "@/components/shared/MinimizeButton";
import { usePlaceAutocomplete } from "../../hooks/usePlaceAutocomplete";
import { getCurrentLocationOption } from "@/services/geoapify";
import { rideRequestSchema, type RideRequestFormValues } from "./schemas";
import { type RideRequestData, type RideRequestFormProps } from "./types";
import RideFormBody from "./RideFormBody";

export type { RideRequestData } from "./types";

export default function RideRequestForm({
  onSubmit,
  isLoading = false,
  disabled = false,
}: RideRequestFormProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const pickupAutocomplete = usePlaceAutocomplete();
  const destinationAutocomplete = usePlaceAutocomplete();

  const form = useForm<RideRequestFormValues>({
    resolver: zodResolver(rideRequestSchema),
    defaultValues: { pickup: "", destination: "" },
  });

  const { setValue, setError, reset, handleSubmit } = form;

  // Auto-detect current location on mount
  useEffect(() => {
    let cancelled = false;

    const detectLocation = async () => {
      setIsDetectingLocation(true);
      try {
        const location = await getCurrentLocationOption();
        if (!cancelled && location) {
          pickupAutocomplete.setInitialOption(location);
          setValue("pickup", location.label);
        }
      } catch {
        // Silent fail — user can type manually
      } finally {
        if (!cancelled) setIsDetectingLocation(false);
      }
    };

    detectLocation();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = async (data: RideRequestFormValues) => {
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

    reset();
    pickupAutocomplete.clearSelection();
    destinationAutocomplete.clearSelection();
  };

  const isDisabled = isLoading || disabled;

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl p-2 transition-all duration-300">
      <CardHeader className="pb-4 pt-5 px-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Request a Ride
            </CardTitle>
            {!isMinimized && (
              <CardDescription className="text-zinc-400 mt-1">
                Enter pickup and destination to find a driver.
              </CardDescription>
            )}
          </div>

          <MinimizeButton
            isMinimized={isMinimized}
            onToggle={() => setIsMinimized((prev) => !prev)}
            style={"absolute right-2 top-3 -translate-y-1/2"}
          />
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="px-6 pb-6">
          <RideFormBody
            form={form}
            pickupAutocomplete={pickupAutocomplete}
            destinationAutocomplete={destinationAutocomplete}
            isLoading={isLoading}
            isDisabled={isDisabled}
            isDetectingLocation={isDetectingLocation}
            onSubmit={handleSubmit(handleFormSubmit)}
          />
        </CardContent>
      )}
    </Card>
  );
}