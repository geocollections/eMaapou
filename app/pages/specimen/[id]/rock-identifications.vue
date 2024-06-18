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
  initOptions: SPECIMEN_IDENTIFICATION_GEOLOGY.options,
  initHeaders: HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY,
});

const { data, status } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/specimen_identification_geology/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    specimen: route.params.id,
    nest: 1,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});

const { exportData } = useExportGeoloogiaApi("/dataset_reference/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    specimen: route.params.id,
    nest: 1,
    ordering: sortBy,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableSpecimenIdentificationGeology
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
