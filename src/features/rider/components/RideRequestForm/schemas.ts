import { z } from "zod";

export const rideRequestSchema = z.object({
  pickup: z
    .string()
    .min(2, "Pickup location is required")
    .max(100, "Too long"),
  destination: z
    .string()
    .min(2, "Destination is required")
    .max(100, "Too long"),
});

export type RideRequestFormValues = z.infer<typeof rideRequestSchema>;