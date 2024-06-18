<script setup lang="ts">
const {
  options,
  handleUpdate,
  solrQuery,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
} = useDataTable({
  initOptions: PREPARATION.options,
  initHeaders: HEADERS_PREPARATION,
});

const route = useRoute();

const { data, status } = await useSolrFetch("/preparation", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `sample_id:${route.params.id}`,
      sort: solrSort.value,
    },
  })),
});

const { exportData } = useExportSolr("/preparation", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: `sample_id:${route.params.id}`,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_PREPARATION,
  })),
});
</script>

<template>
  <DataTablePreparation
    class="border-b"
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
