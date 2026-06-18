import { useState, useEffect, useRef } from "react";
import { getCurrentLocationOption } from "@/services/geoapify";
import { KATHMANDU_CENTER } from "../utils/riderMapUtils";
import type { LatLng } from "@/components/Map/RideMap";

interface UseRiderLocationReturn {
  riderLatLng: LatLng;
  isLocating: boolean;
}

export function useRiderLocation(): UseRiderLocationReturn {
  const [riderLatLng, setRiderLatLng] = useState<LatLng>(KATHMANDU_CENTER);
  const [isLocating, setIsLocating] = useState(true);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const detect = async () => {
      setIsLocating(true);

      try {
        const location = await getCurrentLocationOption();

        if (!cancelledRef.current && location) {
          setRiderLatLng([location.lat, location.lng]);
        }
      } catch {
        // Silent fail — keep KATHMANDU_CENTER as fallback
      } finally {
        if (!cancelledRef.current) {
          setIsLocating(false);
        }
      }
    };

    detect();

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  return { riderLatLng, isLocating };
}