<template>
  <data-table-specimen
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

<script setup lang="ts">
import { HEADERS_SPECIMEN, SPECIMEN } from "~/constants";

const props = defineProps<{
  locality: number;
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
      filter: `locality_id:${props.locality}`,
      sort: getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_SPECIMEN.byIds,
        locale: locale.value as "et" | "en",
      }),
    },
  })),
});
</script>
