<script setup lang="ts">
import { mdiChartLine } from "@mdi/js";
import cloneDeep from "lodash/cloneDeep";
import { FIELDS_SOLR_ANALYTICAL_DATA } from "~/constants";

const route = useRoute();

const analyticalDataStore = useAnalyticalData();
const { resetFilters, resetDataTable } = analyticalDataStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  addHeaders,
  getQueryParams,
} = analyticalDataStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount, filters }
  = storeToRefs(analyticalDataStore);

setStateFromQueryParams(route);

const { $solrFetch } = useNuxtApp();

const { data: parameterHeaders } = await useAsyncData(async () => {
  const res = await $solrFetch<SolrResponse>("/analysis_parameter", {
    query: {
      json: {
        query: "*",
        limit: 1000,
      },
    },
  });

  return res.response.docs.reduce((acc: any, doc: any) => {
    if (!doc.parameter_index)
      return acc;

    const showHeader = filters.value.parameter.value.some(value => value.parameter === doc.parameter_index);
    const correctParameterIndex = doc.parameter_index.replace(
      /\W/g,
      "_",
    );

    acc.byIds[doc.parameter_index] = {
      title: doc.parameter,
      value: correctParameterIndex,
      show: showHeader,
      titleTranslate: false,
      parameter: true,
      ...narrowColumn,
    };
    acc.allIds.push(doc.parameter_index);
    return acc;
  }, { byIds: {}, allIds: [] });
});

const {
  data,
  status,
  refresh: refreshAnalyticalData,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/analytical_data", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilters.value,
      sort: solrSort.value,
      fields: FIELDS_SOLR_ANALYTICAL_DATA.concat(",", Object.values(parameterHeaders.value.byIds).map((header: any) => header.value).join(",")),
    },
  })),
  watch: false,
});

addHeaders(parameterHeaders.value);

const finalHeaders = computed(() => {
  const headersClone = cloneDeep(headers.value);

  headersClone.forEach((header: any, i: number) => {
    if (header.parameter)
      headersClone[i] = { ...header, ...numberFieldProps };
  });
  return headersClone;
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refreshAnalyticalData();
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

const searchPosition = useSearchPosition();
const { setSearchPosition } = searchPosition;
const { searchModule } = storeToRefs(searchPosition);
function handleClickRow({ index, id }: { index: number; id: number }) {
  searchModule.value = "analyticalData";
  setSearchPosition(
    { name: "analysis-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/analytical_data", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
  })),
});

useSeoMeta({
  title: t("analyticalData.pageTitle"),
  ogTitle: t("analyticalData.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #form="{ closeMobileSearch }">
      <SearchFormAnalyticalData
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
    <template #title>
      <HeaderSearch
        :title="$t('analyticalData.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiChartLine"
      />
    </template>

    <DataTableAnalyticalData
      class="border-t border-b"
      :show-search="false"
      :items="data?.response.docs ?? []"
      :count="data?.response.numFound ?? 0"
      :headers="finalHeaders"
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
