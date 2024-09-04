<script setup lang="ts">
const props = defineProps<{ locality: number }>();

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
  initOptions: ANALYSIS.options,
  initHeaders: HEADERS_ANALYSIS,
});

const route = useRoute();
setStateFromQueryParams(route);

const filteredHeaders = computed(() =>
  headers.value.filter((header) => {
    return !(header.value === "locality");
  }),
);

const { data, status, refresh } = await useSolrFetch<{
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
      :is-loading="status === 'pending'"
      :export-func="exportData"
      @update="handleUpdate"
      @change:headers="handleHeadersChange"
      @reset:headers="handleHeadersReset(options)"
    />
  </div>
</template>
