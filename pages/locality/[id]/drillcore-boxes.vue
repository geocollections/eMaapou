<template>
  <list-drillcore-box
    :options="options"
    :count="data?.count ?? 0"
    :items="data?.results ?? []"
    :is-loading="pending"
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ATTACHMENT_LINK, HEADERS_ATTACHMENT } from "~/constants";

const props = defineProps<{
  drillcore: number;
}>();

const { options, search, handleUpdate } = useDataTableDetail({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});
const route = useRoute();
const { locale } = useI18n();

const { data, pending } = await useGeoloogiaApiFetch("/attachment_link/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    ordering: "drillcore_box__depth_start,drillcore_box",
    drillcore_box__drillcore: props.drillcore,
    attachment__is_preferred: true,
    nest: 2,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_ATTACHMENT, locale.value)
    ).join(","),
  },
});
</script>
