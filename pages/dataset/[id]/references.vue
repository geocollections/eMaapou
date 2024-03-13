<script setup lang="ts">
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: DATASET_REFERENCE.options,
  initHeaders: HEADERS_DATASET_REFERENCE,
});

const route = useRoute();
const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/dataset_reference/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    dataset: route.params.id,
    nest: 2,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_DATASET_REFERENCE, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_DATASET_REFERENCE.byIds,
      locale: locale.value as "et" | "en",
    }),
  })),
});
</script>

<template>
  <DataTableDatasetReference
    :items="data?.results ?? []"
    :count="data?.count ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="pending"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
