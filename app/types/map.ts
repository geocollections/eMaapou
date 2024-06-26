import type { RouteLocationRaw } from "vue-router";

export interface MapMarker {
  text: string;
  longitude: number;
  latitude: number;
  route?: RouteLocationRaw;
}
