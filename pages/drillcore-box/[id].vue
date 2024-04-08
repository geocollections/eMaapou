<script setup lang="ts">
import { mdiArchive } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const { $geoloogiaFetch, $translate, $solrFetch } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const pageTitle = computed(
  () =>
    `${t("drillcoreBox.nr", {
      number: data.value?.drillcoreBox.number,
    })} - ${$translate({
      et: data.value?.drillcoreBox.drillcore?.drillcore,
      en: data.value?.drillcoreBox.drillcore?.drillcore_en,
    })}`,
);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const tabs = {
  general: {
    type: "static",
    routeName: "drillcore-box-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  sample: {
    type: "dynamic",
    routeName: "drillcore-box-id-samples",
    title: "drillcore.samples",
    count: async (ctx) => {
      if (!ctx?.drillcoreBox.drillcore?.locality)
        return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;
      const response = await $solrFetch("/sample", {
        query: {
          q: `locality_id:${ctx.drillcoreBox.drillcore.locality} AND (depth:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}] OR depth_interval:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}])`,
          rows: 0,
        },
      });

      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
  analysis: {
    type: "dynamic",
    routeName: "drillcore-box-id-analyses",
    title: "drillcore.analyses",
    count: async (ctx) => {
      if (!ctx?.drillcoreBox.drillcore?.locality)
        return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;

      const response = await $solrFetch("/analysis", {
        query: {
          q: `locality_id:${ctx.drillcoreBox.drillcore.locality} AND (depth:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}] OR depth_interval:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}])`,
          rows: 0,
        },
      });

      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
  specimen: {
    type: "dynamic",
    routeName: "drillcore-box-id-specimens",
    title: "drillcore.specimens",
    count: async (ctx) => {
      if (!ctx?.drillcoreBox.drillcore?.locality)
        return 0;
      if (!ctx?.drillcoreBox.depth_start || !ctx?.drillcoreBox.depth_end)
        return 0;

      const response = await $solrFetch("/specimen", {
        query: {
          q: `locality_id:${ctx.drillcoreBox.drillcore.locality} AND (depth:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}] OR depth_interval:[${ctx.drillcoreBox.depth_start} TO ${ctx.drillcoreBox.depth_end}])`,
          rows: 0,
        },
      });

      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
};

const { data, pending, error } = await useAsyncData(
  "drillcore-box",
  async () => {
    const drillcoreBox = await $geoloogiaFetch(
      `/drillcore_box/${route.params.id}/`,
      {
        query: {
          nest: 1,
        },
        onResponseError: (_error) => {
          showError({
            statusCode: 404,
            message: t("error.notFound"),
          });
        },
      },
    );

    const hydratedTabs = await hydrateTabs(tabs, {
      props: {
        general: { drillcoreBox },
        sample: {
          locality: drillcoreBox.drillcore.locality,
          depthStart: drillcoreBox.depth_start,
          depthEnd: drillcoreBox.depth_end,
        },
        analysis: {
          locality: drillcoreBox.drillcore.locality,
          depthStart: drillcoreBox.depth_start,
          depthEnd: drillcoreBox.depth_end,
        },
        specimen: {
          locality: drillcoreBox.drillcore.locality,
          depthStart: drillcoreBox.depth_start,
          depthEnd: drillcoreBox.depth_end,
        },
      },
      ctx: { drillcoreBox },
    });
    const attachmentLinks = await $geoloogiaFetch("/attachment_link/", {
      query: {
        drillcore_box: route.params.id,
        nest: 2,
        ordering: "-attachment__is_preferred",
      },
    });

    const drillcoreBoxImages = attachmentLinks.results;
    const activeImage = drillcoreBoxImages[0];

    return {
      drillcoreBox,
      tabs: filterHydratedTabs(hydratedTabs, [
        "general",
        "sample",
        "analysis",
        "specimen",
      ]),
      activeImage,
    };
  },
);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "drillcore-box-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

useHead({
  title: `${pageTitle.value} | ${t("drillcoreBox.pageTitle")}`,
});

const img = useImage();
useSeoMeta({
  ogImage: img(
    data.value?.activeImage?.attachment?.uuid_filename,
    { size: "medium" },
    {
      provider: "geocollections",
    },
  ),
});
definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="detail" :show-similar="false">
    <template #title>
      <HeaderDetailNew :title="pageTitle">
        <template #prepend>
          <VChip
            class="text-none"
            variant="tonal"
            color="accent"
            label
          >
            <VIcon start>
              {{ mdiArchive }}
            </VIcon>
            {{ $t("common.drillcoreBox") }}
          </VChip>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </NuxtLayout>
</template>
