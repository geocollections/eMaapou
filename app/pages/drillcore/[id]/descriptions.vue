<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

const props = defineProps<{ locality: number }>();

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
  initOptions: DESCRIPTION.options,
  initHeaders: HEADERS_DESCRIPTION,
});

const route = useRoute();
setStateFromQueryParams(route);

const { data, status, refresh } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/locality_description/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    locality: props.locality,
    nest: 1,
    ordering: sortBy.value,
    ...searchParams.value,
  },
  transform: (res) => {
    return {
      ...res,
      results: res.results.map((item) => {
        return {
          ...item,
          canExpand:
            !isEmpty(item.description)
            || !!item?.rock?.name
            || !!item?.rock?.name_en
            || !!item.zero_level
            || !!item.author_free
            || !!item.reference
            || !!item.year
            || !!item.stratigraphy_free
            || !!item.remarks,
        };
      }),
    };
  },
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refresh();
});

const { exportData } = useExportGeoloogiaApi("/locality_description/", {
  totalRows: computed(() => data.value?.count ?? 0),
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    locality: props.locality,
    nest: 1,
    ordering: sortBy,
    ...searchParams.value,
  })),
});
</script>

<template>
  <DataTableDescription
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
