<script setup lang="ts">
import { mdiMapMarkerOutline } from "@mdi/js";
import type { DataTableOptions } from "~/constants";

const sitesStore = useSites();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
  resetFilters,
  resetDataTable,
} = sitesStore;
const {
  solrSort,
  solrQuery,
  solrFilters,
  options,
  headers,
  resultsCount,
} = storeToRefs(sitesStore);

const {
  data,
  pending,
  refresh: refreshSites,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/site", {
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

const route = useRoute();

setStateFromQueryParams(route);
watch(() => route.query, () => {
  setStateFromQueryParams(route);
  refreshSites();
}, { deep: true });

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshSites();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshSites();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshSites();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "site-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "site",
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/site", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_SITE,
  })),
});

useHead({
  title: t("site.pageTitle"),
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="search">
    <template #title>
      <HeaderSearch
        :title="$t('site.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiMapMarkerOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormSite
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="handleUpdate"
        @reset="handleReset"
      />
    </template>

    <DataTableSite
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
