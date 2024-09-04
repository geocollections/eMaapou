<script setup lang="ts">
import { ATTACHMENT_LINK, HEADERS_ATTACHMENT } from "~/constants";
import type { DrillcoreBox } from "~/pages/drillcore/[id]/boxes.vue";

const props = defineProps<{
  drillcore: number;
}>();

const { options, handleUpdate, searchParams, setStateFromQueryParams } = useDataTableGeoloogiaApi({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});

const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useNewApiFetch<GeoloogiaListResponse<DrillcoreBox>>(`/drillcores/${props.drillcore}/drillcore-boxes/`, {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    ordering: "depth_start,id",
    expand: ["stratigraphy_base", "stratigraphy_top"].join(","),
    fields: [
      "id",
      "number",
      "depth_start",
      "depth_end",
      "depth_other",
      "remarks",
      "image",
      "stratigraphy_top",
      "stratigraphy_top.id",
      "stratigraphy_top.name",
      "stratigraphy_top.name_en",
      "stratigraphy_base",
      "stratigraphy_base.id",
      "stratigraphy_base.name",
      "stratigraphy_base.name_en",
    ].join(","),
    search: searchParams.value?.search,
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { page: otherDrillcoreBoxPage } = storeToRefs(useDrillcoreBoxPosition());

function handleClick(_box: DrillcoreBox, position: number) {
  otherDrillcoreBoxPage.value = Math.floor(position / 10) + 1;
}
</script>

<template>
  <ListDrillcoreBox
    :options="options"
    :count="data?.count ?? 0"
    :items="data?.results ?? []"
    :is-loading="status === 'pending'"
    @update="handleUpdate"
    @click="handleClick"
  />
</template>
