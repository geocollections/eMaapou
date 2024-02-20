type BaseTab = {
  title: string;
  routeName: string;
  props: any;
};

type StaticTab = BaseTab & {
  type: "static";
};
type DynamicTab = BaseTab & {
  type: "dynamic";
  count: (ctx?: Record<string, any>) => Promise<number>;
};
type HydratedDynamicTab = BaseTab & {
  type: "dynamic";
  count: number;
};

export type Tab = StaticTab | DynamicTab;
export type HydratedTab = StaticTab | HydratedDynamicTab;

export const useTabs = () => {
  const { t } = useI18n({ useScope: "global" });
  const getRouteBaseName = useRouteBaseName();
  const route = useRoute();
  // const tabs = ref(await hydrateTabs(initTabs));

  async function hydrateTabs<
    T extends Record<string | number | symbol, Tab>,
    K extends keyof T,
    PK extends keyof T,
  >(
    tabs: T,
    { props, ctx }: { props: Record<PK, any>; ctx?: Record<string, any> },
  ): Promise<Record<K, HydratedTab>> {
    const promises = Object.entries(tabs).map(async ([key, tab]) => {
      if (tab.type === "dynamic") {
        const count = await tab.count(ctx);

        return [
          key,
          {
            ...tab,
            count,
            // title: t(tab.title, { number: count }),
            props: props[key as PK] ?? {},
          },
        ] as [string, HydratedDynamicTab];
      }
      return [
        key,
        {
          ...tab,
          // title: t(tab.title),
          props: props[key as PK] ?? {},
        },
      ] as [string, StaticTab];
    });
    const hydratedTabs = await Promise.all(promises);

    return Object.fromEntries(hydratedTabs);
  }

  function filterHydratedTabs<
    T extends Record<string | number | symbol, HydratedTab>,
    K extends keyof T,
  >(tabs: T, order: K[]): HydratedTab[] {
    return order
      .map((key) => tabs[key])
      .filter((tab) => {
        if (tab.type === "dynamic") {
          return tab.count > 0;
        }
        return true;
      });
  }

  function getCurrentTabRouteProps(tabs: HydratedTab[]) {
    const routeTab = tabs.find(
      (tab) => tab.routeName === getRouteBaseName(route),
    );

    if (routeTab === undefined) return {};
    return routeTab.props;
  }

  return {
    hydrateTabs,
    filterHydratedTabs,
    getCurrentTabRouteProps,
  };
};
