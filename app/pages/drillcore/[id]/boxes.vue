<script setup lang="ts">
const { options, searchParams, handleUpdate } = useDataTableGeoloogiaApi({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});
const route = useRoute();

export interface DrillcoreBox {
  id: number;
  number: string;
  depth_start: Nullable<number>;
  depth_end: Nullable<number>;
  depth_other: Nullable<string>;
  remarks: Nullable<string>;
  image: Nullable<string>;
  stratigraphy_top: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  stratigraphy_base: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
};

const { data, status } = await useNewApiFetch<GeoloogiaListResponse<DrillcoreBox>>(`/drillcores/${route.params.id}/drillcore-boxes/`, {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    ordering: "depth_start,drillcore_box",
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
});
</script>

<template>
  <ListDrillcoreBox
    :options="options"
    :count="data?.count ?? 0"
    :items="data?.results ?? []"
    :is-loading="status === 'pending'"
    @update="handleUpdate"
  />
</template>
