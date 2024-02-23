<script setup lang="ts">
import { HEADERS_STRATOTYPE, STRATOTYPE } from "~/constants";

const {
  options,
  search,
  handleUpdate,
  handleHeadersReset,
  handleHeadersChange,
  headers,
} = useDataTableDetail({
  initOptions: STRATOTYPE.options,
  initHeaders: HEADERS_STRATOTYPE,
});
const route = useRoute();
const { locale } = useI18n();

const { data, pending } = await useGeoloogiaApiFetch(
  "/stratigraphy_stratotype/",
  {
    query: {
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      locality: route.params.id,
      nest: 1,
      search: search.value,
      search_fields: Object.values(
        getAPIFieldValues(HEADERS_STRATOTYPE, locale.value),
      ).join(","),
      ordering: getGeoloogiaApiSort({
        sortBy: options.value.sortBy,
        headersMap: HEADERS_STRATOTYPE.byIds,
        locale: locale.value as "et" | "en",
      }),
    },
  },
);
</script>

<template>
  <data-table-stratotype
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
