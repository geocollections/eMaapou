<script setup lang="ts">
import { AREA, HEADERS_AREA } from "~/constants";

const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  sortBy,
  searchParams,
} = useDataTableGeoloogiaApi({
  initOptions: AREA.options,
  initHeaders: HEADERS_AREA,
});

const route = useRoute();
const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/area/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    parent_area: route.params.id,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});

const { exportData } = useExportGeoloogiaApi("/area/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    parent_area: route.params.id,
    ordering: sortBy,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableArea
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
