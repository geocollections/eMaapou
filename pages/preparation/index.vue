<script setup lang="ts">
import { mdiEyedropper } from "@mdi/js";

const preparationsStore = usePreparations();
const { resetFilters, resetDataTable } = preparationsStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = preparationsStore;
const {
  solrSort,
  solrQuery,
  solrFilters,
  options,
  headers,
  resultsCount,
} = storeToRefs(preparationsStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshLocalities,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/preparation", {
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
    { name: "preparation-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "preparation",
  );
}

const { t } = useI18n();

useHead({
  title: t("preparation.pageTitle"),
});
</script>

<template>
  <Search>
    <template #title>
      <HeaderSearch
        :title="$t('preparation.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiEyedropper"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormPreparation
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
      <DataTablePreparation
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
