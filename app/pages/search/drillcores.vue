<script setup lang="ts">
const props = defineProps<{ query: string }>();

const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
} = useDataTable({
  initOptions: DRILLCORE.options,
  initHeaders: HEADERS_DRILLCORE,
});

const { data, status } = await useSolrFetch<SolrResponse>("/drillcore", {
  query: computed(() => ({
    q: props.query,
    rows: options.value.itemsPerPage,
    start: getOffset(options.value.page, options.value.itemsPerPage),
    sort: solrSort.value,
  })),
});
</script>

<template>
  <DataTableDrillcore
    :show-search="false"
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="status === 'pending'"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
