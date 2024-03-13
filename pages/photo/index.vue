<script setup lang="ts">
import { mdiFileImageOutline } from "@mdi/js";

const currentView = ref(0);
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
} = storeToRefs(photosStore);

const route = useRoute();

setStateFromQueryParams(route);

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
  router.push({ query: getQueryParams() as LocationQueryRaw });
}

async function handleUpdate() {
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
// useMeta(() => ({
//   title: i18n.t("photo.pageTitle").toString(),
//   meta: [
//     {
//       property: "og:title",
//       hid: "og:title",
//       content: i18n.t("photo.pageTitle").toString(),
//     },
//     {
//       property: "og:url",
//       hid: "og:url",
//       content: route.value.path,
//     },
//   ],
// }));
</script>

<template>
  <Search>
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

    <template #result>
      <VTabs
        v-model="currentView"
        bg-color="transparent"
        color="accent"
      >
        <VTab
          v-for="view in views"
          :key="view"
          selected-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.${view}`) }}
        </VTab>
      </VTabs>
      <VCard
        flat
        :rounded="0"
        style="
          border-top: 1px solid lightgray;
          border-bottom: 1px solid lightgray;
        "
        class="mt-0"
      >
        <VWindow v-model="currentView">
          <VWindowItem :value="0">
            <DataTablePhoto
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
              :items="data?.response.docs ?? []"
              :count="data?.response.numFound ?? 0"
              :options="options"
              @update="handleDataTableUpdate"
            />
          </VWindowItem>
          <VWindowItem :value="2">
            <GalleryView
              :items="data?.response.docs ?? []"
              :count="data?.response.numFound ?? 0"
              :options="options"
              @update="handleDataTableUpdate"
            />
          </VWindowItem>
        </VWindow>
      </VCard>
    </template>
  </Search>
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
