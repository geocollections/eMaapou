<template>
  <data-table-synonym
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

<script setup lang="ts">
import { HEADERS_SYNONYM, SYNONYM } from "~/constants";
const route = useRoute();
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: SYNONYM.options,
  initHeaders: HEADERS_SYNONYM,
});

const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch("/locality_synonym/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    locality: route.params.id,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_SYNONYM, locale.value)
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_SYNONYM.byIds,
      locale: locale.value as "et" | "en",
    }),
  },
});
</script>
