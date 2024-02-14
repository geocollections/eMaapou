<template>
  <data-table-sample-analysis-result
    class="border-b"
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="filteredHeaders"
    :is-loading="pending"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>

<script setup lang="ts">
import { HEADERS_ANALYSIS_RESULT, ANALYSIS_RESULT } from "~/constants";
const {
  options,
  handleUpdate,
  solrQuery,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: ANALYSIS_RESULT.options,
  initHeaders: HEADERS_ANALYSIS_RESULT,
});

const route = useRoute();
const { locale } = useI18n();

const filteredHeaders = computed(() =>
  headers.value.filter((header) => {
    return !header.value?.includes("depth") ?? true;
  }),
);

const { data, pending } = useSolrFetch("/analysis_results", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `sample_id:${route.params.id}`,
      sort: getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_ANALYSIS_RESULT.byIds,
        locale: locale.value as "et" | "en",
      }),
    },
  })),
});
</script>
