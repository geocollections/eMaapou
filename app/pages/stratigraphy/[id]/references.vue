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
  initOptions: STRATIGRAPHY_REFERENCE.options,
  initHeaders: HEADERS_STRATIGRAPHY_REFERENCE,
});
const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useApiFetch<GeoloogiaListResponse>(`/stratigraphies/${route.params.id}/stratigraphy-references/`, {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    expand: "reference",
    ordering: sortBy.value ?? "-reference__year",
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

const { exportData } = useExportApi(`/stratigraphies/${route.params.id}/stratigraphy-references/`, {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    expand: "reference",
    ordering: sortBy.value ?? "-reference__year",
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableStratigraphyReference
    class="border-b"
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
