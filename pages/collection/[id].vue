<script setup lang="ts">
import type { Tab } from "~/composables/useTabs";

const { $translate, $geoloogiaFetch, $solrFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();
const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const tabs = {
  general: {
    type: "static",
    routeName: "collection-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  specimen: {
    type: "dynamic",
    routeName: "collection-id-specimens",
    title: "collection.specimens",
    count: async (_ctx) => {
      const res = await $solrFetch("/specimen", {
        query: {
          q: `collection_id:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
};

const { data } = await useAsyncData("collection", async () => {
  const collection = await $geoloogiaFetch<any>(`/collection/${route.params.id}/`, {
    query: {
      nest: 1,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Collection not found",
        });
      }
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
      general: { collection },
    },
  });

  return {
    collection,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "specimen",
    ]),
  };
}, {
  default: () => ({
    collection: null,
    tabs: [],
  }),
});
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
const title = computed(() =>
  $translate({
    et: data.value?.collection?.name,
    en: data.value?.collection?.name_en,
  }),
);
redirectInvalidTab({
  redirectRoute: localePath({
    name: "collection-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

const { t } = useI18n();

useHead({
  title: `${title.value} | ${t("collection.pageTitle")}`,
});
</script>

<template>
  <DetailNew>
    <template #title>
      <HeaderDetailNew :title="title">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </DetailNew>
</template>
