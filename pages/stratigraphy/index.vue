<script setup lang="ts">
import { mdiLayersTriple } from "@mdi/js";

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
const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
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

async function handleDataTableUpdate({ options: newOptions }) {
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
    "stratigraphy",
  );
}

// export default defineComponent({
//   head() {
//     return {
//       title: this.$t("stratigraphy.pageTitle").toString(),
//       meta: [
//         {
//           property: "og:title",
//           hid: "og:title",
//           content: this.$t("stratigraphy.pageTitle").toString(),
//         },
//         {
//           property: "og:url",
//           hid: "og:url",
//           content: this.$route.path,
//         },
//       ],
//     };
//   },
// });
</script>

<template>
  <Search>
    <template #title>
      <HeaderSearch
        :title="$t('stratigraphy.pageTitle').toString()"
        :count="data?.response.numFound ?? 0"
        :icon="mdiLayersTriple"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormStratigraphy
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
      <DataTableStratigraphy
        class="border-t border-b"
        :show-search="false"
        :items="data?.response.docs ?? []"
        :count="data?.response.numFound ?? 0"
        :headers="headers"
        :options="options"
        :is-loading="pending"
        @update="handleDataTableUpdate"
        @change:headers="handleHeadersChange"
        @reset:headers="handleHeadersReset(options)"
        @click:row="handleClickRow"
      />
    </template>
  </Search>
</template>
