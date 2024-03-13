<script setup lang="ts">
const props = defineProps({
  locality: {
    type: Number,
    required: true,
  },
});

const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: SAMPLE.options,
  initHeaders: HEADERS_SAMPLE,
});
const { locale } = useI18n();

const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/sample", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${props.locality}`,
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
  <DataTableSample
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
