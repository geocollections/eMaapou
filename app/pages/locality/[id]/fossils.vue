<script setup lang="ts">
const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
  setStateFromQueryParams,
} = useDataTable({
  initOptions: FOSSILS.options,
  initHeaders: HEADERS_FOSSIL,
});
const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/taxon_search", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${route.params.id} AND rank:[14 TO 18]`,
      sort:
        solrSort.value ?? "fossil_group ASC,taxon ASC",
    },
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { exportData } = useExportSolr("/taxon_search", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: `locality_id:${route.params.id} AND rank:[14 TO 18]`,
    sort:
        solrSort.value ?? "fossil_group ASC,taxon ASC",
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
  })),
});
</script>

<template>
  <DataTableFossil
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="status === 'pending'"
    :export-func="exportData"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
