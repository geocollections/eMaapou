<script setup lang="ts">
import { mdiFileImageOutline } from "@mdi/js";
import { FIELDS_SOLR_PHOTO } from "~/constants";

const views = computed(() => ["table", "image"]);

const photosStore = usePhotos();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
  resetFilters,
  resetDataTable,
} = photosStore;
const {
  solrSort,
  solrQuery,
  solrFilters,
  options,
  headers,
  searchPosition,
  resultsCount,
  currentView,
} = storeToRefs(photosStore);

const route = useRoute();

setStateFromQueryParams(route);

const {
  data,
  status,
  refresh: refreshPhotos,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/attachment", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: [...solrFilters.value, "imageset_id:[* TO *]"],
      sort: solrSort.value ?? "id_l desc",
      fields: FIELDS_SOLR_PHOTO,
    },
  })),
  watch: false,
});

watch(() => route.fullPath, async (toPath, fromPath) => {
  if (toPath === fromPath)
    return;

  setStateFromQueryParams(route);
  await refreshPhotos();
  resultsCount.value = data.value?.response.numFound ?? 0;
}, { deep: true });

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: { ...getQueryParams() } });
}

watch(currentView, () => {
  setQueryParamsFromState();
});

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
}

function handleClickRow(index: number) {
  searchPosition.value
    = index + getOffset(options.value.page, options.value.itemsPerPage);
}

const { t } = useI18n();

const { exportData } = useExportSolr("/attachment", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: [...solrFilters.value, "imageset_id:[* TO *]"],
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_PHOTO,
  })),
});

useHead({
  title: t("photo.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #title>
      <HeaderSearch
        :title="$t('photo.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiFileImageOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormPhoto
        @submit="
          handleUpdate();
          closeMobileSearch();
        "
        @update="
          handleUpdate();
        "
        @reset="
          handleReset();
        "
      />
    </template>

    <ClientOnly>
      <VTabs
        v-model="currentView"
        bg-color="white"
        color="accent"
        density="compact"
        @update:model-value="setQueryParamsFromState"
      >
        <VTab
          value="table"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.table`) }}
        </VTab>
        <VTab
          value="image"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.image`) }}
        </VTab>
      </VTabs>
      <VWindow v-model="currentView" :touch="false">
        <VWindowItem value="table">
          <DataTablePhoto
            class="border-t border-b"
            flat
            :show-search="false"
            :items="data?.response.docs ?? []"
            :count="data?.response.numFound ?? 0"
            :headers="headers"
            :options="options"
            :is-loading="status === 'pending'"
            :export-func="exportData"
            @update="handleDataTableUpdate"
            @change:headers="handleHeadersChange"
            @reset:headers="handleHeadersReset(options)"
            @click:row="handleClickRow"
          />
        </VWindowItem>
        <VWindowItem value="image">
          <ImageView
            class="border-t border-b"
            :items="data?.response.docs ?? []"
            :count="data?.response.numFound ?? 0"
            :options="options"
            @update="handleDataTableUpdate"
          />
        </VWindowItem>
      </VWindow>
    </ClientOnly>
  </TemplateSearch>
</template>

<style scoped lang="scss">
.active-tab {
  // font-weight: bold;
  color: var(--v-theme-accent-darken-1) !important;

  &::before {
    opacity: 0.2 !important;
    background-color: var(--v-theme-accent) !important;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>
