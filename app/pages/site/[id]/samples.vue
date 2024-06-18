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
  initOptions: SAMPLE.options,
  initHeaders: HEADERS_SAMPLE,
});
const route = useRoute();

const { data, status } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/sample", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `site_id:${route.params.id}`,
      sort: solrSort.value,
    },
  })),
});
const { exportData } = useExportSolr("/sample", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: `site_id:${route.params.id}`,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
  })),
});
</script>

<template>
  <DataTableSample
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
