<script setup lang="ts">
import { mdiBug } from "@mdi/js";

const currentView = ref(0);
const views = computed(() => ["table", "image"]);

const { t } = useI18n();
const route = useRoute();

const specimensStore = useSpecimens();
const { resetFilters, resetDataTable } = specimensStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = specimensStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(specimensStore);
setStateFromQueryParams(route);

const solrIndexUrl = computed(() => {
  if (views.value[currentView.value] === "image")
    return "/specimen_image";

  return "/specimen";
});

const {
  data,
  pending,
  refresh: refreshSamples,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>(solrIndexUrl.value, {
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
    { name: "specimen-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "specimen",
  );
}
</script>

<template>
  <Search>
    <template #title>
      <HeaderSearch
        :title="$t('specimen.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiBug"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormSpecimen
        :result-view="views[currentView]"
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
      <VTabs
        v-model="currentView"
        background-color="transparent"
        color="accent"
      >
        <VTab active-class="active-tab" class="montserrat text-capitalize">
          {{ $t(`common.table`) }}
        </VTab>
        <VTab
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.image`) }}
        </VTab>
      </VTabs>
      <VCard class="mt-0">
        <VTabsItems v-model="currentView">
          <VTabItem :value="0">
            <DataTableSpecimen
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
              @click:row="handleClickRow"
            />
          </VTabItem>
          <VTabItem :value="1">
            <SpecimenImageView
              :items="data?.response.docs ?? []"
              :count="data?.response.numFound ?? 0"
              :options="options"
              @update="handleDataTableUpdate"
            />
          </VTabItem>
        </VTabsItems>
      </VCard>
    </template>
  </Search>
</template>

<style scoped lang="scss">
.active-tab {
  // font-weight: bold;
  color: var(--v-accent-darken1) !important;
  &::before {
    opacity: 0.2 !important;
    background-color: var(--v-accent-base) !important;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>
