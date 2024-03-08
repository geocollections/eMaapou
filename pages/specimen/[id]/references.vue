<script setup lang="ts">
import { SPECIMEN_REFERENCE } from "~/constants";
import { HEADERS_SPECIMEN_REFERENCE } from "~/constants/headersNew";

const route = useRoute();
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: SPECIMEN_REFERENCE.options,
  initHeaders: HEADERS_SPECIMEN_REFERENCE,
});

const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch("/specimen_reference/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    specimen: route.params.id,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_SPECIMEN_REFERENCE, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_SPECIMEN_REFERENCE.byIds,
      locale: locale.value as "et" | "en",
    }),
  })),
});
</script>

<template>
  <DataTableSpecimenReference
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
