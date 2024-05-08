<script setup lang="ts">
import type { Tab } from "~/composables/useTabs";

const { $translate, $geoloogiaFetch, $solrFetch } = useNuxtApp();
const route = useRoute();
const { t } = useI18n();
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
      const res = await $solrFetch<SolrResponse>("/specimen", {
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
    onResponseError: (_error) => {
      showError({
        statusCode: 404,
        message: t("error.notFound"),
      });
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

useHead({
  title: `${title.value} | ${t("collection.pageTitle")}`,
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="detail" :show-similar="false">
    <template #title>
      <HeaderDetailNew :title="title">
        <template #prepend>
          <VChip
            class="text-none"
            variant="tonal"
            color="accent"
            label
          >
            {{ $t("common.collection") }}
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
