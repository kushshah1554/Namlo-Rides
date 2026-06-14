import L from "leaflet";

function createCustomIcon(color: string, iconPath: string) {
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #18181b;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#18181b">
          ${iconPath}
        </svg>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -44],
  });
}

// Standing person — Rider
export const riderIcon = createCustomIcon(
  "#f59e0b",
  "M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm2 7h-4a2 2 0 0 0-2 2v5h2v6h4v-6h2v-5a2 2 0 0 0-2-2z"
);

// Motorcycle — Driver
export const driverIcon = createCustomIcon(
  "#ffffff",
  "M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H5v2h2.82zM19 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
);

// Flag — Dropoff
export const dropoffIcon = createCustomIcon(
  "#10b981",
  "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"
);