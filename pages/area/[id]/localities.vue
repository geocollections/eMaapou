<script setup lang="ts">
import { HEADERS_LOCALITY, LOCALITY } from "~/constants";

const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: LOCALITY.options,
  initHeaders: HEADERS_LOCALITY,
});

const route = useRoute();
const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch<{
  response: { numFound: number; docs: any[] };
}>("/locality/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    area: route.params.id,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_LOCALITY, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_LOCALITY.byIds,
      locale: locale.value as "et" | "en",
    }),
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
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
