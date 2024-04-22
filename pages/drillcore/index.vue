<script setup lang="ts">
import { mdiScrewMachineFlatTop } from "@mdi/js";

const drillcoresStore = useDrillcores();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
  resetFilters,
  resetDataTable,
} = drillcoresStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(drillcoresStore);

const route = useRoute();

setStateFromQueryParams(route);
watch(() => route.query, () => {
  setStateFromQueryParams(route);
  refreshDrillcores();
}, { deep: true });

const {
  data,
  pending,
  refresh: refreshDrillcores,
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
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshDrillcores();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshDrillcores();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshDrillcores();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "drillcore-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "drillcore",
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/drillcore", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  params: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
    limit: computed(() => options.value.itemsPerPage),
    offset: computed(() => getOffset(options.value.page, options.value.itemsPerPage)),
    fields: EXPORT_SOLR_DRILLCORE,
  },
});

useHead({
  title: t("drillcore.pageTitle"),
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="search">
    <template #title>
      <HeaderSearch
        :title="$t('drillcore.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiScrewMachineFlatTop"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormDrillcore
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="handleUpdate"
        @reset="handleReset"
      />
    </template>

    <DataTableDrillcore
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
