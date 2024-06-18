<script setup lang="ts">
import { mdiMapMarkerRadiusOutline } from "@mdi/js";
import type { LocationQueryRaw } from "vue-router";

const areasStore = useAreas();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
  resetFilters,
  resetDataTable,
} = areasStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(areasStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  status,
  refresh: refreshAreas,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/area", {
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
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshAreas();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshAreas();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshAreas();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "area-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "area",
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/area", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_AREA,
  })),
});

useHead({
  title: t("area.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #title>
      <HeaderSearch
        :title="$t('area.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiMapMarkerRadiusOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormArea
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="handleUpdate"
        @reset="handleReset"
      />
    </template>

    <DataTableArea
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
