import type { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";

type Request = Parameters<typeof useFetch>[0];

export function useNewApiFetch<T>(
  request: Request,
  options: UseFetchOptions<T> = {},
) {
  const { $apiFetch } = useNuxtApp();

  const defaults: UseFetchOptions<T> = {
    $fetch: $apiFetch,
  };
  const params = defu(options, defaults);

  return useFetch(request, params);
}

export function useSolrFetch<T = SolrResponse>(request: Request, options: UseFetchOptions<T> = {}) {
  const { $solrFetch } = useNuxtApp();

  const defaults: UseFetchOptions<T> = {
    $fetch: $solrFetch,
  };
  const params = defu(options, defaults);

  return useFetch(request, params);
}
