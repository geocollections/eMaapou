<script setup lang="ts">
const {
  options,
  handleUpdate,
  handleHeadersReset,
  handleHeadersChange,
  headers,
  sortBy,
  searchParams,
} = useDataTableGeoloogiaApi({
  initOptions: STRATOTYPE.options,
  initHeaders: HEADERS_LOCALITY_STRATOTYPE,
});
const route = useRoute();

const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>(
  "/stratigraphy_stratotype/",
  {
    query: computed(() => ({
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      locality: route.params.id,
      nest: 1,
      ordering: sortBy.value,
      ...searchParams.value,
    })),
  },
);

const { exportData } = useExportGeoloogiaApi("/stratigraphy_stratotype/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    locality: route.params.id,
    nest: 1,
    ordering: sortBy,
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
    :is-loading="pending"
    :export-func="exportData"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
