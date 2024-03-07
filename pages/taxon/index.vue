<script setup lang="ts">
import { mdiFamilyTree } from "@mdi/js";
import { HEADERS_TAXON } from "~/constants/headersNew";

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
const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  setQueryParamsFromState();
  await refreshTaxa();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshTaxa();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshTaxa();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

// head() {
//   return {
//     title: this.$t("taxon.pageTitle").toString(),
//     meta: [
//       {
//         property: "og:title",
//         hid: "og:title",
//         content: this.$t("taxon.pageTitle").toString(),
//       },
//       {
//         property: "og:url",
//         hid: "og:url",
//         content: this.$route.path,
//       },
//     ],
//   };
// },
</script>

<template>
  <Search>
    <template #title>
      <HeaderSearch
        :title="$t('taxon.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiFamilyTree"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormTaxon
        @update="
          handleUpdate();
          closeMobileSearch();
        "
        @reset="
          handleReset();
          closeMobileSearch();
        "
      />
    </template>

    <template #result>
      <DataTableTaxon
        class="border-t border-b"
        :show-search="false"
        :items="data?.response.docs ?? []"
        :count="data?.response.numFound ?? 0"
        :headers="headers"
        :options="options"
        dynamic-headers
        stateful-headers
        :is-loading="pending"
        @update="handleDataTableUpdate"
        @change:headers="handleHeadersChange"
        @reset:headers="handleHeadersReset(options)"
      />
    </template>
  </Search>
</template>
