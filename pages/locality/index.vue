<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import { mdiMapMarker } from "@mdi/js";

const { $translate } = useNuxtApp();

const localitiesStore = useLocalities();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = localitiesStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(localitiesStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshLocalities,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/locality", {
  query: computed(() => ({
    // fl: $getAPIFieldValues(HEADERS_LOCALITY),
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilters.value,
      sort:
        solrSort.value
        ?? $translate({ et: "locality asc", en: "locality_en asc" }),
    },
  })),
  watch: false,
});

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() as LocationQueryRaw });
}

async function handleUpdate() {
  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  // TODO: reset filters
  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({
  options: newOptions,
}: {
  options: DataTableOptions;
}) {
  options.value = newOptions;

  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "locality-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
  );
}
</script>

<template>
  <search>
    <template #title>
      <header-search
        :title="$t('locality.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiMapMarker"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-locality
        @update="
          handleUpdate();
          closeMobileSearch();
        "
        @reset="
          handleReset();
          closeMobileSearch();
        "
      />
    </template>

    <template #result>
      <data-table-locality
        class="border-t border-t"
        :show-search="false"
        :items="data?.response.docs ?? []"
        :count="data?.response.numFound ?? 0"
        :headers="headers"
        :options="options"
        dynamic-headers
        :is-loading="pending"
        stateful-headers
        @update="handleDataTableUpdate"
        @change:headers="handleHeadersChange"
        @reset:headers="handleHeadersReset(options)"
        @click:row="handleClickRow"
      />
    </template>
  </search>
</template>
