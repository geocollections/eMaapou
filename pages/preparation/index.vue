<script setup lang="ts">
import { mdiEyedropper } from "@mdi/js";

const preparationsStore = usePreparations();
const { resetFilters, resetDataTable } = preparationsStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = preparationsStore;
const {
  solrSort,
  solrQuery,
  solrFilters,
  options,
  headers,
  resultsCount,
} = storeToRefs(preparationsStore);

const route = useRoute();

setStateFromQueryParams(route);
watch(() => route.query, () => {
  setStateFromQueryParams(route);
  refreshPreparations();
}, { deep: true });

const {
  data,
  pending,
  refresh: refreshPreparations,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/preparation", {
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
  await refreshPreparations();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshPreparations();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshPreparations();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "preparation-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "preparation",
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/preparation", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_PREPARATION,
  })),
});

definePageMeta({
  layout: false,
});

useHead({
  title: t("preparation.pageTitle"),
});
</script>

<template>
  <NuxtLayout name="search">
    <template #title>
      <HeaderSearch
        :title="$t('preparation.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiEyedropper"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormPreparation
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="handleUpdate"
        @reset="handleReset"
      />
    </template>

    <DataTablePreparation
      class="border-t border-b"
      :show-search="false"
      :items="data?.response.docs ?? []"
      :count="data?.response.numFound ?? 0"
      :headers="headers"
      :options="options"
      :is-loading="pending"
      :export-func="exportData"
      @update="handleDataTableUpdate"
      @change:headers="handleHeadersChange"
      @reset:headers="handleHeadersReset(options)"
      @click:row="handleClickRow"
    />
  </NuxtLayout>
</template>
