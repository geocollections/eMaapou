<script setup lang="ts">
import { mdiImageFilterHdr } from "@mdi/js";

const { t } = useI18n();
const route = useRoute();

useSeoMeta({
  title: t("sample.pageTitle"),
});

const samplesStore = useSamples();
const { resetFilters, resetDataTable } = samplesStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = samplesStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(samplesStore);

setStateFromQueryParams(route);

const {
  data,
  status,
  refresh: refreshSamples,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/sample", {
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
  await refreshSamples();
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

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "sample-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "sample",
  );
}

const { exportData } = useExportSolr("/sample", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_SAMPLE,
  })),
});
</script>

<template>
  <TemplateSearch>
    <template #form="{ closeMobileSearch }">
      <SearchFormSample
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
        :title="$t('sample.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiImageFilterHdr"
      />
    </template>
    <DataTableSample
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
