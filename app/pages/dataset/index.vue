<script setup lang="ts">
import { mdiDatabaseOutline } from "@mdi/js";
import { FIELDS_SOLR_DATASET } from "~/constants";

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

const { setSearchPosition } = useSearchPosition();

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  status,
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
      fields: FIELDS_SOLR_DATASET,
    },
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refreshDatasets();
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
    { name: "dataset-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "dataset",
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/dataset", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_DATASET,
  })),
});

useHead({
  title: t("dataset.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #title>
      <HeaderSearch
        :title="$t('dataset.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiDatabaseOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormDataset
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="handleUpdate"
        @reset="handleReset"
      />
    </template>

    <DataTableDataset
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
