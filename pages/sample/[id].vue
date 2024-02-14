<template>
  <detail-new :show-similar="searchPosition > -1">
    <template #title>
      <header-detail-new :title="pageTitle">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </header-detail-new>
    </template>
    <NuxtPage v-bind="activeTabProps" />
    <template #drawer>
      <v-btn
        variant="plain"
        class="text-capitalize mx-2"
        :prepend-icon="mdiArrowUpLeft"
        :to="localePath({ path: '/sample', query: getQueryParams() })"
      >
        Back to search
      </v-btn>
      <div class="d-flex align-center justify-space-around">
        <v-btn
          variant="plain"
          size="small"
          :icon="mdiChevronLeft"
          :disabled="page <= 1"
          @click="page--"
        />
        {{ page }}
        <v-btn
          variant="plain"
          size="small"
          :icon="mdiChevronRight"
          :disabled="!hasNext"
          @click="page++"
        />
      </div>
      <v-list>
        <template v-for="(sample, index) in similarSamples">
          <v-list-item
            class="pa-2 ma-1 text-body-2"
            elevation="0"
            rounded
            :to="localePath({ name: 'sample-id', params: { id: sample.id } })"
            active-class="active-item"
          >
            <template v-if="sample.depth" #subtitle>
              <div class="d-flex align-center">
                <v-icon start size="small">{{ mdiRuler }}</v-icon>
                <span class="text--secondary">
                  {{ getDepthRange(sample) }}
                </span>
              </div>
            </template>
            <template #title>
              <div class="font-weight-medium">
                {{ sample.number ?? sample.id }}
              </div>
            </template>
            <template #append="{ isActive }">
              <v-icon v-if="isActive" color="accent">
                {{ mdiCheck }}
              </v-icon>
            </template>
          </v-list-item>
          <v-divider class="mx-1" v-if="index !== perPage - 1" />
        </template>
      </v-list>
    </template>
  </detail-new>
</template>

<script setup lang="ts">
import {
  mdiRuler,
  mdiCheck,
  mdiChevronLeft,
  mdiChevronRight,
  mdiArrowUpLeft,
} from "@mdi/js";
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
    id: "sample_reference",
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
const samplesStore = useSamples();
const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const { getQueryParams } = samplesStore;
const { solrFilters, solrQuery, solrSort, searchPosition, fromSearch } =
  storeToRefs(samplesStore);

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const perPage = 10;

const page = ref(
  !fromSearch ? 1 : Math.floor(searchPosition.value / perPage) + 1,
);

const hasNext = computed(
  () => page.value * perPage < (samplesRes.value?.response.numFound ?? 0),
);

const { data: samplesRes } = await useSolrFetch("/sample", {
  query: computed(() => ({
    q: solrQuery.value,
    rows: perPage,
    start: (page.value - 1) * perPage,
    sort: solrSort.value,
    json: {
      filter: [...solrFilters.value],
    },
  })),
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
