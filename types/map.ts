import type { Map } from "leaflet";

export interface MapMarker {
  text: string;
  longitude: number;
  latitude: number;
  routeName?: string;
  id?: number; // TODO: should rename to `routeId`
}

export interface MapState {
  map: Map | undefined;
  options: any;
  currentCenter: { lat: number; lng: number };
  mapClickResponse: any;
  [K: string]: any;
}
