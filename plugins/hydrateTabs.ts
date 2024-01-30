import type { RouteLocationNamedRaw, RouteLocationPathRaw } from "vue-router";
import type { Tab } from "~/constants";
export default defineNuxtPlugin((_nuxtApp) => {
  const { $solrFetch, $geoloogiaFetch } = useNuxtApp();
  const hydrateCount = async (
    tab: Tab,
    options: { solr?: any; api?: any; fields?: any } = {},
  ) => {
    if (!tab.id) return tab;
    if (tab.count > 0) return tab;
    if (tab.isSolr) {
      const res = await $solrFetch(`/${tab.table ?? tab.id}`, {
        query: {
          q: "*",
          rows: 0,
          ...(options.solr?.[tab.id] ?? options.solr?.default ?? {}),
        },
      });
      return { ...tab, count: res?.response?.numFound ?? 0 };
    } else {
      const res = await $geoloogiaFetch(`/${tab.table ?? tab.id}/`, {
        query: {
          ...(options.api?.[tab.id] ?? options.api?.default ?? {}),
          fields: options.fields ?? null,
        },
      });
      return { ...tab, count: res.count ?? 0 };
    }
  };

  const hydrateProps = (tab: Tab, props: any) => {
    return {
      ...tab,
      props: { ...tab.props, ...props },
    };
  };

  const hydrateTab = async (
    tab: Tab,
    options: { props?: any; countParams?: any } = {
      props: {},
      countParams: {},
    },
  ): Promise<Tab> => {
    tab = hydrateProps(tab, options.props);

    return await hydrateCount(tab, options.countParams);
  };

  const getMaxTab = (
    route: RouteLocationPathRaw | RouteLocationNamedRaw,
    tabs: any[],
  ): RouteLocationNamedRaw | RouteLocationPathRaw => {
    if (!(tabs.length > 0)) return route;
    const initTab = tabs.reduce((max, tab) =>
      max.count > tab.count ? max : tab,
    );

    // Constuct route
    // HACK: Right now we assume that tabs[0] return the base route, but this might not be the case always.
    const path = {
      name: initTab?.routeName ?? tabs[0].routeName,
      query: route.query,
    };
    return path;
  };
  return {
    provide: {
      hydrateTab,
      getMaxTab,
    },
  };
});
