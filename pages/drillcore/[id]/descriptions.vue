<script setup lang="ts">
import isEmpty from "lodash/isEmpty";

const props = defineProps({
  locality: {
    type: Number,
    required: true,
  },
});

const {
  options,
  search,
  handleUpdate,
  headers,
  handleHeadersReset,
  handleHeadersChange,
} = useDataTableDetail({
  initOptions: DESCRIPTION.options,
  initHeaders: HEADERS_DESCRIPTION,
});

const { locale } = useI18n();

const { data, pending } = await useGeoloogiaApiFetch<GeoloogiaListResponse>("/locality_description/", {
  query: {
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    locality: props.locality,
    nest: 1,
    search: search.value,
    search_fields: Object.values(
      getAPIFieldValues(HEADERS_DESCRIPTION, locale.value),
    ).join(","),
    ordering: getGeoloogiaApiSort({
      sortBy: options.value.sortBy,
      headersMap: HEADERS_DESCRIPTION.byIds,
      locale: locale.value as "et" | "en",
    }),
  },
  transform: (res) => {
    return {
      ...res,
      results: res.results.map((item) => {
        return {
          ...item,
          canExpand:
            !isEmpty(item.description)
            || item?.rock?.name
            || item?.rock?.name_en
            || item.zero_level
            || item.author_free
            || item.reference
            || item.year
            || item.stratigraphy_free
            || item.remarks,
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
