<script setup lang="ts">
const props = defineProps<{
  stratigraphy: any;
}>();

const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
} = useDataTable({
  initOptions: SPECIMEN.options,
  initHeaders: HEADERS_SPECIMEN,
});

const { data, status } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `(stratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*))`,
      sort: solrSort.value,
    },
  })),
});
const { exportData } = useExportSolr("/specimen", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: `(stratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*))`,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
  })),
});
</script>

<template>
  <DataTableSpecimen
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
