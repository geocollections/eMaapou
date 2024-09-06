<script setup lang="ts">
import { FIELDS_SOLR_SPECIMEN } from "~/constants";

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
  initOptions: SPECIMEN.options,
  initHeaders: HEADERS_SPECIMEN,
});
const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${route.params.id}`,
      sort: solrSort.value,
      fields: FIELDS_SOLR_SPECIMEN,
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

const { exportData } = useExportSolr("/specimen", {
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
  <DataTableSpecimen
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
