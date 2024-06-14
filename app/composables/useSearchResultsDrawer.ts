export async function useSearchResultsDrawer<T = any>(url: string, {
  routeName,
  perPage = 10,
  solrParams,
}: {
  routeName: string;
  perPage?: number;
  solrParams: {
    query: Ref<string>;
    filter: Ref<(string | { [K: string]: string })[]>;
    sort: Ref<string | undefined>;
  };
}) {
  const route = useRoute();
  const getRouteBaseName = useRouteBaseName();
  const searchPositionStore = useSearchPosition();
  const { setSearchPosition } = searchPositionStore;
  const {
    searchPosition,
    fromSearch,
    page: rootDetailRoute,
  } = storeToRefs(searchPositionStore);

  const page = ref(
    !fromSearch ? 1 : Math.floor(searchPosition.value / perPage) + 1,
  );

  const showDrawer = computed(() => {
    if (!rootDetailRoute.value)
      return false;
    if (!rootDetailRoute.value.name)
      return false;
    if (searchPosition.value < 0)
      return false;
    if (
      !getRouteBaseName(route)?.startsWith(
        rootDetailRoute.value.name.toString(),
      )
    )
      return false;
    return true;
  });

  const { data } = await useSolrFetch<SolrResponse<T>>(url, {
    query: computed(() => ({
      q: solrParams.query.value,
      rows: perPage,
      start: (page.value - 1) * perPage,
      sort: solrParams.sort.value,
      json: {
        filter: solrParams.filter.value,
      },
    })),
    immediate: showDrawer.value,
  });

  function handleSelect({ index, id }: { index: number; id: number }) {
    if (searchPosition.value < 0)
      return;
    setSearchPosition(
      { name: routeName, params: { id } },
      index + (page.value - 1) * perPage,
    );
  }
  return { data, page, handleSelect, showDrawer };
}
