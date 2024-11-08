<script setup lang="ts">
const props = defineProps<{
  locality?: number;
}>();

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

const route = useRoute();
setStateFromQueryParams(route);

const orSearch = computed(() => {
  const orSearch = [`attachment_link__drillcore:${route.params.id}`];
  if (props.locality)
    orSearch.push(`attachment_link__locality:${props.locality}`);

  return orSearch.join(" OR ");
});

const { data, status, refresh } = await useNewApiFetch<GeoloogiaListResponse>("/attachments/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    expand: "mime_type,author",
    fields: ["id", "uuid_filename", "mime_type.content_type", "description", "description_en", "author.name"].join(","),
    or_search: orSearch.value,
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
    or_search: orSearch.value,
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
    id-field="attachment"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
