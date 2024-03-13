<script setup lang="ts">
const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: STRATIGRAPHY.options,
  initHeaders: HEADERS_STRATIGRAPHY,
});
const route = useRoute();
const { locale } = useI18n();

const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/stratigraphy", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `parent_id:${route.params.id}`,
      sort: getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_SAMPLE.byIds,
        locale: locale.value as "et" | "en",
      }),
    },
  })),
});
</script>

<template>
  <DataTableStratigraphy
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
