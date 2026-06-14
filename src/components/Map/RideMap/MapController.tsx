import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { LatLng } from "./types";

interface MapControllerProps {
  center?: LatLng;
}

export default function MapController({ center }: MapControllerProps) {
  const map = useMap();
  const prevKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!center) return;

    const key = `${center[0].toFixed(4)},${center[1].toFixed(4)}`;
    if (prevKeyRef.current === key) return;

    prevKeyRef.current = key;
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);

  return null;
}