<script setup lang="ts">
const props = defineProps<{ query: string }>();

const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
  setQueryParamsFromState,
} = useDataTable({
  initOptions: REFERENCE.options,
  initHeaders: HEADERS_REFERENCE,
  initQuery: computed(() => props.query),
  overrideInternalSearch: true,
});

setQueryParamsFromState();

const { data, status } = await useSolrFetch<SolrResponse>("/reference", {
  query: computed(() => ({
    q: props.query,
    rows: options.value.itemsPerPage,
    start: getOffset(options.value.page, options.value.itemsPerPage),
    sort: solrSort.value,
  })),
});
</script>

<template>
  <DataTableReference
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
