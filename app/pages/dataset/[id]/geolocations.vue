<script setup lang="ts">
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
  initOptions: DATASET_GEOLOCATIONS.options,
  initHeaders: HEADERS_DATASET_GEOLOCATION,
});

const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/dataset_geolocation/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    dataset: route.params.id,
    nest: 1,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { exportData } = useExportGeoloogiaApi("/dataset_geolocation/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    dataset: route.params.id,
    nest: 1,
    ordering: sortBy,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableDatasetGeolocation
    id-field="dataset"
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
