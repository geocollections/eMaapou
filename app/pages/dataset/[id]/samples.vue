<script setup lang="ts">
const props = withDefaults(defineProps<{
  parameterHeaders: {
    byIds: Record<string, any>;
    allIds: string[];
  };
}>(), {
  parameterHeaders: () => ({
    byIds: {},
    allIds: [],
  }),
});
const allHeaders = computed(() => {
  return {
    byIds: { ...HEADERS_SAMPLE_DATA.byIds, ...props.parameterHeaders.byIds },
    allIds: [...HEADERS_SAMPLE_DATA.allIds, ...props.parameterHeaders.allIds],
  };
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
  initOptions: SAMPLE_DATA.options,
  initHeaders: allHeaders.value,
});

const route = useRoute();
const { data, status } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/sample_data", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `dataset_ids:${route.params.id}`,
      sort: solrSort.value,
    },
  })),
});

const { exportData } = useExportSolr("/sample_data", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    filter: `dataset_ids:${route.params.id}`,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
  })),
});
</script>

<template>
  <DataTableSampleData
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
