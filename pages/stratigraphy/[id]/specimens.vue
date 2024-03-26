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
  initOptions: SPECIMEN.options,
  initHeaders: HEADERS_SPECIMEN,
});
const { locale } = useI18n();

const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `(stratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${props.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${props.stratigraphy.hierarchy_string}*))`,
      sort: getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_SPECIMEN.byIds,
        locale: locale.value as "et" | "en",
      }),
    },
  })),
});
</script>

<template>
  <DataTableSpecimen
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
