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
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT_LINK_SOLR,
});
const route = useRoute();
const { data, status } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/attachment_link", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `attachment_id:${route.params.id}`,
      sort: solrSort.value,
    },
  })),
});
</script>

<template>
  <DataTableAttachmentLink
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
