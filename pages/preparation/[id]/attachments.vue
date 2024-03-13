<script setup lang="ts">
const route = useRoute();
const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});

const { locale } = useI18n();
const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/attachment_link/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    preparation: route.params.id,
    nest: 2,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_ATTACHMENT, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_ATTACHMENT.byIds,
      locale: locale.value as "et" | "en",
    }),
  },
});
</script>

<template>
  <DataTableAttachment
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
