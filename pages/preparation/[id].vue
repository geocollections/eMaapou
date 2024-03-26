<script setup lang="ts">
import type { HydratedTab, Tab } from "~/composables/useTabs";

const { $geoloogiaFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();

const preparationsStore = usePreparations();
const { getQueryParams } = preparationsStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(preparationsStore);
const {
  data: preparationsRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/preparation", {
  routeName: "preparation-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});
const similarPreparations = computed(
  () => preparationsRes.value?.response.docs ?? [],
);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const tabs = {
  general: {
    type: "static",
    routeName: "preparation-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  attachment: {
    type: "dynamic",
    routeName: "preparation-id-attachments",
    title: "preparation.attachments",
    count: async () => {
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
        query: {
          preparation: route.params.id,
          limit: 0,
        },
      });

      return response.count;
    },
    props: {},
  } satisfies Tab,
  taxon: {
    type: "dynamic",
    routeName: "preparation-id-taxa",
    title: "preparation.taxa",
    count: async () => {
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/taxon_list/", {
        query: {
          preparation: route.params.id,
          limit: 0,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
};

const { data } = await useAsyncData("preparation", async () => {
  const preparation = await $geoloogiaFetch<any>(`/preparation/${route.params.id}`, {
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
    props: { general: { preparation } },
  });

  return {
    preparation,
    tabs: filterHydratedTabs(hydratedTabs, ["general", "attachment", "taxon"]),
  };
}, {
  default: () => ({
    preparation: null,
    tabs: [] as HydratedTab[],
  }),
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value.tabs);
});

const title = computed(() => data.value.preparation?.preparation_number);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "preparation-id",
    params: { id: route.params.id },
  }),
  tabs: data.value.tabs,
});

const { t } = useI18n();

useHead({
  title: `${title.value} | ${t("preparation.pageTitle")}`,
});
</script>

<template>
  <DetailNew :show-similar="showDrawer">
    <template #title>
      <HeaderDetailNew :title="title">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarPreparations"
        :total-results="preparationsRes?.response.numFound ?? 0"
        :search-route="localePath({ path: '/preparation', query: getQueryParams() })
        "
        :get-result-route="(item) =>
          localePath({ name: 'preparation-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: preparation }">
          <div class="font-weight-medium">
            {{ preparation.preparation_number ?? preparation.id }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </DetailNew>
</template>
