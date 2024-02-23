<script setup lang="ts">
import { ANALYSIS, HEADERS_ANALYSIS } from "~/constants";

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
  initOptions: ANALYSIS.options,
  initHeaders: HEADERS_ANALYSIS,
});
const filteredHeaders = computed(() =>
  headers.value.filter((header) => {
    return !(header.value === "locality") ?? true;
  }),
);

const { locale } = useI18n();

const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/analysis", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `locality_id:${props.locality}`,
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
  <div>
    <data-table-analysis
      :items="data?.response.docs ?? []"
      :count="data?.response.numFound ?? 0"
      :options="options"
      :headers="filteredHeaders"
      :is-loading="pending"
      @update="handleUpdate"
      @change:headers="handleHeadersChange"
      @reset:headers="handleHeadersReset(options)"
    />
  </div>
</template>
