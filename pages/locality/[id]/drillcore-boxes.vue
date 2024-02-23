<script setup lang="ts">
import { ATTACHMENT_LINK, HEADERS_ATTACHMENT } from "~/constants";

const props = defineProps<{
  drillcore: number;
}>();

const { options, search, handleUpdate } = useDataTableDetail({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});

const { locale } = useI18n();

const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/attachment_link/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    ordering: "drillcore_box__depth_start,drillcore_box",
    drillcore_box__drillcore: props.drillcore,
    attachment__is_preferred: true,
    nest: 2,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_ATTACHMENT, locale.value as "et" | "en"),
    ).join(","),
  },
});
</script>

<template>
  <list-drillcore-box
    :options="options"
    :count="data?.count ?? 0"
    :items="data?.results ?? []"
    :is-loading="pending"
    @update="handleUpdate"
  />
</template>
