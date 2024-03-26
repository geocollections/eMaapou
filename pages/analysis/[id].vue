<script setup lang="ts">
import { mdiImageFilterHdr } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const { $geoloogiaFetch, $solrFetch, $translate } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const analysesStore = useAnalyses();
const { getQueryParams: getQueryParamsAnalysis } = analysesStore;
const { solrFilters: analysisSolrFilters, solrQuery: analysisSolrQuery, solrSort: analysisSolrSort }
  = storeToRefs(analysesStore);

const analyticalDataStore = useAnalyticalData();
const { getQueryParams: getQueryParamsAnalyticalData } = analyticalDataStore;
const { solrFilters: analyticalDataSolrFilters, solrQuery: analyticalDataSolrQuery, solrSort: analyticalDataSolrSort }
  = storeToRefs(analyticalDataStore);

const searchPositionStore = useSearchPosition();
const { searchModule } = storeToRefs(searchPositionStore);

const searchUrl = computed(() => {
  if (searchModule.value === "analyticalData")
    return "/analytical_data";

  return "/analysis";
});

const searchParams = computed(() => {
  if (searchModule.value === "analyticalData") {
    return {
      query: analyticalDataSolrQuery,
      filter: analyticalDataSolrFilters,
      sort: analyticalDataSolrSort,
    };
  }

  return {
    query: analysisSolrQuery,
    filter: analysisSolrFilters,
    sort: analysisSolrSort,
  };
});

const {
  data: analysesRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer(searchUrl.value, {
  routeName: "analysis-id",
  solrParams: searchParams.value,
});

const similarAnalysis = computed(() => analysesRes.value?.response.docs ?? []);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const tabs = {
  general: {
    type: "static",
    routeName: "analysis-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  analysis_results: {
    type: "dynamic",
    routeName: "analysis-id-results",
    title: "analysis.results",
    count: async () => {
      const res = await $solrFetch("/analysis_results", {
        query: {
          q: `analysis_id:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  attachments: {
    type: "dynamic",
    routeName: "analysis-id-attachments",
    title: "analysis.attachments",
    count: async () => {
      const res = await $geoloogiaFetch("/attachment_link/", {
        query: {
          analysis: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
};

const { data, pending, error } = await useAsyncData("analysis", async () => {
  const analysis = await $geoloogiaFetch(`/analysis/${route.params.id}/`, {
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
    props: {
      general: { analysis },
    },
  });

  return {
    analysis,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "analysis_results",
      "attachments",
    ]),
  };
});

const pageTitle = computed(() =>
  t("analysis.title", {
    method: $translate({
      et: data.value?.analysis.analysis_method?.analysis_method,
      en: data.value?.analysis.analysis_method?.method_en,
    }),
    sample: data.value?.analysis.sample?.number,
  }),
);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "analysis-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

useHead({
  title: `${pageTitle.value} | ${t("analysis.pageTitle")}`,
});

const searchRoute = computed(() => {
  if (searchModule.value === "analyticalData") {
    return localePath({
      path: "/analytical-data",
      query: getQueryParamsAnalyticalData(),
    });
  }

  return localePath({
    path: "/analysis",
    query: getQueryParamsAnalysis(),
  });
});
</script>

<template>
  <DetailNew :show-similar="showDrawer">
    <template #title>
      <HeaderDetailNew :title="pageTitle">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarAnalysis"
        :total-results="analysesRes?.response.numFound ?? 0"
        :search-route="
          searchRoute
        "
        :get-result-route="
          (item) => localePath({ name: 'analysis-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: analysis }">
          <div class="font-weight-medium">
            {{ analysis.id }}
          </div>
        </template>
        <template #itemSubtitle="{ item: analysis }">
          <div v-if="analysis.sample_name" class="d-flex align-center">
            <VIcon start size="small">
              {{ mdiImageFilterHdr }}
            </VIcon>
            <span class="text--secondary">
              {{ analysis.sample_name }}
            </span>
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </DetailNew>
</template>
