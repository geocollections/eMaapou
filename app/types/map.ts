import type { RouteLocationRaw } from "vue-router";

export interface MapMarker {
  text: string;
  longitude: number;
  latitude: number;
  route?: RouteLocationRaw;
}

export interface MapLocation {
  name?: string;
  nameEn?: string;
  latitude: number;
  longitude: number;
  count: number;
}
