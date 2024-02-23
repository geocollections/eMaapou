<script setup lang="ts">
import { HEADERS_TAXON_LIST, TAXON_LIST } from "~/constants";

const route = useRoute();
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: TAXON_LIST.options,
  initHeaders: HEADERS_TAXON_LIST,
});

const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch("/taxon_list/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    sample: route.params.id,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_TAXON_LIST, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_TAXON_LIST.byIds,
      locale: locale.value as "et" | "en",
    }),
  },
});
</script>

<template>
  <data-table-taxon-list
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
