<script setup lang="ts">
const {
  options,
  handleUpdate,
  solrQuery,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
  setStateFromQueryParams,
} = useDataTable({
  initOptions: ANALYSIS.options,
  initHeaders: HEADERS_ANALYSIS,
});

const filteredHeaders = computed(() =>
  headers.value.filter((header) => {
    if (header.value === "sample_number")
      return false;

    if (typeof header.value === "string" && header.value.includes("depth"))
      return false;

    return true;
  }),
);

const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useSolrFetch("/analysis", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `sample_id:${route.params.id}`,
      sort: solrSort.value,
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

const { exportData } = useExportSolr("/analysis", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: `sample_id:${route.params.id}`,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_ANALYSIS,
  })),
});
</script>

<template>
  <DataTableAnalysis
    class="border-b"
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="filteredHeaders"
    :is-loading="status === 'pending'"
    :export-func="exportData"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
