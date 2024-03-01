<script setup lang="ts">
import { LOCALITY } from "~/constants";
import { HEADERS_AREA_LOCALITY } from "~/constants/headersNew";

const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: LOCALITY.options,
  initHeaders: HEADERS_AREA_LOCALITY,
});

const route = useRoute();
const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/locality/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    area: route.params.id,
    search: search.value,
    nest: 1,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_AREA_LOCALITY, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_AREA_LOCALITY.byIds,
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
