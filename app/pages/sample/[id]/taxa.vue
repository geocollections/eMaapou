<script setup lang="ts">
const route = useRoute();
const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  sortBy,
  searchParams,
} = useDataTableGeoloogiaApi({
  initOptions: TAXON_LIST.options,
  initHeaders: HEADERS_TAXON_LIST,
});

const { data, status } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/taxon_list/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    sample: route.params.id,
    nest: 1,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});

const { exportData } = useExportGeoloogiaApi("/taxon_list/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    sample: route.params.id,
    nest: 1,
    ordering: sortBy,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableTaxonList
    class="border-b"
    :items="data?.results ?? []"
    :count="data?.count ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="status === 'pending'"
    :export-func="exportData"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
