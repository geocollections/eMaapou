<script setup lang="ts">
definePageMeta({ layout: "detail" });

const route = useRoute();
const localePath = useLocalePath();
const { t, locale } = useI18n();
const { $solrFetch, $translate, $apiFetch } = useNuxtApp();
const specimensStore = useSpecimens();
const { getQueryParams } = specimensStore;

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
    name?: string;
    forename?: string;
    surname?: string;
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

const { data } = await useAsyncData(
  () => `specimen-${route.params.id}`,
  async () => {
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
          "collector.forename",
          "collector.surname",
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
          fatal: true,
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
        rows: 20,
        fields: "id,filename,image_number,agent,author_free,date_created,date_created_free",
      },
    });

    return {
      specimen,
      specimenAlt,
      images: imagesRes.response.docs,
    };
  },
  {
    default: () => ({
      specimen: null,
      specimenAlt: null,
      images: [],
    }),
  },
);

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

const img = useImage();

useHead(() => ({
  title: `${title.value} | ${t("specimen.pageTitle")}`,
}));

useSeoMeta({
  ogImage: computed(() => data.value.images[0]?.filename
    ? img(
        `${data.value.images[0]?.filename}`,
        { size: "medium" },
        {
          provider: "geocollections",
        },
      )
    : undefined),
});
</script>

<template>
  <TemplateDetail :show-similar="false" :top-padding="0">
    <template #title>
      <div class="border-b border-portal-border bg-portal-background">
        <div class="mx-auto w-full max-w-[1440px] px-4 pt-5 pb-8 sm:px-6 lg:px-10">
          <nav class="mb-5 flex flex-wrap items-center gap-2 text-[13px] text-portal-muted" :aria-label="locale === 'en' ? 'Breadcrumb' : 'Asukoht saidil'">
            <ULink :to="localePath('/')" class="text-portal-link no-underline hover:underline">
              {{ locale === "en" ? "Home" : "Avaleht" }}
            </ULink>
            <span aria-hidden="true">/</span>
            <ULink :to="localePath({ path: '/specimen', query: getQueryParams() })" class="text-portal-link no-underline hover:underline">
              {{ $t("common.specimen") }}
            </ULink>
            <span aria-hidden="true">/</span>
            <span aria-current="page" class="text-portal-text">{{ $t("common.specimen") }}&nbsp;{{ title }}</span>
          </nav>
          <div class="flex flex-wrap items-end justify-between gap-6 border-l-[3px] border-portal-primary pl-5 sm:pl-7">
            <div class="min-w-0">
              <h1 class="m-0 text-[34px] leading-[1.1] font-semibold tracking-[-0.035em] text-portal-heading sm:text-[44px]">
                <span class="align-baseline tracking-normal text-portal-link">{{ $t("common.specimen") }}</span>&nbsp;<span>{{ title }}</span>
              </h1>
              <div v-if="(isRock && titleAlt) || (isTaxon && titleAlt)" class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-portal-muted">
                <span v-if="isRock && titleAlt" class="font-medium text-portal-heading">{{ titleAlt }}</span>
                <span v-if="isTaxon && titleAlt" class="font-medium text-portal-heading">{{ data.specimenAlt?.taxon }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <NuxtPage
      :key="String(route.params.id)"
      v-bind="{
        specimen: data.specimen,
        specimenAlt: data.specimenAlt,
        images: data.images,
      }"
    />
  </TemplateDetail>
</template>
