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
  initOptions: STRATIGRAPHY.options,
  initHeaders: HEADERS_STRATIGRAPHY,
});
const route = useRoute();

const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/stratigraphy", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `parent_id:${route.params.id}`,
      sort: solrSort.value,
    },
  })),
});
</script>

<template>
  <DataTableStratigraphy
    class="border-b"
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
