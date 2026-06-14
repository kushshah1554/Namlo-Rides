import { useEffect, useMemo, useState } from "react";
import { Polyline } from "react-leaflet";
import type { LatLng } from "./types";
import { fetchOsrmRoute } from "./osrm";

interface RoadRouteProps {
  from: LatLng;
  to: LatLng;
  color?: string;
}

export default function RoadRoute({
  from,
  to,
  color = "#f59e0b",
}: RoadRouteProps) {
  const [routeCoords, setRouteCoords] = useState<LatLng[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const routeKey = useMemo(
    () =>
      `${from[0].toFixed(4)},${from[1].toFixed(4)}-${to[0].toFixed(4)},${to[1].toFixed(4)}`,
    [from, to]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchOsrmRoute(from, to).then((coords) => {
      if (!cancelled) {
        setRouteCoords(coords);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [routeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fallback dashed line while loading
  if (isLoading || !routeCoords) {
    return (
      <Polyline
        pathOptions={{ color, weight: 3, opacity: 0.4, dashArray: "8, 8" }}
        positions={[from, to]}
      />
    );
  }

  return (
    <>
      {/* Shadow */}
      <Polyline
        pathOptions={{ color: "#000000", weight: 7, opacity: 0.2 }}
        positions={routeCoords}
      />
      {/* Main route */}
      <Polyline
        pathOptions={{ color, weight: 4, opacity: 0.9 }}
        positions={routeCoords}
      />
    </>
  );
}