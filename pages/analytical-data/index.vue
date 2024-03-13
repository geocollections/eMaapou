<script setup lang="ts">
import { mdiChartLine } from "@mdi/js";

const route = useRoute();

const analyticalDataStore = useAnalyticalData();
const { resetFilters, resetDataTable } = analyticalDataStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = analyticalDataStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(analyticalDataStore);
setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshLocalities,
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
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "analysis-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "analyticalData",
  );
}

// export default defineComponent({
//   name: "AnalyticalDataSearch",
//   components: {
//     Search,
//     SearchFormAnalyticalData,
//     DataTableAnalyticalData,
//     HeaderSearch,
//   },
//   setup() {
//     const { i18n } = useContext();
//     const accessor = useAccessor();
//     const services = useServices();
//     const getAPIFieldValues = useGetAPIFieldValues();
//     const { fetch } = useFetch(async () => {
//       const response = await services.sarvSolr.getResourceList(
//         "analytical_data",
//         {
//           options: accessor.search.analyticalData.options,
//           search: accessor.search.analyticalData.query,
//           fields: getAPIFieldValues(HEADERS_ANALYTICAL_DATA),
//           searchFilters: {
//             ...accessor.search.analyticalData.filters,
//             ...accessor.search.globalFilters,
//             ...accessor.search.analyticalData.parameterFilters.byId,
//           },
//         },
//       );
//       accessor.search.analyticalData.SET_MODULE_ITEMS({
//         items: response.items,
//       });
//       accessor.search.analyticalData.SET_MODULE_COUNT({
//         count: response.count,
//       });
//     });
//     const filters = computed(() => accessor.search.analyticalData.filters);
//     const globalFilters = computed(() => accessor.search.globalFilters);
//     const icons = computed(() => {
//       return {
//         mdiChartLine,
//       };
//     });
//     const { handleFormReset, handleFormUpdate, handleDataTableUpdate }
//       = useSearchQueryParams({
//         module: "analyticalData",
//         qParamKey: "analyticalDataQ",
//         filters,
//         globalFilters,
//         fetch,
//       });
//     useMeta(() => {
//       return {
//         title: i18n.t("analyticalData.pageTitle") as string,
//         meta: [
//           {
//             property: "og:title",
//             content: i18n.t("analyticalData.pageTitle") as string,
//             hid: "og:title",
//           },
//         ],
//       };
//     });
//     return {
//       handleFormReset,
//       handleFormUpdate,
//       handleDataTableUpdate,
//       icons,
//     };
//   },
//   head: {},
// });
</script>

<template>
  <Search>
    <template #title>
      <HeaderSearch
        :title="$t('analyticalData.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiChartLine"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormAnalyticalData
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
      <DataTableAnalyticalData
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
