<script setup lang="ts">
import { mdiBug } from "@mdi/js";

const route = useRoute();

const views = computed(() => ["table", "image"]);

const { t } = useI18n();

const currentView = ref(0);
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
  refresh: refreshSpecimens,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>(solrIndexUrl, {
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

watch(currentView, () => {
  refreshSpecimens();
});

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  setQueryParamsFromState();
  await refreshSpecimens();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshSpecimens();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshSpecimens();
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
        <VTab
          :value="0"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.table`) }}
        </VTab>
        <VTab
          :value="1"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.image`) }}
        </VTab>
      </VTabs>
      <VWindow v-model="currentView">
        <VWindowItem :value="0">
          <DataTableSpecimen
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
        </VWindowItem>
        <VWindowItem :value="1">
          <SpecimenImageView
            class="border-t border-b"
            :items="data?.response.docs ?? []"
            :count="data?.response.numFound ?? 0"
            :options="options"
            @update="handleDataTableUpdate"
          />
        </VWindowItem>
      </VWindow>
    </template>
  </Search>
</template>

<style scoped lang="scss">
.active-tab {
  // font-weight: bold;
  color: rgb(var(--v-theme-accent-darken-1)) !important;
  &::before {
    opacity: 0.2 !important;
    background-color: rgb(var(--v-theme-accent)) !important;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>
