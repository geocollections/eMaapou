<script setup lang="ts">
import { mdiMapMarker } from "@mdi/js";
import type { LocationQueryRaw } from "vue-router";

const { $translate } = useNuxtApp();

const localitiesStore = useLocalities();
const { resetFilters, resetDataTable } = localitiesStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = localitiesStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(localitiesStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  status,
  refresh: refreshLocalities,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/locality", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: solrFilters.value,
      sort:
        solrSort.value
        ?? $translate({ et: "locality asc", en: "locality_en asc" }),
      fields: FIELDS_SOLR_LOCALITY,
    },
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}, { deep: true });

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() as LocationQueryRaw });
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

async function handleDataTableUpdate({
  options: newOptions,
}: {
  options: DataTableOptions;
}) {
  options.value = newOptions;

  setQueryParamsFromState();
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "locality-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "locality",
  );
}

const { t } = useI18n();

const { exportData } = useExportSolr("/locality", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_LOCALITY,
  })),
});

useHead({
  title: t("locality.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #title>
      <HeaderSearch
        :title="$t('locality.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiMapMarker"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormLocality
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="handleUpdate"
        @reset="handleReset"
      />
    </template>

    <DataTableLocality
      class="border-t border-t"
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
