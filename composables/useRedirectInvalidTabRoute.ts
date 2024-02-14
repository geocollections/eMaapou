import isEqual from "lodash/isEqual";
import type { RouteLocationRaw } from "vue-router";
import type { RouteLocationNamedRaw } from "vue-router";
import type { Tab } from "~/constants";

export function useRedirectInvalidTabRoute({
  tabs,
  watchableObject,
  pending,
  validRoute,
}: {
  tabs: Tab[];
  watchableObject: any;
  pending: Ref<any>;
  validRoute: Ref<any>;
}) {
  const route = useRoute();
  const router = useRouter();
  const getRouteBaseName = useRouteBaseName();
  const localeRoute = useLocaleRoute();

  watch([() => watchableObject, pending], ([_object, pending]) => {
    if (pending) return;
    validRoute.value = redirectToValidRoute({
      tabs: tabs,
    });
  });

  const redirectToValidRoute = ({ tabs }: { tabs: Tab[] }) => {
    const location = {
      name: getRouteBaseName(route),
      params: route.params,
    };
    const validRoute = localeRoute(getValidTabRoute(location, tabs));

    if (validRoute === undefined) return validRoute;
    if (router.resolve(validRoute).href !== route.path)
      router.replace(validRoute);

    return validRoute;
  };

  const getValidTabRoute = (
    currentRoute: RouteLocationNamedRaw,
    tabs: Tab[],
  ): RouteLocationNamedRaw => {
    if (tabs.length < 1) return currentRoute;
    const currentTab = tabs.find((tab) =>
      isEqual(
        {
          name: currentRoute.name,
          params: currentRoute.params,
        },
        {
          name: tab.routeName,
          params: currentRoute.params,
        },
      ),
    );
    // If current tab is valid and contains items return the current route
    if (currentTab !== undefined && currentTab.count > 0) return currentRoute;
    // Find tab that has items
    const tabWithItems = tabs.find((tab) => tab.count > 0);

    // If there is another tab with items return that
    if (tabWithItems !== undefined)
      return { name: tabWithItems.routeName, params: currentRoute.params };

    // If there is no tab with items return base route
    // HACK: Right now we assume that tabs[0] return the base route, but this might not be the case always.
    return {
      name: tabs[0].routeName,
      params: currentRoute.params,
    };
  };
}

export function redirectInvalidTab({
  redirectRoute,
  tabs,
}: {
  redirectRoute: RouteLocationRaw;
  tabs: Tab[];
}) {
  const route = useRoute();
  const router = useRouter();
  const getRouteBaseName = useRouteBaseName();

  const isCurrentRouteValid = computed(() => {
    return tabs.some((tab) => {
      return tab.routeName === getRouteBaseName(route);
    });
  });

  if (!isCurrentRouteValid.value) {
    router.replace(redirectRoute);
  }
}
