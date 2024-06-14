<script setup lang="ts">
import { AREA, HEADERS_AREA } from "~/constants";

const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  solrSort,
  solrQuery,
} = useDataTable({
  initOptions: AREA.options,
  initHeaders: HEADERS_AREA,
});

const route = useRoute();

const solrFilter = computed(() => {
  return `parent_area_id:${route.params.id}`;
});

const {
  data,
  pending,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/area", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilter.value,
      sort: solrSort.value,
    },
  })),
  watch: false,
});

const { exportData } = useExportSolr("/area", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilter.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_AREA,
  })),
});
</script>

<template>
  <DataTableArea
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="pending"
    :export-func="exportData"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
