<script setup lang="ts">
const props = defineProps({
  locality: {
    type: Number,
    required: true,
  },
});

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
const filteredHeaders = computed(() =>
  headers.value.filter((header) => {
    return !(header.value === "locality") ?? true;
  }),
);

const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/analysis", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${props.locality}`,
      sort: solrSort.value,
    },
  })),
});

const { exportData } = useExportSolr("/analysis", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: `locality_id:${props.locality}`,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
  })),
});
</script>

<template>
  <div>
    <DataTableAnalysis
      :items="data?.response.docs ?? []"
      :count="data?.response.numFound ?? 0"
      :options="options"
      :headers="filteredHeaders"
      :is-loading="pending"
      :export-func="exportData"
      @update="handleUpdate"
      @change:headers="handleHeadersChange"
      @reset:headers="handleHeadersReset(options)"
    />
  </div>
</template>
