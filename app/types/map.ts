import type { RouteLocationRaw } from "vue-router";

export interface MapMarker {
  text: string;
  longitude: number;
  latitude: number;
  radius?: number;
  route?: RouteLocationRaw;
}

export interface MapLocation {
  localityId?: string;
  name?: string;
  nameEn?: string;
  latitude: number;
  longitude: number;
  count: number;
}
