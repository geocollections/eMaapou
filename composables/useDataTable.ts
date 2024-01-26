export function useDataTableDetail({ initOptions, initHeaders }) {
  const options = ref(initOptions);

  const { headers, handleHeadersReset, handleHeadersChange } =
    useHeaders(initHeaders);
  const search = ref("");

  const solrQuery = computed(() => {
    return search.value.length > 0 ? search.value : "*";
  });

  function handleUpdate(tableState) {
    options.value = tableState.options;
    search.value = tableState.search;
  }
  return {
    options,
    headers,
    search,
    solrQuery,
    handleUpdate,
    handleHeadersReset,
    handleHeadersChange,
  };
}
