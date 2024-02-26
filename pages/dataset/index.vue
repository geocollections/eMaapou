<script setup lang="ts">
import { mdiDatabaseOutline } from "@mdi/js";

const datasetsStore = useDatasets();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = datasetsStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(datasetsStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshLocalities,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/dataset", {
  query: computed(() => ({
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

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "dataset-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
  );
}
</script>

<template>
  <Search>
    <template #title>
      <HeaderSearch
        :title="$t('dataset.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiDatabaseOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormDataset
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
      <DataTableDataset
        class="border-t border-b"
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
  </Search>
</template>
