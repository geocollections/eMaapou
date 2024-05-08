<script setup lang="ts">
import { mdiFile } from "@mdi/js";

const { $geoloogiaFetch, $translate, $solrFetch } = useNuxtApp();
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

const { data } = await useAsyncData("data", async () => {
  const file = await $geoloogiaFetch<any>(`/attachment/${route.params.id}/`, {
    query: {
      nest: 2,
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
      return `${file.value?.specimen?.coll?.number?.split(" ")?.[0]} ${
        file.value?.specimen?.specimen_id
      } (ID: ${file.value?.specimen.id})`;
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
const isImage = computed(() => file.value.attachment_format.includes("image"));
const isAudio = computed(() => file.value.attachment_format.includes("audio"));
const isVideo = computed(() => file.value.attachment_format.includes("video"));

useHead({
  title: pageTitle.value,
});
const img = useImage();

useSeoMeta({
  ogImage: isImage.value
    ? img(
        `${file.value.filename}`,
        { size: "medium" },
        {
          provider: "geocollections",
        },
    )
    : null,
  ogVideo: isVideo.value
    ? `https://files.geocollections.info/${file.value.uuid_filename}`
    : null,
  ogAudio: isAudio.value
    ? `https://files.geocollections.info/${file.value.uuid_filename}`
    : null,
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout
    name="detail"
    :show-similar="false"
  >
    <template #title>
      <HeaderDetailNew
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
      </HeaderDetailNew>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </NuxtLayout>
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
