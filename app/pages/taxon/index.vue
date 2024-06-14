<script setup lang="ts">
import { mdiFamilyTree } from "@mdi/js";

const route = useRoute();

const taxaStore = useTaxa();
const { resetFilters, resetDataTable } = taxaStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = taxaStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(taxaStore);

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshTaxa,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/taxon", {
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

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refreshTaxa();
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

const { t } = useI18n();

const { exportData } = useExportSolr("/taxon", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_TAXON,
  })),
});

useHead({
  title: t("taxon.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #title>
      <HeaderSearch
        :title="$t('taxon.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiFamilyTree"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormTaxon
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="
          handleUpdate();
        "
        @reset="
          handleReset();
        "
      />
    </template>

    <DataTableTaxon
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
    />
  </TemplateSearch>
</template>
