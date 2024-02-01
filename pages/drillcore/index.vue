<template>
  <search>
    <template #title>
      <header-search
        :title="$t('drillcore.pageTitle').toString()"
        :count="data?.response.numFound ?? 0"
        :icon="mdiScrewMachineFlatTop"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-drillcore
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
      <v-card
        flat
        :rounded="0"
        style="
          border-top: 1px solid lightgray;
          border-bottom: 1px solid lightgray;
        "
      >
        <data-table-drillcore
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
      </v-card>
    </template>
  </search>
</template>

<script setup lang="ts">
import { mdiScrewMachineFlatTop } from "@mdi/js";

const drillcoresStore = useDrillcores();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = drillcoresStore;
const {
  solrSort,
  solrQuery,
  solrFilters,
  options,
  headers,
  searchPosition,
  resultsCount,
} = storeToRefs(drillcoresStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshLocalities,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/drillcore", {
  query: computed(() => ({
    // fl: $getAPIFieldValues(HEADERS_LOCALITY),
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilters.value,
      sort: solrSort.value,
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

async function handleDataTableUpdate({ options: newOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

function handleClickRow(index: number) {
  searchPosition.value =
    index + getOffset(options.value.page, options.value.itemsPerPage);
}
</script>
