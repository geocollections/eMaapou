import type { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";

type Request = Parameters<typeof useFetch>[0];

export function useApiFetch<T>(request: Request, options: UseFetchOptions<T> = {}) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://rwapi.geoloogia.info/api/v0/public",
  };
  const params = defu(options, defaults);

  return useFetch(request, params);
}

export function useGeoloogiaApiFetch<T>(
  request: Request,
  options: UseFetchOptions<T> = {},
) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://rwapi.geoloogia.info/api/v0.5/public",
  };
  const params = defu(options, defaults);

  return useFetch(request, params);
}

export function useGeoserverFetch<T>(
  request: Request,
  options: UseFetchOptions<T> = {},
) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://gis.geocollections.info/geoserver/sarv",
    query: {
      SERVICE: "WMS",
      VERSION: "1.1.1",
      REQUEST: "GetFeatureInfo",
      FEATURE_COUNT: 25,
      X: 50,
      Y: 50,
      SRS: "EPSG:4326",
      STYLES: "",
      WIDTH: 101,
      HEIGHT: 101,
      exceptions: "text/javascript",
      INFO_FORMAT: "application/json",
    },
  };
  const params = defu(options, defaults);

  return useFetch(request, params);
}

export function useNewApiFetch<T>(
  request: Request,
  options: UseFetchOptions<T> = {},
) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://rwapi.geoloogia.info/api/v1/public",
  };
  const params = defu(options, defaults);

  return useFetch(request, params);
}

export function useSolrFetch<T = SolrResponse>(request: Request, options: UseFetchOptions<T> = {}) {
  const defaults: UseFetchOptions<T> = {
    baseURL: "https://api.geoloogia.info/solr",
  };
  const params = defu(options, defaults);

  return useFetch(request, params);
}
