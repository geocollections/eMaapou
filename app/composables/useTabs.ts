interface BaseTab {
  title: string;
  routeName: string;
  props: Record<string, any>;
}

export type StaticTab = BaseTab & {
  type: "static";
};
export type DynamicTab = BaseTab & {
  type: "dynamic";
  count: (ctx?: Record<string, any>) => Promise<number>;
};
type HydratedDynamicTab = BaseTab & {
  type: "dynamic";
  count: number;
};

export type Tab = StaticTab | DynamicTab;
export type HydratedTab = StaticTab | HydratedDynamicTab;

type HydratedTabs<T extends Record<string, Tab>> = { [K in keyof T]: T[K] extends StaticTab ? StaticTab : HydratedDynamicTab };

export function useTabs() {
  const getRouteBaseName = useRouteBaseName();
  const route = useRoute();

  async function hydrateTabs<
    T extends Record<string, Tab>,
    K extends keyof T,
  >(
    tabs: T,
    { props, ctx }: { props: Record<K, any>; ctx?: Record<string, any> },
  ) {
    const promises = Object.entries(tabs).map(async ([key, tab]) => {
      if (tab.type === "dynamic") {
        const count = await tab.count(ctx);
        return [
          key,
          {
            ...tab,
            count,
            // title: t(tab.title, { number: count }),
            props: props[key as K] ?? {},
          },
        ] as [string, HydratedDynamicTab];
      }
      return [
        key,
        {
          ...tab,
          // title: t(tab.title),
          props: props[key as K] ?? {},
        },
      ] as [string, StaticTab];
    });
    const hydratedTabs = await Promise.all(promises);

    return Object.fromEntries(hydratedTabs) as HydratedTabs<T>;
  }

  function filterHydratedTabs<
    T extends Record<K, HydratedTab>,
    K extends keyof T,
  >(tabs: T, order: K[]): HydratedTab[] {
    return order
      .map(key => tabs[key])
      .filter((tab) => {
        if (tab.type === "dynamic")
          return tab.count > 0;

        return true;
      });
  }

  function getCurrentTabRouteProps(tabs: HydratedTab[]) {
    const routeTab = tabs.find(
      tab => tab.routeName === getRouteBaseName(route),
    );

    if (routeTab === undefined)
      return {};
    return routeTab.props;
  }

  return {
    hydrateTabs,
    filterHydratedTabs,
    getCurrentTabRouteProps,
  };
}
