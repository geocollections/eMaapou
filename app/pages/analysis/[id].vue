<script setup lang="ts">
import { mdiImageFilterHdr, mdiTestTube } from "@mdi/js";
import type { HydratedTab, Tab } from "~/composables/useTabs";

const { $geoloogiaFetch, $solrFetch, $translate, $apiFetch } = useNuxtApp();
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

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

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
      const res = await $solrFetch<SolrResponse>("/analysis_results", {
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
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
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

export interface Analysis {
  id: number;
  analysis_method: {
    name: string;
    name_en: string;
  };
  analyst: Nullable<{
    name: string;
  }>;
  sample: Nullable<{
    id: number;
    number: Nullable<string>;
    locality: Nullable<{
      id: number;
      name: string;
      name_en: string;
    }>;
    depth: Nullable<number>;
    depth_interval: Nullable<number>;
    stratigraphy: Nullable<{
      id: number;
      name: string;
      name_en: string;
    }>;
    lithostratigraphy: Nullable<{
      id: number;
      name: string;
      name_en: string;
    }>;
  }>;
  remarks: Nullable<string>;
  reference: Nullable<{
    id: number;
    reference: string;
  }>;
  database: Nullable<{
    id: number;
    name: string;
    name_en: string;
    url: string;
  }>;
  dataset: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
}

const { data } = await useAsyncData("analysis", async () => {
  const analysis = await $apiFetch<Analysis>(`/analyses/${route.params.id}/`, {
    query: {
      expand: "analysis_method,analyst,sample,sample.locality,sample.stratigraphy,sample.lithostratigraphy,reference,database,dataset",
      fields: [
        "id",
        "analysis_method.name",
        "analysis_method.name_en",
        "analyst.name",
        "sample.id",
        "sample.number",
        "sample.locality.id",
        "sample.locality.name",
        "sample.locality.name_en",
        "sample.depth",
        "sample.depth_interval",
        "sample.stratigraphy.id",
        "sample.stratigraphy.name",
        "sample.stratigraphy.name_en",
        "sample.lithostratigraphy.id",
        "sample.lithostratigraphy.name",
        "sample.lithostratigraphy.name_en",
        "remarks",
        "reference.id",
        "reference.reference",
        "database.id",
        "database.name",
        "database.name_en",
        "database.url",
        "dataset.id",
        "dataset.name",
        "dataset.name_en",
        "date_added",
        "date_changed",
      ].join(","),
    },
    onResponseError: (_error) => {
      showError({
        statusCode: 404,
        message: t("error.notFound"),
        fatal: true,
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
}, {
  default: () => ({
    analysis: null,
    tabs: [] as HydratedTab[],
  }),
});

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

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const pageTitle = computed(() =>
  t("analysis.title", {
    method: $translate({
      et: data.value?.analysis?.analysis_method.name,
      en: data.value?.analysis?.analysis_method.name_en,
    }),
    sample: data.value?.analysis?.sample?.number ?? data.value?.analysis?.sample?.id,
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
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail :title="pageTitle">
        <template #prepend>
          <CategoryChip
            :title="$t('common.analysis')"
            :to="localePath({ path: '/analysis', query: getQueryParamsAnalysis() })"
            :icon="mdiTestTube"
          />
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
        <template #titleAppend>
          <EditButton :id="route.params.id as string" module="analysis" />
        </template>
      </HeaderDetail>
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
  </TemplateDetail>
</template>
