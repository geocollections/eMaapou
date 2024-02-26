<script setup lang="ts">
import { AREA, HEADERS_AREA } from "~/constants";

const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: AREA.options,
  initHeaders: HEADERS_AREA,
});

const route = useRoute();
const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch<{
  response: { numFound: number; docs: any[] };
}>("/area/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    parent_area: route.params.id,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_AREA, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_AREA.byIds,
      locale: locale.value as "et" | "en",
    }),
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
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
