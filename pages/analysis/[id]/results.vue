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
  initOptions: ANALYSIS_RESULT.options,
  initHeaders: HEADERS_ANALYSIS_RESULT,
});

const route = useRoute();

const filteredHeaders = computed(() =>
  headers.value.filter((header) => {
    return (
      !(header.value === "analysis_method") ?? true
    );
  }),
);

const { data, pending } = await useSolrFetch("/analysis_results", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `analysis_id:${route.params.id}`,
      sort: solrSort.value,
    },
  })),
});
</script>

<template>
  <DataTableAnalysisResult
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="filteredHeaders"
    :is-loading="pending"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
