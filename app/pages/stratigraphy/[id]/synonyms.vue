<script setup lang="ts">
const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  sortBy,
  searchParams,
} = useDataTableGeoloogiaApi({
  initOptions: STRATIGRAPHY_SYNONYM.options,
  initHeaders: HEADERS_STRATIGRAPHY_SYNONYM,
});
const route = useRoute();

const { data, status } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/stratigraphy_synonym/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    stratigraphy: route.params.id,
    nest: 1,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});

const { exportData } = useExportGeoloogiaApi("/stratigraphy_synonym/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    stratigraphy: route.params.id,
    nest: 1,
    ordering: sortBy,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableStratigraphySynonym
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
