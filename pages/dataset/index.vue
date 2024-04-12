<script setup lang="ts">
import { mdiDatabaseOutline } from "@mdi/js";

const datasetsStore = useDatasets();
const { resetFilters, resetDataTable } = datasetsStore;
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
watch(() => route.query, () => {
  setStateFromQueryParams(route);
  refreshDatasets();
}, {deep: true});

const {
  data,
  pending,
  refresh: refreshDatasets,
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
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshDatasets();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshDatasets();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshDatasets();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "dataset-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "dataset",
  );
}

const { t } = useI18n();

useHead({
  title: t("dataset.pageTitle"),
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="search">
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

    <DataTableDataset
      class="border-t border-b"
      :show-search="false"
      :items="data?.response.docs ?? []"
      :count="data?.response.numFound ?? 0"
      :headers="headers"
      :options="options"
      :is-loading="pending"
      @update="handleDataTableUpdate"
      @change:headers="handleHeadersChange"
      @reset:headers="handleHeadersReset(options)"
      @click:row="handleClickRow"
    />
  </NuxtLayout>
</template>
