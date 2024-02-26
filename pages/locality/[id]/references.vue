<script setup lang="ts">
import { HEADERS_LOCALITY_REFERENCE, LOCALITY_REFERENCE } from "~/constants";

const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: LOCALITY_REFERENCE.options,
  initHeaders: HEADERS_LOCALITY_REFERENCE,
});
const route = useRoute();
const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch<{
  response: { numFound: number; docs: any[] };
}>("/locality_reference/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    locality: route.params.id,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_LOCALITY_REFERENCE, locale.value),
    ).join(","),
    // TODO: implement sorting
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_LOCALITY_REFERENCE.byIds,
      locale: locale.value as "et" | "en",
    }),
  })),
});
</script>

<template>
  <DataTableLocalityReference
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
