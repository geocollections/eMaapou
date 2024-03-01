<script setup lang="ts">
import { STRATOTYPE } from "~/constants";
import { HEADERS_LOCALITY_STRATOTYPE } from "~/constants/headersNew";

const {
  options,
  search,
  handleUpdate,
  handleHeadersReset,
  handleHeadersChange,
  headers,
} = useDataTableDetail({
  initOptions: STRATOTYPE.options,
  initHeaders: HEADERS_LOCALITY_STRATOTYPE,
});
const route = useRoute();
const { locale } = useI18n();

const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>(
  "/stratigraphy_stratotype/",
  {
    query: computed(() => ({
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      locality: route.params.id,
      nest: 1,
      search: search.value,
      search_fields: Object.values(
        getAPIFieldValues(HEADERS_LOCALITY_STRATOTYPE, locale.value),
      ).join(","),
      ordering: getGeoloogiaApiSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_LOCALITY_STRATOTYPE.byIds,
        locale: locale.value as "et" | "en",
      }),
    })),
  },
);
</script>

<template>
  <DataTableStratotype
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
