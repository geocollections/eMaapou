<script setup lang="ts">
const { options, searchParams, handleUpdate } = useDataTableGeoloogiaApi({
  initOptions: ATTACHMENT_LINK.options,
  initHeaders: HEADERS_ATTACHMENT,
});
const route = useRoute();

const { data, status } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/attachment_link/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    ordering: "drillcore_box__depth_start,drillcore_box",
    drillcore_box__drillcore: route.params.id,
    attachment__is_preferred: true,
    nest: 2,
    ...searchParams.value,
    search_fields: "drillcore_box__number,drillcore_box__stratigraphy_base__stratigraphy,drillcore_box__stratigraphy_base__stratigraphy_en,drillcore_box__stratigraphy_top__stratigraphy,drillcore_box__stratigraphy_top__stratigraphy_en",
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
