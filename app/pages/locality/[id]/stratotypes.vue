<script setup lang="ts">
const {
  options,
  handleUpdate,
  handleHeadersReset,
  handleHeadersChange,
  headers,
  sortBy,
  searchParams,
  setStateFromQueryParams,
} = useDataTableGeoloogiaApi({
  initOptions: STRATOTYPE.options,
  initHeaders: HEADERS_LOCALITY_STRATOTYPE,
});
const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useApiFetch<GeoloogiaListResponse>(
  `/localities/${route.params.id}/locality-stratotypes/`,
  {
    query: computed(() => ({
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      expand: "stratigraphy,reference,type",
      ordering: sortBy.value,
      ...searchParams.value,
    })),
    watch: false,
  },
);

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { exportData } = useExportApi(`/localities/${route.params.id}/locality-stratotypes/`, {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    expand: "stratigraphy,reference,type",
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableStratotype
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
