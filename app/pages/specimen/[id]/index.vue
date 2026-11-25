<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui/components/Table.vue";
import type { Specimen } from "../[id].vue";
import { mdiArchive, mdiLayersTriple, mdiMapMarkerOutline } from "@mdi/js";
import { h } from "vue";
import { ULink, UTooltip } from "#components";

const props = defineProps<{
  specimen: Specimen;
  specimenAlt?: Record<string, any> | null;
  images?: any[];
}>();

const localePath = useLocalePath();
const { locale } = useI18n();
const specimenCardUi = {
  root: "overflow-hidden rounded-portal-card border border-portal-border bg-white shadow-sm ring-0 divide-y-0",
  body: "p-0",
} as const;
const relatedCardUi = {
  root: "overflow-hidden rounded-portal-card border border-portal-border ring-0 divide-y-0",
  body: "flex min-h-24 min-w-0 items-center gap-3 p-4",
} as const;
const activeImage = ref(props.images?.[0] ?? null);
const imagePreviewOpen = ref(false);
const previewImage = ref<{
  id: number;
  filename: string;
  info: { title: string; author?: string; date?: string };
} | null>(null);
const previewImages = computed(() => previewImage.value
  ? [previewImage.value]
  : []);
function openImagePreview(image: any, title: string) {
  previewImage.value = {
    id: Number(image.id),
    filename: image.filename,
    info: {
      title,
      author: image.image_author || image.agent || image.author_free || image.author?.name,
      date: image.image_date || image.date_created_free || image.date_created,
    },
  };
  imagePreviewOpen.value = true;
}

watch(() => props.images, (images) => {
  activeImage.value = images?.[0] ?? null;
});

const activeImageIndex = computed(() =>
  props.images?.findIndex(image => image.id === activeImage.value?.id) ?? -1,
);

function showRelativeImage(offset: number) {
  const images = props.images;
  if (!images?.length)
    return;

  const currentIndex = activeImageIndex.value >= 0 ? activeImageIndex.value : 0;
  const nextIndex = (currentIndex + offset + images.length) % images.length;
  activeImage.value = images[nextIndex];
}

const dateCollected = computed(() => {
  if (!props.specimen)
    return "";
  return props.specimen.date_collected ?? props.specimen.date_collected_text;
});
const collection = computed(() => props.specimen.collection);
const type = computed(() => props.specimen.type);
const classification = computed(() => props.specimen.classification);
const locality = computed(() => props.specimen.locality);
const stratigraphy = computed(() => props.specimen.stratigraphy);
const lithostratigraphy = computed(() => props.specimen.lithostratigraphy);
const database = computed(() => props.specimen.database);
const sample = computed(() => props.specimen.sample);
const parent = computed(() => props.specimen.parent);
const originalStatus = computed(() => props.specimen.original_status);
const fossil = computed(() => props.specimen.fossil);
const { $apiFetch, $solrFetch, $translate } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const { data: localityPreview } = await useAsyncData(
  `specimen-locality-preview-${props.specimen.id}`,
  async () => {
    if (!locality.value)
      return null;

    try {
      const response = await $apiFetch<GeoloogiaListResponse>(`/localities/${locality.value.id}/locality-images/`, {
        query: {
          expand: "attachment,attachment.author",
          fields: "attachment.id,attachment.filename,attachment.author.name,attachment.date_created,attachment.date_created_free",
          limit: 1,
        },
      });
      return response.results?.[0]?.attachment?.filename
        ? response.results[0].attachment
        : null;
    }
    catch (error) {
      console.error("Could not load a preview image for the related locality.", error);
      return null;
    }
  },
  {
    default: () => null,
  },
);
const coordinatePageSize = 12;
const initialCoordinatePage = Number(route.query.coordinatePage);
const coordinatePage = ref(Number.isInteger(initialCoordinatePage) && initialCoordinatePage > 0
  ? initialCoordinatePage
  : 1);
const { data: relatedData } = await useAsyncData(
  `specimen-related-${props.specimen.id}`,
  async () => {
    const [identifications, rockIdentifications, references] = await Promise.all([
      $apiFetch<GeoloogiaListResponse>(`/specimens/${props.specimen.id}/specimen-taxa/`, {
        query: { limit: 50, expand: "taxon,agent,reference,identification_type" },
      }).catch(() => ({
        count: 0,
        next: null,
        previous: null,
        results: [],
      })),
      $apiFetch<GeoloogiaListResponse>(`/specimens/${props.specimen.id}/specimen-rocks/`, {
        query: { limit: 50, expand: "rock,agent,reference,type" },
      }).catch(() => ({
        count: 0,
        next: null,
        previous: null,
        results: [],
      })),
      $apiFetch<GeoloogiaListResponse>(`/specimens/${props.specimen.id}/specimen-references/`, {
        query: { limit: 50, expand: "reference", ordering: "-reference__year" },
      }).catch(() => ({
        count: 0,
        next: null,
        previous: null,
        results: [],
      })),
    ]);

    return {
      identifications: identifications.results ?? [],
      identificationsCount: identifications.count ?? 0,
      rockIdentifications: rockIdentifications.results ?? [],
      rockIdentificationsCount: rockIdentifications.count ?? 0,
      references: references.results ?? [],
      referencesCount: references.count ?? 0,
    };
  },
  {
    default: () => ({
      identifications: [],
      identificationsCount: 0,
      rockIdentifications: [],
      rockIdentificationsCount: 0,
      references: [],
      referencesCount: 0,
    }),
  },
);
const {
  data: coordinateData,
  status: coordinateStatus,
  error: coordinateError,
} = await useAsyncData(
  `specimen-coordinate-records-${props.specimen.id}`,
  async () => {
    const { latitude, longitude } = props.specimen.locality ?? {};
    if (latitude == null || longitude == null)
      return { records: [], count: 0 };

    const response = await $solrFetch<SolrResponse>("/specimen", {
      query: {
        q: "*:*",
        fq: [
          `latitude:${latitude}`,
          `longitude:${longitude}`,
          `-id:${props.specimen.id}`,
        ],
        rows: coordinatePageSize,
        start: (coordinatePage.value - 1) * coordinatePageSize,
        sort: "specimen_full_name asc",
        fields: "id,specimen_full_name",
      },
    });
    const records = response.response.docs;
    const imageQuery = records
      .map(record => `specimen_id:${record.id}`)
      .join(" OR ");
    const imagesBySpecimen = new Map<number, any>();

    if (imageQuery) {
      try {
        const imageResponse = await $solrFetch<SolrResponse>("/specimen_image", {
          query: {
            q: imageQuery,
            rows: 100,
            sort: "id asc",
            fields: "id,specimen_id,filename,image_author,image_date",
          },
        });
        for (const image of imageResponse.response.docs) {
          const specimenId = Number(image.specimen_id);
          if (!imagesBySpecimen.has(specimenId))
            imagesBySpecimen.set(specimenId, image);
        }
      }
      catch (error) {
        console.error("Could not load preview images for same-coordinate specimens.", error);
      }
    }

    return {
      records: records.map(record => ({
        ...record,
        preview: imagesBySpecimen.get(Number(record.id)),
      })),
      count: response.response.numFound,
    };
  },
  {
    watch: [coordinatePage],
    default: () => ({ records: [], count: 0 }),
  },
);

const coordinateRecords = computed(() => coordinateData.value.records);
const coordinateRecordCount = computed(() => coordinateData.value.count);
const coordinatePageCount = computed(() => Math.ceil(coordinateRecordCount.value / coordinatePageSize));
const coordinateFrom = computed(() => coordinateRecordCount.value
  ? (coordinatePage.value - 1) * coordinatePageSize + 1
  : 0);
const coordinateTo = computed(() => Math.min(coordinatePage.value * coordinatePageSize, coordinateRecordCount.value));

function setCoordinatePage(page: number) {
  coordinatePage.value = page;
  const query = { ...route.query };
  if (page === 1)
    delete query.coordinatePage;
  else
    query.coordinatePage = String(page);
  void router.replace({ query });
}

watch(() => route.query.coordinatePage, (value) => {
  const page = Number(value);
  const validPage = Number.isInteger(page) && page > 0
    ? page
    : 1;
  if (validPage !== coordinatePage.value)
    coordinatePage.value = validPage;
});

watch(coordinatePageCount, (pageCount) => {
  if (pageCount > 0 && coordinatePage.value > pageCount)
    setCoordinatePage(pageCount);
});
const identifiedTaxon = computed(() => {
  if (props.specimenAlt?.taxon)
    return props.specimenAlt.taxon;
  return locale.value === "en"
    ? classification.value?.name_en
    : classification.value?.name;
});
interface IdentificationTableRow {
  id: string | number;
  taxon: string;
  taxonId: number | string | null | undefined;
  identifiedBy: string;
  dateIdentified: string;
  confidence: string;
  status: string;
}
interface RockIdentificationTableRow {
  id: string | number;
  rock: string;
  rockId: number | string | undefined;
  identifiedBy: string;
  dateIdentified: string;
}
const identificationRows = computed<IdentificationTableRow[]>(() => {
  const items = relatedData.value.identifications;
  if (!items.length && classification.value) {
    return [
      {
        id: "classification",
        taxon: identifiedTaxon.value || "—",
        taxonId: null,
        identifiedBy: "—",
        dateIdentified: "—",
        confidence: "—",
        status: "—",
      },
    ];
  }

  return items.map(item => ({
    id: item.id,
    taxon: item.taxon?.name || "—",
    taxonId: item.taxon?.id,
    identifiedBy: item.agent?.name || "—",
    dateIdentified: item.date_identified || "—",
    confidence: item.identification_type
      ? $translate({ et: item.identification_type.value, en: item.identification_type.value_en })
      : "—",
    status: item.is_current
      ? (locale.value === "en"
          ? "Current"
          : "Kehtiv")
      : (locale.value === "en"
          ? "Previous"
          : "Varasem"),
  }));
});
const identificationColumns = computed<TableColumn<IdentificationTableRow>[]>(() => [
  {
    accessorKey: "taxon",
    header: locale.value === "en"
      ? "Taxon"
      : "Takson",
    cell: ({ row }) => row.original.taxonId
      ? h(UTooltip, {
          text: locale.value === "en"
            ? "Opens Fossiilid.info in a new tab"
            : "Avab Fossiilid.info veebilehe uuel vahelehel",
          delayDuration: 250,
        }, {
          default: () => h(ULink, {
            to: `https://fossiilid.info/${row.original.taxonId}`,
            external: true,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "font-semibold text-portal-link underline underline-offset-2",
          }, () => row.original.taxon),
        })
      : h("span", { class: "font-semibold text-portal-link" }, row.original.taxon),
  },
  {
    accessorKey: "identifiedBy",
    header: locale.value === "en"
      ? "Identified by"
      : "Määranud",
  },
  {
    accessorKey: "dateIdentified",
    header: locale.value === "en"
      ? "Date"
      : "Kuupäev",
  },
  {
    accessorKey: "confidence",
    header: locale.value === "en"
      ? "Confidence"
      : "Kindlus",
  },
  {
    accessorKey: "status",
    header: locale.value === "en"
      ? "Status"
      : "Olek",
  },
]);
const rockIdentificationRows = computed<RockIdentificationTableRow[]>(() => relatedData.value.rockIdentifications.map(item => ({
  id: item.id,
  rock: item.rock
    ? $translate({ et: item.rock.name, en: item.rock.name_en })
    : "—",
  rockId: item.rock?.id,
  identifiedBy: item.agent?.name || "—",
  dateIdentified: item.date_identified || item.date_identified_free || "—",
})));
const rockIdentificationColumns = computed<TableColumn<RockIdentificationTableRow>[]>(() => [
  {
    accessorKey: "rock",
    header: locale.value === "en"
      ? "Rock"
      : "Kivi",
    cell: ({ row }) => row.original.rockId
      ? h(ULink, {
          to: `https://kivid.info/${row.original.rockId}`,
          external: true,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-portal-link underline underline-offset-2",
        }, () => row.original.rock)
      : row.original.rock,
  },
  {
    accessorKey: "identifiedBy",
    header: locale.value === "en"
      ? "Identified by"
      : "Määranud",
  },
  {
    accessorKey: "dateIdentified",
    header: locale.value === "en"
      ? "Date"
      : "Kuupäev",
  },
]);
const collectorName = computed(() => {
  const collector = props.specimen.collector;
  if (!collector)
    return null;
  if (collector.name)
    return collector.name;
  return [collector.forename, collector.surname].filter(Boolean).join(" ");
});
const titleAlt = computed(() => {
  if (props.specimenAlt?.rock)
    return props.specimenAlt.rock_txt?.[0] || props.specimenAlt.rock;
  return props.specimenAlt?.taxon || identifiedTaxon.value;
});

const mapBaseLayer = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return ["Estonian bedrock" as const];
  return undefined;
});
</script>

<template>
  <div class="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-10">
    <div
      v-if="(props.images?.length && activeImage) || locality"
      class="mb-5 grid items-stretch gap-5"
      :class="props.images?.length && activeImage && locality ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]' : 'grid-cols-1'"
    >
      <UCard
        v-if="props.images?.length && activeImage"
        as="section"
        :ui="specimenCardUi"
        class="min-w-0"
      >
        <div class="flex items-end justify-between gap-4 border-b border-portal-border bg-portal-mint/60 px-5 py-4 sm:px-6">
          <div>
            <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">
              {{ locale === "en" ? "Collection media" : "Kollektsiooni fotod" }}
            </p>
            <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">
              {{ locale === "en" ? "Photographs" : "Fotod" }}
            </h2>
          </div>
          <div v-if="props.images.length > 1" class="flex items-center gap-1">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-chevron-left"
              class="!flex !size-9 !min-h-9 !w-9 !items-center !justify-center !rounded-portal-control !bg-transparent !p-0 text-portal-muted hover:bg-portal-subtle hover:text-portal-heading"
              :aria-label="locale === 'en' ? 'Previous image' : 'Eelmine foto'"
              @click="showRelativeImage(-1)"
            />
            <span class="min-w-12 text-center text-xs tabular-nums text-portal-muted">
              {{ activeImageIndex + 1 }} / {{ props.images.length }}
            </span>
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-chevron-right"
              class="!flex !size-9 !min-h-9 !w-9 !items-center !justify-center !rounded-portal-control !bg-transparent !p-0 text-portal-muted hover:bg-portal-subtle hover:text-portal-heading"
              :aria-label="locale === 'en' ? 'Next image' : 'Järgmine foto'"
              @click="showRelativeImage(1)"
            />
          </div>
          <span v-else class="text-sm tabular-nums text-portal-muted">1</span>
        </div>
        <div class="grid gap-4 p-4 sm:p-5">
          <div class="relative">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              class="!h-auto min-h-[220px] w-full !rounded-portal-card !p-0 cursor-zoom-in items-center justify-center overflow-hidden bg-portal-subtle focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus sm:min-h-[320px]"
              :aria-label="locale === 'en' ? 'Open large image preview' : 'Ava suur pildieelvaade'"
              @click="openImagePreview(activeImage, titleAlt || specimen.number)"
            >
              <NuxtImg
                :src="activeImage.filename"
                provider="geocollections"
                :alt="titleAlt || identifiedTaxon || specimen.number"
                width="900"
                height="600"
                fit="contain"
                class="max-h-[min(55vh,480px)] w-full object-contain"
              />
            </UButton>
          </div>
          <div class="flex min-w-0 flex-wrap items-end justify-between gap-4">
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-b border-portal-border pb-4 text-sm">
              <dt class="text-portal-muted">
                {{ locale === "en" ? "Image no." : "Foto nr." }}
              </dt>
              <dd class="m-0 text-right text-portal-text">
                {{ activeImage.image_number || activeImage.id }}
              </dd>
              <template v-if="activeImage.agent || activeImage.author_free">
                <dt class="text-portal-muted">
                  {{ locale === "en" ? "Photographer" : "Pildistaja" }}
                </dt>
                <dd class="m-0 text-right text-portal-text">
                  {{ activeImage.agent || activeImage.author_free }}
                </dd>
              </template>
              <template v-if="activeImage.date_created_free || activeImage.date_created">
                <dt class="text-portal-muted">
                  {{ locale === "en" ? "Date" : "Kuupäev" }}
                </dt>
                <dd class="m-0 text-right text-portal-text">
                  {{ activeImage.date_created_free || $formatDate(activeImage.date_created) }}
                </dd>
              </template>
            </dl>
            <div v-if="props.images.length > 1" class="grid max-h-24 grid-cols-6 gap-2 overflow-x-auto overflow-y-hidden">
              <UButton
                v-for="image in props.images"
                :key="image.id"
                type="button"
                color="neutral"
                variant="ghost"
                square
                class="!h-auto !w-auto aspect-square overflow-hidden !rounded-portal-control !p-0 border bg-portal-subtle transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus"
                :class="activeImage.id === image.id ? 'border-2 border-portal-primary' : 'border-portal-border hover:border-portal-border-hover'"
                :aria-label="`${locale === 'en' ? 'Show image' : 'Näita pilti'} ${image.image_number || image.id}`"
                :aria-pressed="activeImage.id === image.id"
                @click="activeImage = image"
              >
                <NuxtImg
                  :src="image.filename"
                  provider="geocollections"
                  alt=""
                  width="180"
                  height="180"
                  fit="cover"
                  class="size-full object-cover"
                />
              </UButton>
            </div>
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              class="min-h-11 rounded-portal-control border-portal-border px-4 text-sm font-medium text-portal-heading hover:border-portal-border-hover hover:text-portal-link"
              @click="openImagePreview(activeImage, titleAlt || specimen.number)"
            >
              {{ locale === "en" ? "View larger" : "Vaata suuremalt" }}
            </UButton>
          </div>
        </div>
      </UCard>
      <UCard
        v-if="locality"
        as="section"
        :ui="{
          root: 'flex min-h-0 flex-col overflow-hidden rounded-portal-card border border-portal-border bg-white shadow-sm ring-0 divide-y-0',
          body: 'flex min-h-0 flex-1 flex-col p-0',
        }"
        class="min-w-0"
      >
        <div class="flex items-start justify-between gap-4 border-b border-portal-border bg-portal-subtle px-5 py-4 sm:px-6">
          <div>
            <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">
              {{ locale === "en" ? "Geographic context" : "Geograafiline kontekst" }}
            </p>
            <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">
              {{ locale === "en" ? "Locality & geology" : "Leiukoht ja geoloogia" }}
            </h2>
          </div>
          <span v-if="locality.country" class="mt-1 text-right text-xs text-portal-muted">
            {{ $translate({ et: locality.country.name, en: locality.country.name_en }) }}
          </span>
        </div>
        <div class="flex items-center justify-between gap-4 px-5 pt-4 sm:px-6">
          <ULink :to="localePath({ name: 'locality-id', params: { id: locality.id } })" class="text-sm font-semibold text-portal-link underline underline-offset-2">
            {{ $translate({ et: locality.name, en: locality.name_en }) }}
          </ULink>
          <span v-if="locality.latitude != null && locality.longitude != null" class="shrink-0 font-mono text-[11px] tabular-nums text-portal-muted">
            {{ locality.latitude.toFixed(4) }}, {{ locality.longitude.toFixed(4) }}
          </span>
        </div>
        <div
          v-if="locality.latitude != null && locality.longitude != null"
          class="mx-5 mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-portal-card border border-portal-border sm:mx-6"
          :class="props.images?.length && activeImage ? 'min-h-[220px]' : 'min-h-[340px]'"
        >
          <MapDetail
            height="100%"
            :base-layer="mapBaseLayer"
            :overlays="mapOverlays"
            :center="{ latitude: locality.latitude, longitude: locality.longitude }"
            :markers="[{
              latitude: locality.latitude,
              longitude: locality.longitude,
              radius: 10,
              text: $translate({ et: locality.name, en: locality.name_en }),
              route: localePath({ name: 'locality-id', params: { id: locality.id } }),
            }]"
          />
        </div>
        <p v-else class="mx-5 mt-4 border border-dashed border-portal-border px-4 py-6 text-sm text-portal-muted sm:mx-6">
          {{ locale === "en" ? "Coordinates are not available for this locality." : "Sellel leiukohal koordinaadid puuduvad." }}
        </p>
        <dl class="m-0 grid grid-cols-1 px-5 py-3 sm:grid-cols-2 sm:gap-x-8 sm:px-6 [&>div]:grid-cols-1 [&>div]:content-start [&>div]:gap-y-0.5 [&>div]:border-b [&>div]:border-portal-border [&>div]:py-3 [&>div>dt]:text-xs [&>div>dt]:leading-[1.4] [&>div>dd]:text-sm [&>div>dd]:leading-[1.5]">
          <div v-if="stratigraphy" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.stratigraphy") }}
            </dt>
            <dd class="m-0">
              <ULink :to="localePath({ name: 'stratigraphy-id', params: { id: stratigraphy.id } })" class="text-portal-link underline underline-offset-2">
                {{ $translate({ et: stratigraphy.name, en: stratigraphy.name_en }) }}
              </ULink>
            </dd>
          </div>
          <div v-if="lithostratigraphy" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.lithostratigraphy") }}
            </dt>
            <dd class="m-0">
              <ULink :to="localePath({ name: 'stratigraphy-id', params: { id: lithostratigraphy.id } })" class="text-portal-link underline underline-offset-2">
                {{ $translate({ et: lithostratigraphy.name, en: lithostratigraphy.name_en }) }}
              </ULink>
            </dd>
          </div>
          <div v-if="specimen.stratigraphy_text" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ locale === "en" ? "Stratigraphy remarks" : "Stratigraafia märkus" }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ specimen.stratigraphy_text }}
            </dd>
          </div>
        </dl>
      </UCard>
    </div>
    <div class="grid items-start gap-5">
      <UCard as="section" :ui="specimenCardUi">
        <div class="border-b border-portal-border bg-portal-selected px-5 py-4 sm:px-6">
          <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">
            {{ locale === "en" ? "Record details" : "Kirje andmed" }}
          </p>
          <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">
            {{ locale === "en" ? "Specimen information" : "Eksemplari info" }}
          </h2>
        </div>
        <dl class="m-0 grid grid-cols-1 px-5 sm:grid-cols-2 sm:gap-x-8 sm:px-6 [&>div]:grid-cols-1 [&>div]:content-start [&>div]:gap-y-0.5 [&>div]:border-b [&>div]:border-portal-border [&>div]:py-3 [&>div>dt]:text-xs [&>div>dt]:leading-[1.4] [&>div>dd]:text-sm [&>div>dd]:leading-[1.5]">
          <div v-if="collection" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm last:border-b-0">
            <dt class="text-portal-muted">
              {{ $t("specimen.collectionNr") }}
            </dt>
            <dd class="m-0 text-portal-link">
              <ULink :to="localePath({ name: 'collection-id', params: { id: collection.id } })" class="font-semibold underline underline-offset-2">
                {{ collection.number }}
              </ULink>
            </dd>
          </div>
          <div class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm last:border-b-0">
            <dt class="text-portal-muted">
              {{ $t("specimen.number") }}
            </dt>
            <dd class="m-0 font-medium text-portal-text">
              {{ specimen.number }}
            </dd>
          </div>
          <div v-if="parent" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.parent") }}
            </dt>
            <dd class="m-0">
              <ULink :to="localePath({ name: 'specimen-id', params: { id: parent.id } })" class="text-portal-link underline underline-offset-2">
                {{ parent.number }}
              </ULink>
            </dd>
          </div>
          <div v-if="sample" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.sample") }}
            </dt>
            <dd class="m-0">
              <ULink :to="localePath({ name: 'sample-id', params: { id: sample.id } })" class="text-portal-link underline underline-offset-2">
                {{ sample.number }}
              </ULink>
            </dd>
          </div>
          <div v-if="specimen.old_number" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.oldNumber") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ specimen.old_number }}
            </dd>
          </div>
          <div v-if="type" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.type") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ $translate({ et: type.value, en: type.value_en }) }}
            </dd>
          </div>
          <div v-if="specimen.part" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.part") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ specimen.part }}
            </dd>
          </div>
          <div v-if="originalStatus" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.originalStatus") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ $translate({ et: originalStatus.value, en: originalStatus.value_en }) }}
            </dd>
          </div>
          <div v-if="fossil" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ locale === "en" ? "Kind" : "Liik" }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ $translate({ et: fossil.value, en: fossil.value_en }) }}
            </dd>
          </div>
          <div v-if="classification" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.group") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ $translate({ et: classification.name, en: classification.name_en }) }}
            </dd>
          </div>
          <div v-if="specimen.depth !== null" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.depth") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ specimen.depth }}
            </dd>
          </div>
          <div v-if="specimen.remarks" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.remarks") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ specimen.remarks }}
            </dd>
          </div>
          <div v-if="dateCollected" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.dateCollected") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ dateCollected }}
            </dd>
          </div>
          <div v-if="collectorName" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-portal-border py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.collector") }}
            </dt>
            <dd class="m-0 text-portal-text">
              {{ collectorName }}
            </dd>
          </div>
          <div v-if="database" class="grid grid-cols-[160px_minmax(0,1fr)] gap-3 py-2.5 text-sm">
            <dt class="text-portal-muted">
              {{ $t("specimen.institution") }}
            </dt>
            <dd class="m-0">
              <ULink :to="database.url" class="text-portal-link underline underline-offset-2">
                {{ $translate({ et: database.name, en: database.name_en }) }}
              </ULink>
            </dd>
          </div>
        </dl>
      </UCard>
    </div>

    <UCard
      v-if="relatedData.identificationsCount || classification"
      as="section"
      :ui="specimenCardUi"
      class="mt-8"
    >
      <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
        {{ locale === "en" ? "Taxon identifications" : "Taksoni määramised" }}
      </h2>
      <UTable
        :data="identificationRows"
        :columns="identificationColumns"
        :caption="locale === 'en' ? 'Taxon identifications' : 'Taksoni määramised'"
        :empty="locale === 'en' ? 'No identifications available.' : 'Määranguid ei leitud.'"
        class="text-sm"
        :ui="{
          root: 'overflow-x-auto',
          base: 'min-w-full',
          thead: 'bg-portal-subtle text-left text-portal-muted',
          tbody: 'divide-y divide-portal-border',
          tr: 'transition-colors hover:bg-portal-subtle',
          th: 'px-4 py-3 text-left font-medium text-portal-muted',
          td: 'px-4 py-3 text-portal-text',
          empty: 'px-4 py-6 text-center text-sm text-portal-muted',
        }"
      />
    </UCard>

    <UCard
      v-if="relatedData.rockIdentificationsCount"
      as="section"
      :ui="specimenCardUi"
      class="mt-8"
    >
      <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
        {{ locale === "en" ? "Rock identifications" : "Kivi määramised" }}
      </h2>
      <UTable
        :data="rockIdentificationRows"
        :columns="rockIdentificationColumns"
        :caption="locale === 'en' ? 'Rock identifications' : 'Kivi määramised'"
        :empty="locale === 'en' ? 'No rock identifications available.' : 'Kivi määranguid ei leitud.'"
        class="text-sm"
        :ui="{
          root: 'overflow-x-auto',
          base: 'min-w-full',
          thead: 'bg-portal-subtle text-left text-portal-muted',
          tbody: 'divide-y divide-portal-border',
          tr: 'transition-colors hover:bg-portal-subtle',
          th: 'px-4 py-3 text-left font-medium text-portal-muted',
          td: 'px-4 py-3 text-portal-text',
          empty: 'px-4 py-6 text-center text-sm text-portal-muted',
        }"
      />
    </UCard>

    <UCard
      v-if="relatedData.referencesCount"
      as="section"
      :ui="specimenCardUi"
      class="mt-8"
    >
      <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
        {{ locale === "en" ? "References" : "Kirjandus" }}
      </h2>
      <ul class="m-0 grid list-none gap-3 p-4 sm:p-5">
        <li
          v-for="item in relatedData.references"
          :key="item.id"
          class="rounded-portal-card border border-portal-border bg-portal-background p-4 sm:p-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <BaseLinkExternal
                v-if="item.reference?.id"
                class="font-semibold text-portal-link"
                @click="$openGeokirjandus('reference', item.reference.id)"
              >
                {{ item.reference.reference || item.reference.title || item.reference }}
              </BaseLinkExternal>
              <p v-else class="m-0 font-semibold text-portal-heading">
                {{ item.reference?.reference || item.reference?.title || item.reference }}
              </p>
              <p v-if="item.reference?.title && item.reference.title !== item.reference.reference" class="mt-1 mb-0 text-sm text-portal-text">
                {{ item.reference.title }}
              </p>
            </div>
            <span v-if="item.reference?.year" class="shrink-0 rounded-full bg-portal-mint px-3 py-1 text-sm font-medium text-portal-text">
              {{ item.reference.year }}
            </span>
          </div>
          <dl class="mt-3 grid gap-x-6 gap-y-2 border-t border-portal-border pt-3 text-sm sm:grid-cols-2">
            <div v-if="item.reference?.journal?.name || item.reference?.journal__journal_name || item.reference?.book">
              <dt class="text-xs text-portal-muted">{{ locale === 'en' ? 'Publication' : 'Väljaanne' }}</dt>
              <dd class="m-0 text-portal-text">{{ item.reference.journal?.name || item.reference.journal__journal_name || item.reference.book }}</dd>
            </div>
            <div v-if="item.reference?.volume || item.reference?.issue">
              <dt class="text-xs text-portal-muted">{{ locale === 'en' ? 'Volume / issue' : 'Köide / number' }}</dt>
              <dd class="m-0 text-portal-text">{{ [item.reference.volume, item.reference.issue].filter(Boolean).join(' / ') }}</dd>
            </div>
            <div v-if="item.reference?.pages">
              <dt class="text-xs text-portal-muted">{{ locale === 'en' ? 'Pages' : 'Leheküljed' }}</dt>
              <dd class="m-0 text-portal-text">{{ item.reference.pages }}</dd>
            </div>
            <div v-if="item.reference?.doi">
              <dt class="text-xs text-portal-muted">DOI</dt>
              <dd class="m-0"><BaseLinkExternal @click="$openWindow(`https://doi.org/${item.reference.doi}`)">{{ item.reference.doi }}</BaseLinkExternal></dd>
            </div>
            <div v-if="item.reference?.pdf">
              <dt class="text-xs text-portal-muted">PDF</dt>
              <dd class="m-0"><a :href="item.reference.pdf" target="_blank" rel="noopener noreferrer" class="text-portal-link underline">{{ locale === 'en' ? 'Open full text' : 'Ava täistekst' }}</a></dd>
            </div>
          </dl>
        </li>
      </ul>
    </UCard>

    <section v-if="collection || locality || stratigraphy" class="mt-10">
      <div class="mb-4 flex items-center gap-3">
        <span aria-hidden="true" class="h-1 w-10 rounded-full bg-portal-primary" />
        <h2 class="m-0 text-[20px] font-semibold tracking-[-0.015em] text-portal-heading">
          {{ locale === "en" ? "Explore related data" : "Seotud andmed" }}
        </h2>
      </div>
      <div class="grid gap-3 md:grid-cols-3">
        <UCard
          v-if="collection"
          as="article"
          :ui="relatedCardUi"
          class="group bg-portal-mint/60 transition-[border-color,background-color] hover:border-portal-primary/40 focus-within:border-portal-focus"
        >
          <div class="grid size-12 shrink-0 place-items-center rounded-portal-card bg-portal-background/80 text-portal-primary" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path :d="mdiArchive" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="m-0 mb-1 text-xs text-portal-muted">
              {{ locale === "en" ? "Collection" : "Kollektsioon" }}
            </p>
            <ULink
              :to="localePath({ name: 'collection-id-specimens', params: { id: collection.id } })"
              class="font-semibold text-portal-link underline underline-offset-2 group-hover:text-portal-primary"
            >
              {{ collection.number }}
            </ULink>
          </div>
          <span aria-hidden="true" class="text-lg text-portal-muted transition-transform group-hover:translate-x-0.5">→</span>
        </UCard>
        <UCard
          v-if="locality"
          as="article"
          :ui="relatedCardUi"
          class="group bg-portal-subtle transition-[border-color,background-color] hover:border-portal-primary/40 focus-within:border-portal-focus"
        >
          <UButton
            v-if="localityPreview"
            type="button"
            color="neutral"
            variant="ghost"
            square
            class="!h-12 !w-12 shrink-0 overflow-hidden !rounded-portal-card border border-portal-border bg-white !p-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus"
            :aria-label="locale === 'en' ? 'Open locality photo preview' : 'Ava leiukoha foto eelvaade'"
            @click="openImagePreview(localityPreview, $translate({ et: locality.name, en: locality.name_en }))"
          >
            <NuxtImg
              :src="localityPreview.filename"
              provider="geocollections"
              alt=""
              width="96"
              height="96"
              fit="cover"
              class="size-full object-cover"
            />
          </UButton>
          <div
            v-else
            class="grid size-12 shrink-0 place-items-center rounded-portal-card bg-portal-background/80 text-portal-primary"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path :d="mdiMapMarkerOutline" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="m-0 mb-1 text-xs text-portal-muted">
              {{ locale === "en" ? "Locality" : "Leiukoht" }}
            </p>
            <ULink
              :to="localePath({ name: 'locality-id', params: { id: locality.id } })"
              class="font-semibold text-portal-link underline underline-offset-2 group-hover:text-portal-primary"
            >
              {{ $translate({ et: locality.name, en: locality.name_en }) }}
            </ULink>
          </div>
          <span aria-hidden="true" class="text-lg text-portal-muted transition-transform group-hover:translate-x-0.5">→</span>
        </UCard>
        <UCard
          v-if="stratigraphy"
          as="article"
          :ui="relatedCardUi"
          class="group bg-portal-selected transition-[border-color,background-color] hover:border-portal-primary/40 focus-within:border-portal-focus"
        >
          <div class="grid size-12 shrink-0 place-items-center rounded-portal-card bg-portal-background/80 text-portal-primary" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path :d="mdiLayersTriple" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="m-0 mb-1 text-xs text-portal-muted">
              {{ locale === "en" ? "Stratigraphy" : "Stratigraafia" }}
            </p>
            <ULink
              :to="localePath({ name: 'stratigraphy-id', params: { id: stratigraphy.id } })"
              class="font-semibold text-portal-link underline underline-offset-2 group-hover:text-portal-primary"
            >
              {{ $translate({ et: stratigraphy.name, en: stratigraphy.name_en }) }}
            </ULink>
          </div>
          <span aria-hidden="true" class="text-lg text-portal-muted transition-transform group-hover:translate-x-0.5">→</span>
        </UCard>
      </div>
    </section>
    <UCard
      v-if="coordinateRecords.length || coordinateStatus === 'pending' || coordinateError"
      as="section"
      class="mt-8 overflow-hidden rounded-portal-card border border-portal-border bg-white shadow-sm"
      :ui="{ body: 'p-0' }"
    >
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-portal-border bg-portal-mint/60 px-5 py-4 sm:px-6">
        <div>
          <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">{{ locale === "en" ? "Same locality coordinates" : "Samad leiukoha koordinaadid" }}</p>
          <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">{{ locale === "en" ? "Other specimen records" : "Teised eksemplarikirjed" }}</h2>
        </div>
        <span class="inline-flex items-center rounded-full bg-portal-subtle px-3 py-1.5 text-xs font-medium tabular-nums text-portal-muted">{{ coordinateRecordCount.toLocaleString(locale) }} {{ locale === "en" ? "records" : "kirjet" }}</span>
      </div>
      <p v-if="coordinateStatus === 'pending'" class="m-0 p-5 text-sm text-portal-muted" role="status">{{ locale === "en" ? "Loading nearby records…" : "Samade koordinaatidega kirjete laadimine…" }}</p>
      <p v-else-if="coordinateError" class="m-0 p-5 text-sm text-portal-error" role="alert">{{ locale === "en" ? "Could not load related specimen records." : "Seotud eksemplarikirjete laadimine ebaõnnestus." }}</p>
      <ul v-else class="m-0 grid max-h-110 grid-cols-1 gap-2 overflow-y-auto p-3 sm:grid-cols-2">
        <li v-for="record in coordinateRecords" :key="record.id" class="flex min-w-0 items-center gap-3 rounded-portal-control border border-portal-border px-3 py-2 transition-colors hover:border-portal-border-hover hover:bg-portal-selected">
          <div class="min-w-0 flex-1"><ULink :to="localePath({ name: 'specimen-id', params: { id: record.id } })" class="text-sm font-semibold text-portal-link underline underline-offset-2 hover:text-portal-primary">{{ record.specimen_full_name }}</ULink></div>
          <UButton v-if="record.preview" type="button" color="neutral" variant="ghost" square class="h-12! w-12! shrink-0 overflow-hidden rounded-portal-card! border border-portal-border bg-portal-subtle p-0! transition-colors hover:border-portal-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus" :aria-label="`${locale === 'en' ? 'Open photo preview for' : 'Ava eksemplari foto'} ${record.specimen_full_name}`" @click="openImagePreview(record.preview, record.specimen_full_name)">
            <NuxtImg :src="record.preview.filename" provider="geocollections" alt="" width="96" height="96" fit="cover" class="size-full object-cover" />
          </UButton>
        </li>
      </ul>
      <div v-if="coordinatePageCount > 1" class="flex flex-wrap items-center justify-between gap-3 border-t border-portal-border px-4 py-3 sm:px-5">
        <span class="text-xs tabular-nums text-portal-muted">{{ locale === "en" ? `Showing ${coordinateFrom}–${coordinateTo} of ${coordinateRecordCount.toLocaleString(locale)} records at these coordinates` : `Kuvatakse ${coordinateFrom}–${coordinateTo} kirjet ${coordinateRecordCount.toLocaleString(locale)} samade koordinaatidega kirjest` }}</span>
        <div class="flex items-center gap-2">
          <UButton color="neutral" variant="outline" size="sm" :disabled="coordinatePage <= 1 || coordinateStatus === 'pending'" :aria-label="locale === 'en' ? 'Previous page of related records' : 'Seotud kirjete eelmine leht'" @click="setCoordinatePage(coordinatePage - 1)">{{ locale === "en" ? "Previous" : "Eelmine" }}</UButton>
          <span class="min-w-14 text-center text-xs tabular-nums text-portal-muted">{{ coordinatePage }} / {{ coordinatePageCount }}</span>
          <UButton color="neutral" variant="outline" size="sm" :disabled="coordinatePage >= coordinatePageCount || coordinateStatus === 'pending'" :aria-label="locale === 'en' ? 'Next page of related records' : 'Seotud kirjete järgmine leht'" @click="setCoordinatePage(coordinatePage + 1)">{{ locale === "en" ? "Next" : "Järgmine" }}</UButton>
        </div>
      </div>
      <p v-else-if="coordinateRecordCount > 0" class="m-0 border-t border-portal-border px-5 py-3 text-xs leading-normal text-portal-muted">{{ locale === "en" ? `Showing ${coordinateFrom}–${coordinateTo} of ${coordinateRecordCount.toLocaleString(locale)} records at these coordinates.` : `Kuvatakse ${coordinateFrom}–${coordinateTo} kirjet ${coordinateRecordCount.toLocaleString(locale)} samade koordinaatidega kirjest.` }}</p>
    </UCard>
    <PortalPhotoViewer
      v-if="imagePreviewOpen && previewImages.length"
      v-model="imagePreviewOpen"
      :images="previewImages"
      :total="1"
      :large-preview="true"
    >
      <template #info="{ item }">
        <p class="m-0 font-medium text-portal-heading">
          {{ item.info.title }}
        </p>
        <p v-if="item.info.author" class="m-0 text-sm text-portal-muted">
          {{ locale === "en" ? "Photographer" : "Pildistaja" }}: {{ item.info.author }}
        </p>
        <p v-if="item.info.date" class="m-0 text-sm text-portal-muted">
          {{ locale === "en" ? "Date" : "Kuupäev" }}: {{ item.info.date }}
        </p>
      </template>
    </PortalPhotoViewer>
  </div>
</template>
