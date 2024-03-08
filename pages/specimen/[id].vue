<script setup lang="ts">
import { mdiContentCopy } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const route = useRoute();
const localePath = useLocalePath();
const { $geoloogiaFetch, $solrFetch, $translate } = useNuxtApp();

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
    isSolr: false,
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
  },
};

const { data } = await useAsyncData("specimen", async () => {
  const specimen = await $geoloogiaFetch<any>(`/specimen/${route.params.id}/`, {
    query: {
      nest: 2,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Specimen not found",
        });
      }
    },
  });

  const specimenNameRes = await $solrFetch(
    `/specimen`,
    {
      query: {
        q: `id:${route.params.id}`,
      },
    },
  );
  const specimenAlt = specimenNameRes?.response.docs[0];

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { specimen, specimenAlt } },
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
  };
}, {
  default: () => ({
    specimen: null,
    specimenAlt: null,
    tabs: [] as HydratedTab[],
  }),
});

const isRock = computed(() => !!data.value.specimenAlt?.rock);
const isTaxon = computed(() => !!data.value.specimenAlt?.taxon);
const title = computed(
  () =>
        `${data.value.specimen?.database?.acronym} ${data.value.specimen?.specimen_id}`,
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

// export default defineComponent({
//   setup() {
//     const title = computed(
//       () =>
//         `${data.value.specimen?.database?.acronym} ${data.value.specimen?.specimen_id}`,
//     );
//     const titleAlt = computed(() => {
//       if (data.value.specimenAlt?.rock) {
//         const defaultName = $translate({
//           et: data.value.specimenAlt.rock,
//           en: data.value.specimenAlt.rock_en,
//         });
//         return data.value.specimenAlt.rock_txt
//           && data.value.specimenAlt.rock_txt.length > 0
//           ? data.value.specimenAlt.rock_txt[0]
//           : defaultName;
//       }
//       if (data.value.specimenAlt?.taxon)
//         return data.value.specimenAlt.taxon;
//
//       return null;
//     });
//     useRedirectInvalidTabRoute({
//       pending: toRef(fetchState, "pending"),
//       tabs: toRef(data.value, "tabs"),
//       watchableObject: toRef(data.value, "specimen"),
//       validRoute: toRef(data.value, "validRoute"),
//     });
//
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t("specimen.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             hid: "og:title",
//             content: `${title.value} | ${i18n.t("specimen.pageTitle")}`,
//           },
//           {
//             property: "og:image",
//             hid: "og:image",
//             content: data.value.images[0]?.filename
//               ? $img(
//                   `${data.value.images[0]?.filename}`,
//                   { size: "small" },
//                   {
//                     provider: "geocollections",
//                   },
//               )
//               : "",
//           },
//         ],
//       };
//     });
//
//     const icons = computed(() => {
//       return {
//         mdiContentCopy,
//       };
//     });
//     return {
//       ...toRefs(data.value),
//       title,
//       titleAlt,
//       isRock,
//       isTaxon,
//       dateCollected,
//       coll,
//       type,
//       classification,
//       locality,
//       stratigraphy,
//       lithostratigraphy,
//       agentCollected,
//       database,
//       sample,
//       parent,
//       icons,
//     };
//   },
//   head: {},
// });
</script>

<template>
  <DetailNew :show-similar="false">
    <template #title>
      <HeaderDetailNew class="mb-0">
        <div>
          {{ title }}
        </div>
        <VDivider
          v-if="titleAlt"
          class="mx-4"
          vertical
        />
        <a
          v-if="isRock && titleAlt"
          target="_blank"
          style="text-decoration: none"
          :href="`https://kivid.info/${data.specimenAlt?.rock_id}`"
        >{{ titleAlt }}</a>
        <a
          v-if="isTaxon && titleAlt"
          target="_blank"
          class="text-grey-darken-2"
          style="text-decoration: none"
          :href="`https://fossiilid.info/${data.specimenAlt?.taxon_id}`"
        >{{ titleAlt }}</a>
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
  </DetailNew>
</template>
