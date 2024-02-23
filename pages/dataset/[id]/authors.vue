<script setup lang="ts">
import { DATASET_AUTHORS, HEADERS_DATASET_AUTHOR } from "~/constants";

const route = useRoute();
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: DATASET_AUTHORS.options,
  initHeaders: HEADERS_DATASET_AUTHOR,
});

const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch("/dataset_author/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    dataset: route.params.id,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_DATASET_AUTHOR, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_DATASET_AUTHOR.byIds,
      locale: locale.value as "et" | "en",
    }),
  },
});
</script>

<template>
  <data-table-dataset-author
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
