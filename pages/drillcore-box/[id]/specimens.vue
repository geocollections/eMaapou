<script setup lang="ts">
const props = defineProps<{
  locality: number;
  depthStart: number;
  depthEnd: number;
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

const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${props.locality} AND (depth:[${props.depthStart} TO ${props.depthEnd}] OR depth_interval:[${props.depthStart} TO ${props.depthEnd}])`,
      sort: solrSort.value,
    },
  })),
});
</script>

<template>
  <DataTableSpecimen
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="pending"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
