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
  initOptions: LOCALITY.options,
  initHeaders: HEADERS_AREA_LOCALITY,
});

const route = useRoute();
const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/locality/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    area: route.params.id,
    nest: 1,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});

const { exportData } = useExportGeoloogiaApi("/locality/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    area: route.params.id,
    nest: 1,
    ordering: sortBy,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableLocality
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
