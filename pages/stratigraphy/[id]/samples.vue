<script setup lang="ts">
const props = defineProps<{
  stratigraphy: any;
}>();

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
      filter: `(stratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*))`,
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
