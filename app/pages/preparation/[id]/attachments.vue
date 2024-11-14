<script setup lang="ts">
const route = useRoute();
const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  sortBy,
  searchParams,
  setStateFromQueryParams,
} = useDataTableGeoloogiaApi({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});

setStateFromQueryParams(route);

const { data, status, refresh } = await useApiFetch<GeoloogiaListResponse>(`/preparations/${route.params.id}/attachments/`, {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    expand: "mime_type,author",
    fields: ["id", "uuid_filename", "mime_type.content_type", "description", "description_en", "author.name"].join(","),
    ordering: sortBy.value,
    ...searchParams.value,
  },
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { exportData } = useExportGeoloogiaApi("/attachment_link/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    preparation: route.params.id,
    nest: 2,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableAttachment
    :items="data?.results ?? []"
    :count="data?.count ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="status === 'pending'"
    :export-func="exportData"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
