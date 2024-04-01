<script setup lang="ts">
import { mdiImageFilterHdr } from "@mdi/js";

const { t } = useI18n();
const route = useRoute();

useSeoMeta({
  title: t("sample.pageTitle"),
});

// export default defineComponent({
//   head() {
//     return {
//       title: this.$t('sample.pageTitle') as string,
//       meta: [
//         {
//           property: 'og:title',
//           hid: 'og:title',
//           content: this.$t('sample.pageTitle') as string,
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
  pending,
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
const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshSamples();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshSamples();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshSamples();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "sample-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "sample",
  );
}
</script>

<template>
  <Search>
    <template #title>
      <HeaderSearch
        :title="$t('sample.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiImageFilterHdr"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormSample
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
      <DataTableSample
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
