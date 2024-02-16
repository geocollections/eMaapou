<template>
  <search>
    <template #title>
      <header-search
        :title="$t('sample.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiImageFilterHdr"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-sample
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
      <v-card
        flat
        :rounded="0"
        style="
          border-top: 1px solid lightgray;
          border-bottom: 1px solid lightgray;
        "
      >
        <data-table-sample
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
          @click:row="handleClickRow"
        />
      </v-card>
    </template>
  </search>
</template>

<script setup lang="ts">
import { mdiImageFilterHdr } from "@mdi/js";

const route = useRoute();

const { setSearchPosition } = useSearchPosition();
const samplesStore = useSamples();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = samplesStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount } =
  storeToRefs(samplesStore);
setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshLocalities,
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

function handleClickRow({ index, id }: { index: number; id: number }) {
  setSearchPosition(
    { name: "sample-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
  );
}

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
</script>
