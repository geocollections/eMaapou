<template>
  <data-table-analysis
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
import { HEADERS_ANALYSIS, ANALYSIS } from "~/constants";
const {
  options,
  handleUpdate,
  solrQuery,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: ANALYSIS.options,
  initHeaders: HEADERS_ANALYSIS,
});

const filteredHeaders = computed(() =>
  headers.value.filter((header) => {
    if (header.value === "sample_number") {
      return false;
    }
    if (header.value?.includes("depth") ?? false) {
      return false;
    }
    return true;
  }),
);

const route = useRoute();
const { locale } = useI18n();

const { data, pending } = await useSolrFetch("/analysis", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `sample_id:${route.params.id}`,
      sort: getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_ANALYSIS.byIds,
        locale: locale.value as "et" | "en",
      }),
    },
  })),
});
</script>
