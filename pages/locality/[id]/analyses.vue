<script setup lang="ts">
import { ANALYSIS, HEADERS_ANALYSIS } from "~/constants";

const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: ANALYSIS.options,
  initHeaders: HEADERS_ANALYSIS,
});
const route = useRoute();
const { locale } = useI18n();
const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/analysis", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${route.params.id}`,
      sort: getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_ANALYSIS.byIds,
        locale: locale.value as "et" | "en",
      }),
    },
  })),
});
</script>

<template>
  <data-table-analysis
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
