<script setup lang="ts">
const route = useRoute();
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: SPECIMEN_IDENTIFICATION_GEOLOGY.options,
  initHeaders: HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY,
});

const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch("/specimen_identification_geology/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    specimen: route.params.id,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY.byIds,
      locale: locale.value as "et" | "en",
    }),
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
    :is-loading="pending"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
