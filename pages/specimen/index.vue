<script setup lang="ts">
import { mdiBug } from "@mdi/js";

const route = useRoute();

const specimensStore = useSpecimens();
const { resetFilters, resetDataTable } = specimensStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = specimensStore;
const { solrSort, solrQuery, solrFilters, options, headers, currentView, imageOptions }
  = storeToRefs(specimensStore);

setStateFromQueryParams(route);

const {
  data,
  pending,
  refresh: refreshSpecimens,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen", {
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

const {
  data: imageData,
  refresh: refreshSpecimenImages,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/specimen_image", {
  query: computed(() => ({
    json: {
      query: solrQuery.value,
      limit: imageOptions.value.itemsPerPage,
      offset: getOffset(imageOptions.value.page, imageOptions.value.itemsPerPage),
      filter: solrFilters.value,
    },
  })),
  watch: false,
});

watch(currentView, () => {
  setQueryParamsFromState();
});

watch(() => route.query, () => {
  setStateFromQueryParams(route);
  refreshSpecimens();
  refreshSpecimenImages();
}, { deep: true });

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: { ...getQueryParams() } });
}

async function refreshData() {
  await refreshSpecimens();
  await refreshSpecimenImages();
}

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshData();
}

async function handleReset() {
  resetFilters();
  resetDataTable();
  setQueryParamsFromState();
  await refreshData();
}

async function handleDataTableUpdate({ options: newOptions }: { options: DataTableOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshData();
}

async function handleImageUpdate({ options: newOptions }: { options: DataTableOptions }) {
  imageOptions.value = newOptions;
  setQueryParamsFromState();
  await refreshData();
}

const { setSearchPosition } = useSearchPosition();
function handleClickRow({ index, id }: { index: number; id: number }) {
  if (currentView.value === "image") {
    setSearchPosition(
      { name: "specimen-id", params: { id } },
      index + getOffset(imageOptions.value.page, imageOptions.value.itemsPerPage),
      "specimenImage",
    );
  }
  else {
    setSearchPosition(
      { name: "specimen-id", params: { id } },
      index + getOffset(options.value.page, options.value.itemsPerPage),
      "specimen",
    );
  }
}
const { t } = useI18n();

const { exportData } = useExportSolr("/specimen", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_SPECIMEN,
  })),
});

const specimenImageFunction = useSpecimenImageFunction();

useHead({
  title: t("specimen.pageTitle"),
});
</script>

<template>
  <TemplateSearch>
    <template #title>
      <HeaderSearch
        :title="$t('specimen.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiBug"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormSpecimen
        :result-view="currentView"
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
          <VChip class="ml-2" size="small">
            {{ imageData?.response.numFound ?? 0 }}
          </VChip>
        </VTab>
      </VTabs>
      <VWindow v-model="currentView" :touch="false">
        <VWindowItem value="table">
          <DataTableSpecimen
            class="border-t border-b"
            :show-search="false"
            :items="data?.response.docs ?? []"
            :count="data?.response.numFound ?? 0"
            :headers="headers"
            :options="options"
            :is-loading="pending"
            :export-func="exportData"
            :image-func="specimenImageFunction"
            @update="handleDataTableUpdate"
            @change:headers="handleHeadersChange"
            @reset:headers="handleHeadersReset(options)"
            @click:row="handleClickRow"
          />
        </VWindowItem>
        <VWindowItem value="image">
          <SpecimenImageView
            class="border-t border-b"
            :items="imageData?.response.docs ?? []"
            :count="imageData?.response.numFound ?? 0"
            :options="imageOptions"
            @update="handleImageUpdate"
          />
        </VWindowItem>
      </VWindow>
    </ClientOnly>
  </TemplateSearch>
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
