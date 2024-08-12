<script setup lang="ts">
import { mdiFile } from "@mdi/js";

const { $translate, $solrFetch, $apiFetch } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const tabs = {
  general: {
    type: "static",
    routeName: "file-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  relations: {
    type: "dynamic",
    routeName: "file-id-relations",
    title: "file.relations",
    count: async () => {
      return $solrFetch<SolrResponse>("/attachment_link", {
        query: {
          q: `attachment_id:${route.params.id}`,
          rows: 0,
        },
      }).then(res => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
};

export interface File {
  id: number;
  specimen: Nullable<{
    id: number;
    number: Nullable<string>;
    locality: Nullable<{
      id: number;
      name: string;
      name_en: string;
      latitude: Nullable<number>;
      longitude: Nullable<number>;
      country: Nullable<{
        iso_3166_1_alpha_2: string;
      }>;
    }>;
    collection: Nullable<{
      id: number;
      number: string;
    }>;
    stratigraphy: Nullable<{
      id: number;
      name: string;
      name_en: string;
    }>;
  }>;
  filename: string;
  image_height: Nullable<number>;
  image_width: Nullable<number>;
  image_latitude: Nullable<number>;
  image_longitude: Nullable<number>;
  image_place: Nullable<string>;
  image_scalebar: Nullable<string>;
  image_number: Nullable<string>;
  image_people: Nullable<string>;
  description: Nullable<string>;
  description_en: Nullable<string>;
  date_digitised: Nullable<string>;
  date_digitised_text: Nullable<string>;
  mime_type: Nullable<{
    id: number;
    content_type: string;
  }>;
  locality: Nullable<{
    id: number;
    name: string;
    name_en: string;
    latitude: Nullable<number>;
    longitude: Nullable<number>;
    country: Nullable<{
      iso_3166_1_alpha_2: string;
    }>;
  }>;
  digitised_by: Nullable<{
    name: string;
  }>;
  type: Nullable<{
    id: number;
    value: string;
    value_en: string;
  }>;
  licence: Nullable<{
    name: string;
    url: string;
  }>;
  author: Nullable<{
    name: string;
  }>;
  author_text: Nullable<string>;
  remarks: Nullable<string>;
  date_created: Nullable<string>;
  date_created_text: Nullable<string>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
  imageset: Nullable<{
    number: string;
    description: string;
  }>;
  database: Nullable<{
    id: number;
    acronym: string;
    name: string;
    name_en: string;
    url: string;
  }>;
  reference: Nullable<{
    reference: string;
  }>;
  specimen_image_attachment: number;
}

const { data } = await useAsyncData("data", async () => {
  const file = await $apiFetch<File>(`/attachments/${route.params.id}/`, {
    query: {
      expand: "specimen,specimen.locality,specimen.locality.country,specimen.collection,specimen.stratigraphy,database,licence,locality,locality.country,author,digitised_by,type,imageset,mime_type,reference",
      fields: [
        "id",
        "filename",
        "image_height",
        "image_width",
        "image_latitude",
        "image_longitude",
        "image_place",
        "image_scalebar",
        "image_number",
        "image_people",
        "description",
        "description_en",
        "date_digitised",
        "date_digitised_text",
        "locality.name",
        "locality.name_en",
        "locality.latitude",
        "locality.longitude",
        "locality.country.iso_3166_1_alpha_2",
        "digitised_by.name",
        "type.id",
        "type.value",
        "type.value_en",
        "licence.name",
        "licence.url",
        "author.name",
        "author_text",
        "remarks",
        "date_created",
        "date_created_text",
        "date_added",
        "date_changed",
        "specimen.id",
        "specimen.number",
        "specimen.locality.id",
        "specimen.locality.name",
        "specimen.locality.name_en",
        "specimen.locality.latitude",
        "specimen.locality.longitude",
        "specimen.locality.country.iso_3166_1_alpha_2",
        "specimen.collection.id",
        "specimen.collection.number",
        "specimen.stratigraphy.id",
        "specimen.stratigraphy.name",
        "specimen.stratigraphy.name_en",
        "database.id",
        "database.acronym",
        "database.name",
        "database.name_en",
        "database.url",
        "imageset.number",
        "imageset.description",
        "mime_type.content_type",
        "reference.reference",
        "specimen_image_attachment",
      ].join(","),
    },
    onResponseError: (_error) => {
      showError({
        statusCode: 404,
        message: t("error.notFound"),
      });
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { file } },
  });

  return {
    file,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "relations",
    ]),
  };
}, {
  default: () => ({
    file: null,
    tabs: [] as HydratedTab[],
  }),
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
const file = computed(() => data.value?.file);

const title = computed(() => {
  if (!file.value)
    return "";
  switch (file.value.specimen_image_attachment) {
    case 1:
      return `${file.value?.specimen?.collection?.number?.split(" ")?.[0]} ${
        file.value?.specimen?.number
      } (ID: ${file.value?.specimen?.id})`;
    case 2:
      return file.value?.image_number;
    case 4:
      return file.value?.reference?.reference;
    default:
      return `${
        $translate({
          et: file.value?.description,
          en: file.value?.description_en,
        }) ?? file.value?.id
      }`;
  }
});
const pageType = computed(() => {
  if (!file.value)
    return "";
  switch (file.value.specimen_image_attachment) {
    case 1:
      return t("file.specimenTitle");
    case 2:
      return t("file.imageTitle");
    case 4:
      return t("file.referenceTitle");
    default:
      return t("file.fileTitle");
  }
});
const pageTitle = computed(() => `${title.value} | ${pageType.value}`);
const isImage = computed(() => file.value?.mime_type?.content_type.includes("image"));
const isAudio = computed(() => file.value?.mime_type?.content_type.includes("audio"));
const isVideo = computed(() => file.value?.mime_type?.content_type.includes("video"));

useHead({
  title: pageTitle.value,
});
const img = useImage();

useSeoMeta({
  ogImage: isImage.value
    ? img(
        `${file.value?.filename}`,
        { size: "medium" },
        {
          provider: "geocollections",
        },
    )
    : null,
  ogVideo: isVideo.value
    ? `https://files.geocollections.info/${file.value?.filename}`
    : null,
  ogAudio: isAudio.value
    ? `https://files.geocollections.info/${file.value?.filename}`
    : null,
});
</script>

<template>
  <TemplateDetail
    :show-similar="false"
  >
    <template #title>
      <HeaderDetail
        :title="pageTitle"
      >
        <template #prepend>
          <VChip
            class="text-none"
            variant="tonal"
            color="accent"
            label
          >
            <VIcon start>
              {{ mdiFile }}
            </VIcon>
            {{ $t("common.file") }}
          </VChip>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data.tabs" />
        </template>
      </HeaderDetail>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </TemplateDetail>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

video {
  max-width: 100%;
  vertical-align: middle;
}

.file-download {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-style: dashed;
  background-color: #eee;
  border-color: #5c6598;
  transition: opacity 200ms ease;
}

.file-download:hover {
  opacity: 0.8;
  cursor: pointer;
}
</style>
