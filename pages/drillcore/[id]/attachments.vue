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
} = useDataTableGeoloogiaApi({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});

const route = useRoute();

const orSearch = computed(() => {
  const orSearch = [`drillcore:${route.params.id}`];
  if (props.locality)
    orSearch.push(`locality:${props.locality}`);

  return orSearch.join(" OR ");
});

const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/attachment_link/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    nest: 2,
    or_search: orSearch.value,
    ordering: sortBy.value,
    ...searchParams.value,
  },
});

const { exportData } = useExportGeoloogiaApi("/attachment_link/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    or_search: orSearch.value,
    nest: 2,
    ordering: sortBy,
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
    :is-loading="pending"
    :export-func="exportData"
    id-field="attachment"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
