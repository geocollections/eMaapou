<template>
  <detail-new :show-similar="showDrawer">
    <template #title>
      <header-detail-new :title="pageTitle">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </header-detail-new>
    </template>
    <NuxtPage v-bind="activeTabProps" />
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarSamples"
        :total-results="samplesRes?.response.numFound ?? 0"
        :search-route="localePath({ path: '/sample', query: getQueryParams() })"
        :get-result-route="
          (item) => localePath({ name: 'sample-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: sample }">
          <div class="font-weight-medium">
            {{ sample.number ?? sample.id }}
          </div>
        </template>
        <template #itemSubtitle="{ item: sample }">
          <div v-if="sample.depth" class="d-flex align-center">
            <v-icon start size="small">{{ mdiRuler }}</v-icon>
            <span class="text--secondary">
              {{ getDepthRange(sample) }}
            </span>
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
  </detail-new>
</template>

<script setup lang="ts">
import { mdiRuler } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";
const { $geoloogiaFetch, $solrFetch } = useNuxtApp();
const tabs = {
  general: {
    type: "static",
    routeName: "sample-id",
    title: "sample.general",
    props: {},
  } satisfies Tab,
  analysis: {
    type: "dynamic",
    routeName: "sample-id-analyses",
    title: "sample.analyses",
    count: async () => {
      return $solrFetch("/analysis", {
        query: {
          q: `sample_id:${route.params.id}`,
          rows: 0,
        },
      }).then((res) => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
  preparation: {
    type: "dynamic",
    routeName: "sample-id-preparations",
    title: "sample.preparations",
    count: async () => {
      return $solrFetch("/preparation", {
        query: {
          q: `sample_id:${route.params.id}`,
          rows: 0,
        },
      }).then((res) => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
  taxon: {
    type: "dynamic",
    routeName: "sample-id-taxa",
    title: "sample.taxa",
    count: async () => {
      return $geoloogiaFetch("/taxon_list/", {
        query: {
          sample: route.params.id,
          limit: 0,
        },
      }).then((res) => res.count);
    },
    props: {},
  } satisfies Tab,
  attachments: {
    type: "dynamic",
    routeName: "sample-id-attachments",
    title: "sample.attachments",
    count: async () => {
      return $geoloogiaFetch("/attachment_link/", {
        query: {
          sample: route.params.id,
          limit: 0,
        },
      }).then((res) => res.count);
    },
    props: {},
  } satisfies Tab,
  reference: {
    type: "dynamic",
    routeName: "sample-id-references",
    title: "sample.sampleReferences",
    count: async () => {
      return $geoloogiaFetch("/sample_reference/", {
        query: {
          sample: route.params.id,
          limit: 0,
        },
      }).then((res) => res.count);
    },
    props: {},
  } satisfies Tab,
  analysisResults: {
    type: "dynamic",
    routeName: "sample-id-analysis-results",
    title: "sample.analysisResults",
    count: async () => {
      return $solrFetch("/analysis_results", {
        query: {
          q: `sample_id:${route.params.id}`,
          rows: 0,
        },
      }).then((res) => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
  graphs: {
    type: "dynamic",
    routeName: "sample-id-graphs",
    title: "locality.graphs",
    count: async () => {
      return $geoloogiaFetch("/taxon_list/", {
        query: {
          sample: route.params.id,
          limit: 0,
        },
      }).then((res) => res.count);
    },
    props: {},
  } satisfies Tab,
};

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const samplesStore = useSamples();
const { getQueryParams } = samplesStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(samplesStore);

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const {
  data: samplesRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/sample", {
  routeName: "sample-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});

const similarSamples = computed(() => samplesRes.value?.response.docs ?? []);

const { data } = await useAsyncData("sample", async () => {
  const sample = await $geoloogiaFetch(`/sample/${route.params.id}/`, {
    query: {
      nest: 2,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Sample not found",
        });
      }
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { sample }, graphs: { sampleObject: sample } },
  });

  return {
    sample,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "analysis",
      "preparation",
      "taxon",
      "attachments",
      "reference",
      "analysisResults",
      "graphs",
    ]),
  };
});

redirectInvalidTab({
  redirectRoute: localePath({
    name: "sample-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

const title = computed(() =>
  `${
    data.value?.sample?.number ||
    data.value?.sample?.number_additional ||
    data.value?.sample?.number_field ||
    data.value?.sample?.id
  }`.trim(),
);
const pageTitle = computed(() => `${t("sample.number")} ${title.value}`);

function getDepthRange(sample: any) {
  const depth = sample?.depth;
  const depthInterval = sample?.depth_interval;
  if (depth && depthInterval) {
    return `${depth} - ${depthInterval}`;
  }
  return depth;
}
</script>

<style scoped>
.active-item {
  background-color: rgba(var(--v-theme-accent-lighten-3), 0.2);
}
</style>
