<script setup lang="ts">
const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
} = useDataTable({
  initOptions: ANALYSIS.options,
  initHeaders: HEADERS_ANALYSIS,
});
const route = useRoute();
const { data, status } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/analysis", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${route.params.id}`,
      sort: solrSort.value,
    },
  })),
});

const { exportData } = useExportSolr("/analysis", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: `locality_id:${route.params.id}`,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
  })),
});
</script>

<template>
  <DataTableAnalysis
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
