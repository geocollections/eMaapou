<script setup lang="ts">
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: STRATIGRAPHY_SYNONYM.options,
  initHeaders: HEADERS_STRATIGRAPHY_SYNONYM,
});
const route = useRoute();
const { locale } = useI18n();

const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/stratigraphy_synonym/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    stratigraphy: route.params.id,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_STRATIGRAPHY_SYNONYM, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_STRATIGRAPHY_SYNONYM.byIds,
      locale: locale.value as "et" | "en",
    }),
  })),
});
</script>

<template>
  <DataTableStratigraphySynonym
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
