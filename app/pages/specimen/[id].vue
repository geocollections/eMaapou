<script setup lang="ts">
import { mdiBug, mdiContentCopy } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { $geoloogiaFetch, $solrFetch, $translate, $apiFetch } = useNuxtApp();

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const tabs = {
  general: {
    type: "static",
    routeName: "specimen-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  identification: {
    type: "dynamic",
    routeName: "specimen-id-identifications",
    title: "specimen.identifications",
    count: async (_ctx) => {
      return await $geoloogiaFetch<GeoloogiaListResponse>(
        "/specimen_identification/",
        {
          query: {
            specimen: route.params.id,
            limit: 0,
          },
        },
      ).then(res => res.count);
    },
    props: {},
  } satisfies Tab,
  identificationGeology: {
    type: "dynamic",
    routeName: "specimen-id-rock-identifications",
    title: "specimen.rockIdentifications",
    count: async (_ctx) => {
      return await $geoloogiaFetch<GeoloogiaListResponse>(
        "/specimen_identification_geology/",
        {
          query: {
            specimen: route.params.id,
            limit: 0,
          },
        },
      ).then(res => res.count);
    },
    props: {},
  } satisfies Tab,
  reference: {
    type: "dynamic",
    routeName: "specimen-id-references",
    title: "specimen.references",
    count: async (_ctx) => {
      return await $geoloogiaFetch<GeoloogiaListResponse>(
        "/specimen_reference/",
        {
          query: {
            specimen: route.params.id,
            limit: 0,
          },
        },
      ).then(res => res.count);
    },
    props: {},
  } satisfies Tab,
};

const specimensStore = useSpecimens();
const { getQueryParams } = specimensStore;
const { solrFilters, solrQuery, solrSort, currentView } = storeToRefs(specimensStore);

const {
  data: specimensRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/specimen", {
  routeName: "specimen-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});

const similarSpecimens = computed(() => specimensRes.value?.response.docs ?? []);

export interface Specimen {
  id: number;
  number: Nullable<string>;
  date_collected: Nullable<string>;
  date_collected_text: Nullable<string>;
  old_number: Nullable<string>;
  part: Nullable<string>;
  depth: Nullable<number>;
  remarks: Nullable<string>;
  collector: Nullable<{
    name: string;
  }>;
  type: Nullable<{
    value: string;
    value_en: string;
  }>;
  classification: Nullable<{
    name: string;
    name_en: string;
  }>;
  locality: Nullable<{
    id: number;
    name: string;
    name_en: string;
    longitude: Nullable<number>;
    latitude: Nullable<number>;
    country: Nullable<{
      name: string;
      name_en: string;
      iso_3166_1_alpha_2: string;
    }>;
  }>;
  stratigraphy: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  stratigraphy_text: Nullable<string>;
  lithostratigraphy: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  database: Nullable<{
    id: number;
    acronym: string;
    name: string;
    name_en: string;
    url: string;
  }>;
  sample: Nullable<{
    id: number;
    number: string;
  }>;
  parent: Nullable<{
    id: number;
    number: string;
  }>;
  collection: Nullable<{
    id: number;
    number: string;
    name: string;
    name_en: string;
  }>;
  original_status: Nullable<{
    id: number;
    value: string;
    value_en: string;
  }>;
  fossil: Nullable<{
    id: number;
    value: string;
    value_en: string;
  }>;
}

const { data } = await useAsyncData("specimen", async () => {
  const specimen = await $apiFetch<Specimen>(`/specimens/${route.params.id}/`, {
    query: {
      expand: "collector,classification,locality,collection,sample,parent,database,stratigraphy,lithostratigraphy,original_status,fossil,type",
      fields: [
        "id",
        "number",
        "date_collected",
        "date_collected_text",
        "old_number",
        "part",
        "depth",
        "remarks",
        "collector.name",
        "type.value",
        "type.value_en",
        "classification.name",
        "classification.name_en",
        "locality.id",
        "locality.name",
        "locality.name_en",
        "locality.longitude",
        "locality.latitude",
        "locality.country.name",
        "locality.country.name_en",
        "locality.country.iso_3166_1_alpha_2",
        "stratigraphy.id",
        "stratigraphy.name",
        "stratigraphy.name_en",
        "stratigraphy_text",
        "lithostratigraphy.id",
        "lithostratigraphy.name",
        "lithostratigraphy.name_en",
        "database.id",
        "database.acronym",
        "database.name",
        "database.name_en",
        "database.url",
        "sample.id",
        "sample.number",
        "parent.id",
        "parent.number",
        "collection.id",
        "collection.number",
        "collection.name",
        "collection.name_en",
        "original_status.id",
        "original_status.value",
        "original_status.value_en",
        "fossil.id",
        "fossil.value",
        "fossil.value_en",
      ].join(","),
    },
    onResponseError: (_error) => {
      showError({
        statusCode: 404,
        message: t("error.notFound"),
      });
    },
  });

  const specimenNameRes = await $solrFetch<SolrResponse>(
    `/specimen`,
    {
      query: {
        q: `id:${route.params.id}`,
      },
    },
  );
  const specimenAlt = specimenNameRes?.response.docs[0];

  const imagesRes = await $solrFetch<SolrResponse>("/attachment", {
    query: {
      q: "*",
      fq: `specimen_id:${route.params.id} AND specimen_image_attachment:1`,
      sort: "date_created_dt desc,date_created_free desc,stars desc,id desc",
      rows: 1,
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { specimen } },
  });

  return {
    specimen,
    specimenAlt,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "identification",
      "identificationGeology",
      "reference",
    ]),
    images: imagesRes.response.docs,
  };
}, {
  default: () => ({
    specimen: null,
    specimenAlt: null,
    tabs: [] as HydratedTab[],
    images: [],
  }),
});

const isRock = computed(() => !!data.value.specimenAlt?.rock);
const isTaxon = computed(() => !!data.value.specimenAlt?.taxon);
const title = computed(
  () =>
        `${data.value.specimen?.database?.acronym} ${data.value.specimen?.number}`,
);
const titleAlt = computed(() => {
  if (data.value.specimenAlt?.rock) {
    const defaultName = $translate({
      et: data.value.specimenAlt.rock,
      en: data.value.specimenAlt.rock_en,
    });
    return data.value.specimenAlt.rock_txt
      && data.value.specimenAlt.rock_txt.length > 0
      ? data.value.specimenAlt.rock_txt[0]
      : defaultName;
  }
  if (data.value.specimenAlt?.taxon)
    return data.value.specimenAlt.taxon;

  return null;
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

redirectInvalidTab({
  redirectRoute: localePath({
    name: "specimen-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

const img = useImage();

useHead({
  title: `${title.value} | ${t("specimen.pageTitle")}`,
});

useSeoMeta({
  ogImage: data.value.images[0]?.filename
    ? img(
      `${data.value.images[0]?.filename}`,
      { size: "medium" },
      {
        provider: "geocollections",
      },
    )
    : null,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetailNew class="mb-0">
        <template #prepend>
          <CategoryChip
            :title="$t('common.specimen')"
            :to="localePath({ path: '/specimen', query: getQueryParams() })"
            :icon="mdiBug"
          />
        </template>
        <div>
          <div>
            {{ title }}
          </div>
          <div>
            <a
              v-if="isRock && titleAlt"
              target="_blank"
              style="text-decoration: none"
              class="text-grey-darken-2"
              :href="`https://kivid.info/${data.specimenAlt?.rock_id}`"
            >{{ titleAlt }}</a>
            <span v-if="isRock && isTaxon && titleAlt" vertical>
              |
            </span>
            <a
              v-if="isTaxon && titleAlt"
              target="_blank"
              class="text-grey-darken-2"
              style="text-decoration: none"
              :href="`https://fossiilid.info/${data.specimenAlt?.taxon_id}`"
            >{{ data.specimenAlt?.taxon }}</a>
          </div>
        </div>
        <template #sub>
          <div v-if="data.specimen?.fossil?.id === 9">
            <VIcon color="warning-lighten-2" right>
              {{ mdiContentCopy }}
            </VIcon>
            {{
              $translate({
                et: data.specimen?.fossil.value,
                en: data.specimen?.fossil.value_en,
              })
            }}
          </div>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <NuxtPage v-bind="activeTabProps" />
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarSpecimens"
        :total-results="specimensRes?.response.numFound ?? 0"
        :search-route="localePath({ path: '/specimen', query: { ...getQueryParams(), view: currentView } })"
        :get-result-route="(item) => localePath({ name: 'specimen-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: specimen }">
          <div class="font-weight-medium">
            {{ specimen.specimen_full_name }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
  </TemplateDetail>
</template>
