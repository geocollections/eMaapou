<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

const {
  options,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
  sortBy,
  searchParams,
} = useDataTableGeoloogiaApi({
  initOptions: DESCRIPTION.options,
  initHeaders: HEADERS_DESCRIPTION,
});
const route = useRoute();

const { data, pending } = await useGeoloogiaApiFetch<{
  count: number;
  results: any[];
}>("/locality_description/", {
  query: computed(() => ({
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    locality: route.params.id,
    nest: 1,
    ordering: sortBy.value,
    ...searchParams.value,
  })),
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
});
</script>

<template>
  <DataTableDescription
    :items="data?.results ?? []"
    :count="data?.count ?? 0"
    :options="options"
    :headers="headers"
    :is-loading="pending"
    @update="handleUpdate"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset(options)"
  />
</template>
