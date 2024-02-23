<script setup lang="ts">
import { mdiTestTube } from "@mdi/js";

const analysesStore = useAnalyses();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = analysesStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(analysesStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshLocalities,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/analysis", {
  query: computed(() => ({
    // fl: $getAPIFieldValues(HEADERS_LOCALITY),
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
  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  // TODO: reset filters
  setQueryParamsFromState();
  await refreshLocalities();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
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
  );
}

// export default defineComponent({
//   head() {
//     return {
//       title: this.$t('analysis.pageTitle') as string,
//       meta: [
//         {
//           property: 'og:title',
//           content: this.$t('analysis.pageTitle') as string,
//           hid: 'og:title',
//         },
//         {
//           property: 'og:url',
//           hid: 'og:url',
//           content: this.$route.path,
//         },
//       ],
//     }
//   },
// })
</script>

<template>
  <search>
    <template #title>
      <header-search
        :title="$t('analysis.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiTestTube"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-analysis
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
      <data-table-analysis
        class="border-t border-b"
        :show-search="false"
        :items="data?.response.docs ?? []"
        :count="data?.response.numFound ?? 0"
        :headers="headers"
        :options="options"
        dynamic-headers
        :is-loading="pending"
        stateful-headers
        @update="handleDataTableUpdate"
        @change:headers="handleHeadersChange"
        @reset:headers="handleHeadersReset(options)"
        @click:row="handleClickRow"
      />
    </template>
  </search>
</template>
