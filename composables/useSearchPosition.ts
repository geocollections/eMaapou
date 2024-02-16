export const _useSearchPosition = () => {
  const searchPosition = ref(-1);
  const fromSearch = computed(() => searchPosition.value > -1);

  return { searchPosition, fromSearch };
};

export const usePrevNext = async (
  path: string,
  {
    searchPosition,
    solrParams,
    count,
    mapper,
  }: {
    searchPosition: Ref<number>;
    solrParams: Ref<{ [K: string]: any }>;
    count: number;
    mapper: (doc: any) => {
      id: string;
      name: string | { et: string; en: string };
    };
  },
) => {
  const { data: idRes, refresh: refreshPrevNext } = await useSolrFetch<{
    response: { numFound: number; docs: any[] };
  }>(path, {
    query: computed(() => ({
      // fl: $getAPIFieldValues(HEADERS_LOCALITY),
      json: {
        limit: 3,
        offset: prevNextOffset(searchPosition.value, count),
        ...solrParams.value,
      },
    })),
    watch: false,
    immediate: false,
  });

  if (searchPosition.value > -1) {
    await refreshPrevNext();
  }

  const route = useRoute();

  const prevNext = computed(() => {
    if (!idRes.value) return { prev: null, next: null };
    const items = idRes.value?.response.docs.map(mapper) ?? [];
    const ids = items?.map((doc) => doc.id);
    const index = ids?.indexOf(route.params.id as string);
    if (index === -1) return { prev: null, next: null };
    const prevId = ids?.[index - 1];
    const nextId = ids?.[index + 1];
    return {
      prev: prevId ? items?.[index - 1] : null,
      next: nextId ? items?.[index + 1] : null,
    };
  });
  function prevNextOffset(position: number, count: number) {
    if (position === 0) return 0;
    if (position === count - 1) return position - 2;
    return position - 1;
  }
  return { prevNext };
};
