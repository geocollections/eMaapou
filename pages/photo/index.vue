<template>
  <search>
    <template #title>
      <header-search
        :title="$t('photo.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiFileImageOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-photo
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
      <v-tabs
        v-model="currentView"
        background-color="transparent"
        color="accent"
      >
        <v-tab
          v-for="view in views"
          :key="view"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.${view}`) }}
        </v-tab>
      </v-tabs>
      <v-card
        flat
        :rounded="0"
        style="
          border-top: 1px solid lightgray;
          border-bottom: 1px solid lightgray;
        "
        class="mt-0"
      >
        <v-window v-model="currentView">
          <v-window-item :value="0">
            <data-table-photo
              flat
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
          </v-window-item>
          <v-window-item :value="1">
            <image-view
              :items="data?.response.docs ?? []"
              :count="data?.response.numFound ?? 0"
              :options="options"
              @update="handleDataTableUpdate"
            />
          </v-window-item>
          <v-window-item :value="2">
            <gallery-view
              :items="data?.response.docs ?? []"
              :count="data?.response.numFound ?? 0"
              :options="options"
              @update="handleDataTableUpdate"
            />
          </v-window-item>
        </v-window>
      </v-card>
    </template>
  </search>
</template>

<script setup lang="ts">
import { mdiFileImageOutline } from "@mdi/js";
import { HEADERS_PHOTO } from "~/constants";

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
      filter: [...solrFilters.value, 'specimen_image_attachment:"2"'],
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
  searchPosition.value =
    index + getOffset(options.value.page, options.value.itemsPerPage);
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
