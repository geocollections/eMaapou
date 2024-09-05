<script setup lang="ts">
import type { Tab } from "~/composables/useTabs";

const { $translate, $apiFetch, $solrFetch } = useNuxtApp();
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

export interface Collection {
  id: number;
  number: string;
  name: string;
  name_en: string;
  name_long: string;
  name_long_en: string;
  classification: Nullable<{
    name: string;
  }>;
  number_objects: Nullable<number>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
  database: Nullable<{
    id: number;
    name: string;
    name_en: string;
    url: string;
  }>;
  reference: Nullable<{
    id: number;
    reference: string;
  }>;
  remarks: Nullable<string>;
}

const { data } = await useAsyncData("collection", async () => {
  const collection = await $apiFetch<Collection>(`/collections/${route.params.id}/`, {
    query: {
      expand: "classification,database,reference",
      fields: [
        "id",
        "number",
        "name",
        "name_en",
        "name_long",
        "name_long_en",
        "classification.name",
        "number_objects",
        "date_added",
        "date_changed",
        "database.id",
        "database.name",
        "database.name_en",
        "database.url",
        "reference.id",
        "reference.reference",
        "remarks",
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
</script>

<template>
  <TemplateDetail :show-similar="false">
    <template #title>
      <HeaderDetail :title="title">
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
        <template #titleAppend>
          <EditButton :id="route.params.id as string" module="collection" />
        </template>
      </HeaderDetail>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </TemplateDetail>
</template>
