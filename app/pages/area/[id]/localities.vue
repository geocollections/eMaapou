<script setup lang="ts">
const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
  solrQuery,
  setStateFromQueryParams,
} = useDataTable({
  initOptions: LOCALITY.options,
  initHeaders: HEADERS_AREA_LOCALITY,
});

const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useSolrFetch<SolrResponse>("/locality", {
  query: computed(() => ({
    q: solrQuery.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fq: `area_id:${route.params.id}`,
    sort: solrSort.value,
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { exportData } = useExportSolr("/locality", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_LOCALITY,
  })),
});
</script>

<template>
  <DataTableLocality
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
