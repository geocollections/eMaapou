<script setup lang="ts">
import { SAMPLE_DATA } from "~/constants";
import { HEADERS_SAMPLE_DATA } from "~/constants/headersNew";

const props = defineProps({
  parameterHeaders: {
    type: Object,
    default: () => {
      return { byIds: {}, allIds: [] };
    },
  },
});
const allHeaders = computed(() => {
  return {
    byIds: { ...HEADERS_SAMPLE_DATA.byIds, ...props.parameterHeaders.byIds },
    allIds: [...HEADERS_SAMPLE_DATA.allIds, ...props.parameterHeaders.allIds],
  };
});

const {
  options,
  solrQuery,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: SAMPLE_DATA.options,
  initHeaders: allHeaders.value,
});

const route = useRoute();
const { locale } = useI18n();
const { data, pending } = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/sample_data", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: `dataset_ids:${route.params.id}`,
      sort: getSolrSort({
        sortBy: options.value.sortBy,
        headersMap: {
          ...HEADERS_SAMPLE_DATA.byIds,
          ...props.parameterHeaders.byIds,
        },
        locale: locale.value as "et" | "en",
      }),
    },
  })),
});
</script>

<template>
  <DataTableSampleData
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
