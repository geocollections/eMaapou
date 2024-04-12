<script setup lang="ts">
import { mdiFileImageOutline } from "@mdi/js";

const views = computed(() => ["table", "image", "gallery"]);

const photosStore = usePhotos();
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
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
watch(() => route.query, () => {
  setStateFromQueryParams(route);
  refreshPhotos();
}, {deep: true});

const {
  data,
  pending,
  refresh: refreshPhotos,
} = await useSolrFetch<{
  response: { numFound: number; docs: any[] };
}>("/attachment", {
  query: computed(() => ({
    // fl: $getAPIFieldValues(HEADERS_LOCALITY),
    json: {
      query: solrQuery.value,
      limit: options.value.itemsPerPage,
      offset: getOffset(options.value.page, options.value.itemsPerPage),
      filter: [...solrFilters.value, "specimen_image_attachment:\"2\""],
      sort: solrSort.value ?? "id_sl desc",
    },
  })),
  watch: false,
});

const router = useRouter();
function setQueryParamsFromState() {
  router.push({ query: { ...getQueryParams(), view: views.value[currentView.value] } });
}

watch(currentView, () => {
  setQueryParamsFromState();
});

async function handleUpdate() {
  options.value.page = 1;
  setQueryParamsFromState();
  await refreshPhotos();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleReset() {
  // TODO: reset filters
  setQueryParamsFromState();
  await refreshPhotos();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

async function handleDataTableUpdate({ options: newOptions }) {
  options.value = newOptions;
  setQueryParamsFromState();
  await refreshPhotos();
  resultsCount.value = data.value?.response.numFound ?? 0;
}

function handleClickRow(index: number) {
  searchPosition.value
    = index + getOffset(options.value.page, options.value.itemsPerPage);
}

const { t } = useI18n();

useHead({
  title: t("photo.pageTitle"),
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="search">
    <template #title>
      <HeaderSearch
        :title="$t('photo.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiFileImageOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <SearchFormPhoto
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

    <ClientOnly>
      <VTabs
        v-model="currentView"
        bg-color="white"
        color="accent"
        density="compact"
      >
        <!-- <VTab -->
        <!--   v-for="view in views" -->
        <!--   :key="view" -->
        <!--   selected-class="active-tab" -->
        <!--   class="montserrat text-capitalize" -->
        <!-- > -->
        <!--   {{ $t(`common.${view}`) }} -->
        <!-- </VTab> -->
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
        <VTab
          :value="2"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.gallery`) }}
        </VTab>
      </VTabs>
      <VWindow v-model="currentView" :touch="false">
        <VWindowItem :value="0">
          <DataTablePhoto
            class="border-t border-b"
            flat
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
          <ImageView
            class="border-t border-b"
            :items="data?.response.docs ?? []"
            :count="data?.response.numFound ?? 0"
            :options="options"
            @update="handleDataTableUpdate"
          />
        </VWindowItem>
        <VWindowItem :value="2">
          <GalleryView
            class="border-t border-b"
            :items="data?.response.docs ?? []"
            :count="data?.response.numFound ?? 0"
            :options="options"
            @update="handleDataTableUpdate"
          />
        </VWindowItem>
      </VWindow>
    </ClientOnly>
  </NuxtLayout>
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
