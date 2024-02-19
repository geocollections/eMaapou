<template>
  <search>
    <template #title>
      <header-search
        :title="$t('site.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiMapMarkerOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-site
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
        <data-table-site
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
      </v-card>
    </template>
  </search>
</template>

<script setup lang="ts">
import { mdiMapMarkerOutline } from "@mdi/js";

const sitesStore = useSites();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = sitesStore;
const {
  solrSort,
  solrQuery,
  solrFilters,
  options,
  headers,
  searchPosition,
  resultsCount,
} = storeToRefs(sitesStore);

const route = useRoute();

setStateFromQueryParams(route);

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

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() as LocationQueryRaw });
}

async function handleUpdate() {
  setQueryParamsFromState();
  await refreshSites();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  // TODO: reset filters
  setQueryParamsFromState();
  await refreshSites();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
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
  );
}
// export default defineComponent({
//   head() {
//     return {
//       title: this.$t('site.pageTitle').toString(),
//       meta: [
//         {
//           property: 'og:title',
//           hid: 'og:title',
//           content: this.$t('site.pageTitle').toString(),
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
