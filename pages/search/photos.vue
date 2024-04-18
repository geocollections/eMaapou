<script setup lang="ts">
const props = defineProps({
  query: {
    type: String,
    required: true,
  },
});

const {
  options,
  handleUpdate,
  headers,
  solrSort,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTable({
  initOptions: IMAGE.options,
  initHeaders: HEADERS_PHOTO,
});

const { data, pending } = await useSolrFetch<SolrResponse>("/attachment", {
  query: computed(() => ({
    q: props.query,
    rows: options.value.itemsPerPage,
    start: getOffset(options.value.page, options.value.itemsPerPage),
    fq: "specimen_image_attachment:2",
    sort: solrSort.value,
  })),
});
</script>

<template>
  <DataTableAttachmentSolr
    :show-search="false"
    :items="data?.response.docs ?? []"
    :count="data?.response.numFound ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="pending"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
