<script setup lang="ts">
const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
} = useDataTable({
  initOptions: FOSSILS.options,
  initHeaders: HEADERS_FOSSIL,
});

const route = useRoute();
const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/taxon_search", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${route.params.id} AND rank:[14 TO 18]`,
      sort:
        solrSort.value ?? "fossil_group ASC,taxon ASC",
    },
  })),
});
</script>

<template>
  <DataTableFossil
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
