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

const { setSearchPosition } = useSearchPosition();

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  status,
  refresh: refreshDrillcores,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/drillcore", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilters.value,
      sort: solrSort.value,
      fields: FIELDS_SOLR_DRILLCORE,
    },
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refreshDrillcores();
  resultsCount.value = data.value?.response.numFound ?? 0;
}, { deep: true });

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
}

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
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_DRILLCORE,
  })),
});

useHead({
  title: t("drillcore.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
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
      :is-loading="status === 'pending'"
      :export-func="exportData"
      @update="handleDataTableUpdate"
      @change:headers="handleHeadersChange"
      @reset:headers="handleHeadersReset(options)"
      @click:row="handleClickRow"
    />
  </TemplateSearch>
</template>
