export interface LocationOption {
  label: string;
  lat: number;
  lng: number;
}

export interface GeoapifyFeature {
  properties: {
    formatted: string;
    lat: number;
    lon: number;
  };
}