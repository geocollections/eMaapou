<script setup lang="ts">
import { mdiLayersTriple } from "@mdi/js";
import TemplateSearch from "~/components/TemplateSearch.vue";

const route = useRoute();

const stratigraphiesStore = useStratigraphies();
const { resetFilters, resetDataTable } = stratigraphiesStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = stratigraphiesStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(stratigraphiesStore);

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshStratigraphies,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/stratigraphy", {
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
  await refreshStratigraphies();
  resultsCount.value = data.value?.response.numFound ?? 0;
}, { deep: true });

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshStratigraphies();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshStratigraphies();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshStratigraphies();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "stratigraphy-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/stratigraphy", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_STRATIGRAPHY,
  })),
});

useHead({
  title: t("stratigraphy.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #title>
      <HeaderSearch
        :title="$t('stratigraphy.pageTitle').toString()"
        :count="data?.response.numFound ?? 0"
        :icon="mdiLayersTriple"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormStratigraphy
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

    <DataTableStratigraphy
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
  </TemplateSearch>
</template>
