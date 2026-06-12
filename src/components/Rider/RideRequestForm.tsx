import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Navigation, Loader2 } from "lucide-react";
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

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const rideRequestSchema = z.object({
  pickup: z
    .string()
    .min(2, "Pickup location is required")
    .max(100, "Too long"),
  destination: z
    .string()
    .min(2, "Destination is required")
    .max(100, "Too long"),
});

type RideRequestFormValues = z.infer<typeof rideRequestSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface RideRequestFormProps {
  onSubmit: (data: RideRequestFormValues) => void | Promise<void>;
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
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function RideRequestForm({
  onSubmit,
  isLoading = false,
  disabled = false,
}: RideRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RideRequestFormValues>({
    resolver: zodResolver(rideRequestSchema),
    defaultValues: {
      pickup: "",
      destination: "",
    },
  });

  const handleFormSubmit = async (data: RideRequestFormValues) => {
    await onSubmit(data);
    reset();
  };

  const isDisabled = isLoading || disabled;

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Request a Ride
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Enter pickup and destination to find a driver.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* ── Route Indicator ── */}
          <div className="relative space-y-4">
            {/* Vertical connector line */}
            <div className="absolute left-4.25 top-9.5 h-[calc(100%-60px)] w-0.5 bg-linear-to-b from-amber-500 to-emerald-500 opacity-30" />

            {/* Pickup */}
            <FieldWrapper
              label="Pickup"
              error={errors.pickup?.message}
              icon={MapPin}
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
                <Input
                  type="text"
                  placeholder="e.g. Baneshwor, Kathmandu"
                  autoComplete="off"
                  disabled={isDisabled}
                  className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 disabled:opacity-50"
                  {...register("pickup")}
                />
              </div>
            </FieldWrapper>

            {/* Destination */}
            <FieldWrapper
              label="Destination"
              error={errors.destination?.message}
              icon={Navigation}
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
                <Input
                  type="text"
                  placeholder="e.g. Thamel, Kathmandu"
                  autoComplete="off"
                  disabled={isDisabled}
                  className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 disabled:opacity-50"
                  {...register("destination")}
                />
              </div>
            </FieldWrapper>
          </div>

          {/* ── Submit ── */}
          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold transition-colors disabled:opacity-60"
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