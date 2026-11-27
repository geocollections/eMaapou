<script setup lang="ts">
import type { Specimen, SpecimenAttachmentLink, SpecimenFile, SpecimenIndexEntry, SpecimenPhoto } from "~/types/specimen";
import { mdiSquareEditOutline } from "@mdi/js";
import { fetchCataloguePages } from "~/utils/fetchCataloguePages";

definePageMeta({ layout: "detail" });

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { $solrFetch, $translate, $apiFetch, $openEdit } = useNuxtApp();
const specimensStore = useSpecimens();
const { getQueryParams } = specimensStore;

type LocalityFields = Pick<Specimen, "locality" | "locality_text">;

const emptyLocality: LocalityFields = { locality: null, locality_text: null };
const recordFields = [
  "id",
  "number",
  "old_number",
  "number_field",
  "part",
  "number_pieces",
  "depth",
  "depth_interval",
  "sample_number",
  "remarks_collecting",
  "stratigraphy_text",
  "collector_text",
  "date_collected",
  "date_collected_text",
  "remarks",
  "tags",
  "locality_is_private",
  "date_added",
  "date_changed",
  "collector.name",
  "collector.forename",
  "collector.surname",
  "type.value",
  "type.value_en",
  "subtype.value",
  "subtype.value_en",
  "kind.value",
  "kind.value_en",
  "classification.name",
  "classification.name_en",
  "stratigraphy.id",
  "stratigraphy.name",
  "stratigraphy.name_en",
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
  "original_status.value",
  "original_status.value_en",
  "fossil.value",
  "fossil.value_en",
  "presence.value",
  "presence.value_en",
  "status.value",
  "status.value_en",
  "accession.number",
  "deaccession.number",
].join(",");
const attachmentFields = [
  "id",
  "filename",
  "original_filename",
  "title",
  "title_en",
  "description",
  "description_en",
  "image_number",
  "image_width",
  "image_height",
  "image_scalebar",
  "date_created",
  "remarks",
  "size_mb",
  "specimen_image_attachment",
];

const { data } = await useAsyncData(
  () => `specimen-${route.params.id}`,
  async () => {
    const id = route.params.id;
    const path = `/specimens/${id}/`;
    const record = await $apiFetch<Omit<Specimen, keyof LocalityFields>>(path, {
      query: {
        expand: "collector,classification,collection,sample,parent,database,stratigraphy,lithostratigraphy,original_status,fossil,type,subtype,kind,presence,status,accession,deaccession",
        fields: recordFields,
      },
      onResponseError: () => {
        showError({
          statusCode: 404,
          message: t("error.notFound"),
          fatal: true,
        });
      },
    });

    const [geography, indexedRecord, indexedFiles, attachmentLinks] = await Promise.allSettled([
      record.locality_is_private
        ? Promise.resolve(emptyLocality)
        : $apiFetch<LocalityFields>(path, {
            query: {
              expand: "locality,locality.country",
              fields: "locality_text,locality.id,locality.name,locality.name_en,locality.latitude,locality.longitude,locality.country.name,locality.country.name_en,locality.country.iso_3166_1_alpha_2",
            },
          }),
      $solrFetch<SolrResponse<SpecimenIndexEntry>>("/specimen", {
        query: {
          q: `id:${id}`,
          rows: 1,
          fl: "specimen_full_name,taxon,taxon_full,taxon_id,fossilgroup,rock,rock_en,rock_txt,rock_id",
        },
      }),
      fetchCataloguePages(async (start) => {
        const { response } = await $solrFetch<SolrResponse<SpecimenFile>>("/attachment", {
          query: {
            q: `specimen_id:${id}`,
            fq: ["-is_private:1", "-private:1"],
            sort: "date_created_dt desc,date_created_free desc,stars desc,id_l desc",
            rows: 100,
            start,
            fl: [
              ...attachmentFields,
              "agent",
              "author_free",
              "date_created_free",
              "device_txt",
              "format_value",
            ].join(","),
          },
        });
        return { results: response.docs, count: response.numFound };
      }),
      fetchCataloguePages(offset => $apiFetch<GeoloogiaListResponse<SpecimenAttachmentLink>>(`${path}attachments/`, {
        query: {
          offset,
          limit: 100,
          expand: "attachment,attachment.author,attachment.licence,attachment.mime_type",
          fields: [
            "remarks",
            ...[
              ...attachmentFields,
              "author.name",
              "author_text",
              "date_created_text",
              "device_text",
              "licence.name",
              "mime_type.content_type",
            ].map(field => `attachment.${field}`),
          ].join(","),
        },
      })),
    ]);

    const files = new Map<number, SpecimenFile>();
    if (indexedFiles.status === "fulfilled") {
      for (const file of indexedFiles.value)
        files.set(Number(file.id), file);
    }
    if (attachmentLinks.status === "fulfilled") {
      for (const { attachment, remarks } of attachmentLinks.value) {
        if (!attachment)
          continue;
        const previous = files.get(Number(attachment.id));
        files.set(Number(attachment.id), {
          ...previous,
          ...attachment,
          agent: attachment.author?.name || previous?.agent,
          author_free: attachment.author_text || previous?.author_free,
          date_created_free: attachment.date_created_text || previous?.date_created_free,
          device_txt: attachment.device_text || previous?.device_txt,
          licence: attachment.licence?.name || previous?.licence,
          format_value: attachment.mime_type?.content_type || previous?.format_value,
          remarks: [
            ...new Set([attachment.remarks || previous?.remarks, remarks].filter(Boolean)),
          ].join("\n"),
        });
      }
    }

    const images: SpecimenPhoto[] = [];
    const otherFiles: SpecimenFile[] = [];
    for (const file of files.values()) {
      if (file.specimen_image_attachment === 1 && file.filename)
        images.push({ ...file, filename: file.filename });
      else
        otherFiles.push(file);
    }

    return {
      specimen: {
        ...record,
        ...(geography.status === "fulfilled"
          ? geography.value
          : emptyLocality),
      },
      specimenAlt: indexedRecord.status === "fulfilled"
        ? indexedRecord.value.response.docs[0] ?? null
        : null,
      images,
      otherFiles,
      hasSupplementaryError: [
        geography,
        indexedRecord,
        indexedFiles,
        attachmentLinks,
      ].some(result => result.status === "rejected"),
    };
  },
  {
    default: () => ({
      specimen: null,
      specimenAlt: null,
      images: [],
      otherFiles: [],
      hasSupplementaryError: false,
    }),
  },
);

const isRock = computed(() => !!data.value.specimenAlt?.rock);
const isTaxon = computed(() => !!data.value.specimenAlt?.taxon);
const title = computed(
  () => [data.value.specimen?.database?.acronym, data.value.specimen?.number].filter(Boolean).join(" ")
    || data.value.specimenAlt?.specimen_full_name || String(route.params.id),
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
        <div class="mx-auto w-full max-w-360 px-4 pt-5 pb-8 sm:px-6 lg:px-10">
          <nav class="mb-5 flex flex-wrap items-center gap-2 text-[13px] text-portal-muted" :aria-label="t('portal.specimenDetail.breadcrumb')">
            <ULink :to="localePath('/')" class="text-portal-link no-underline hover:underline">
              {{ t('portal.common.home') }}
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
              <div v-if="(isRock && titleAlt) || (isTaxon && titleAlt)" class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[30px] leading-tight text-portal-muted sm:text-[40px]">
                <span v-if="isRock && titleAlt" class="font-medium text-portal-heading">{{ titleAlt }}</span>
                <span v-if="isTaxon && titleAlt" class="font-medium text-portal-heading">{{ data.specimenAlt?.taxon }}</span>
              </div>
            </div>
            <UButton
              size="lg"
              color="neutral"
              variant="outline"
              :ui="{ base: 'border-portal-border bg-portal-background text-portal-link hover:bg-portal-mint' }"
              class="relative min-w-[180px] shrink-0 justify-center rounded-full px-6 py-3 text-center font-semibold transition-colors"
              @click="$openEdit('specimen', route.params.id as string)"
            >
              <svg
                viewBox="0 0 24 24"
                class="absolute left-4 size-5"
                aria-hidden="true"
              ><path :d="mdiSquareEditOutline" fill="currentColor" /></svg>
              <span class="block w-full text-center">{{ $t("common.linkToEdit") }}</span>
            </UButton>
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
        otherFiles: data.otherFiles,
        hasSupplementaryError: data.hasSupplementaryError,
      }"
    />
  </TemplateDetail>
</template>
