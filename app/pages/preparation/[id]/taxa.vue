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
  setStateFromQueryParams,
} = useDataTableGeoloogiaApi({
  initOptions: TAXON_LIST.options,
  initHeaders: HEADERS_TAXON_LIST,
});

setStateFromQueryParams(route);

const { data, status, refresh } = await useApiFetch<GeoloogiaListResponse>(`preparations/${route.params.id}/preparation-taxa/`, {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    expand: "taxon",
    ordering: sortBy.value,
    ...searchParams.value,
  },
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { exportData } = useExportApi(`preparations/${route.params.id}/preparation-taxa/`, {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    expand: "taxon",
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableTaxonList
    :items="data?.results ?? []"
    :count="data?.count ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="status === 'pending'"
    :export-func="exportData"
    :export-types="['csv']"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
