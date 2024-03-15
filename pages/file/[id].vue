<script setup lang="ts">
const { $geoloogiaFetch, $translate } = useNuxtApp();
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
};

const { data, pending, error } = await useAsyncData("data", async () => {
  const file = await $geoloogiaFetch(`/attachment/${route.params.id}/`, {
    query: {
      nest: 2,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "File not found",
        });
      }
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { file } },
  });

  return {
    file,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
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
// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: pageTitle.value,
//         meta: [
//           {
//             property: "og:title",
//             hid: "og:title",
//             content: pageTitle.value,
//           },
//           {
//             property: "og:url",
//             hid: "og:url",
//             content: route.value.path,
//           },
//           ...[
//             {
//               property: "og:image",
//               hid: "og:image",
//               content: isImage.value
//                 ? $img(
//                     `${file.value.filename}`,
//                     { size: "small" },
//                     {
//                       provider: "geocollections",
//                     },
//                   )
//                 : "",
//             },
//             {
//               property: "og:video",
//               hid: "og:video",
//               content: isVideo.value
//                 ? `https://files.geocollections.info/${file.value.uuid_filename}`
//                 : "",
//             },
//             {
//               property: "og:audio",
//               hid: "og:audio",
//               content: isAudio.value
//                 ? `https://files.geocollections.info/${file.value.uuid_filename}`
//                 : "",
//             },
//           ],
//         ],
//       };
//     });
// });
</script>

<template>
  <DetailNew
    :show-similar="false"
  >
    <template #title>
      <HeaderDetailNew
        :title="pageTitle"
      >
        <template #tabs>
          <DetailTabs :tabs="data.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </DetailNew>
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
