<script setup lang="ts">
import { mdiImageFilterHdr } from "@mdi/js";

const { t } = useI18n();
const route = useRoute();

useSeoMeta({
  title: t("sample.pageTitle"),
});

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

const samplesStore = useSamples();
const { resetFilters, resetDataTable } = samplesStore;
const {
  handleHeadersReset,
  handleHeadersChange,
  setStateFromQueryParams,
  getQueryParams,
} = samplesStore;
const { solrSort, solrQuery, solrFilters, options, headers, resultsCount }
  = storeToRefs(samplesStore);

setStateFromQueryParams(route);
watch(() => route.query, () => {
  setStateFromQueryParams(route);
  refreshSamples();
}, { deep: true });

const {
  data,
  pending,
  refresh: refreshSamples,
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
  router.push({ query: getQueryParams() });
}

async function handleUpdate() {
  options.value.page = 1;
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
    { name: "sample-id", params: { id } },
    index + getOffset(options.value.page, options.value.itemsPerPage),
    "sample",
  );
}

const { exportData } = useExportSolr("/sample", {
  totalRows: computed(() => data.value?.response.numFound ?? 0),
  query: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    limit: options.value.itemsPerPage,
    offset: getOffset(options.value.page, options.value.itemsPerPage),
    fields: EXPORT_SOLR_SAMPLE,
  })),
});

definePageMeta({
  layout: false,
});

const { $geoloogiaFetch } = useNuxtApp();

async function sampleImageFunction({ sample, page, rows }) {
  const res = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
    query: {
      sample,
      attachment__attachment_format__value__istartswith: "image",
      nest: 2,
      limit: rows,
      offset: page * rows,
    },
  });
  // .then((res) => {
  //
  //   return res.results.map((image: any) => ({
  //     id: image.attachment.id,
  //     filename: image.attachment.filename,
  //     info: {
  //       author: image.attachment.author?.agent,
  //       date: image.attachment.date_created,
  //       dateText: image.attachment.date_created_free,
  //     },
  //   }));
  // });

  const newImages = res.results.map((image: any) => ({
    id: image.attachment.id,
    filename: image.attachment.filename,
    info: {
      author: image.attachment.author?.agent,
      date: image.attachment.date_created,
      dateText: image.attachment.date_created_free,
    },
  }));
  return { images: newImages, total: res.count };
}
</script>

<template>
  <NuxtLayout name="search">
    <template #form="{ closeMobileSearch }">
      <SearchFormSample
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
    <template #title>
      <HeaderSearch
        :title="$t('sample.pageTitle')"
        :count="data?.response.numFound ?? 0"
        :icon="mdiImageFilterHdr"
      />
    </template>
    <DataTableSample
      class="border-t border-b"
      :show-search="false"
      :items="data?.response.docs ?? []"
      :count="data?.response.numFound ?? 0"
      :headers="headers"
      :options="options"
      :is-loading="pending"
      :export-func="exportData"
      :image-func="sampleImageFunction"
      @update="handleDataTableUpdate"
      @change:headers="handleHeadersChange"
      @reset:headers="handleHeadersReset(options)"
      @click:row="handleClickRow"
    />
  </NuxtLayout>
</template>
