import type { FetchOptions } from "ofetch";

export default defineNuxtPlugin(() => {
  const defaults: FetchOptions = {
    baseURL: "https://rwapi.geoloogia.info/api/v1/public",
  };
  const apiFetch = $fetch.create(defaults);

  const solrDefaults: FetchOptions = {
    baseURL: "https://api.geoloogia.info/solr",
  };
  const solrFetch = $fetch.create(solrDefaults);

  const geoloogiaDefaults: FetchOptions = {
    baseURL: "https://api.geoloogia.info",
  };
  const geoloogiaFetch = $fetch.create(geoloogiaDefaults);

  return {
    provide: {
      apiFetch,
      solrFetch,
      geoloogiaFetch,
    },
  };
});
