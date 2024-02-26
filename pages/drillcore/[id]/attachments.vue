<script setup lang="ts">
import { ATTACHMENT_LINK, HEADERS_ATTACHMENT } from "~/constants";

const props = defineProps<{
  locality: number;
}>();

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

const route = useRoute();
const { locale } = useI18n();

const { data, pending } = await useGeoloogiaApiFetch("/attachment_link/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    nest: 2,
    or_search: `drillcore:${route.params.id} OR locality:${props.locality}`,
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
    id-field="attachment"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
