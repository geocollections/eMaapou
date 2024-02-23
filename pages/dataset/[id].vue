<script setup lang="ts">
import type { Tab } from "~/composables/useTabs";

const { $geoloogiaFetch, $solrFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();

const datasetsStore = useDatasets();
const { getQueryParams } = datasetsStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(datasetsStore);

const {
  data: datasetsRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/dataset", {
  routeName: "dataset-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});
const similarDatasets = computed(() => datasetsRes.value?.response.docs ?? []);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
const tabs = {
  general: {
    type: "static",
    routeName: "dataset-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  sample_results: {
    type: "dynamic",
    routeName: "dataset-id-samples",
    title: "dataset.sampleResults",
    count: async () => {
      const res = await $solrFetch("/sample_data", {
        query: {
          q: `dataset_ids:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  graphs: {
    type: "dynamic",
    routeName: "dataset-id-graphs",
    title: "locality.graphs",
    count: async () => {
      const res = await $solrFetch("/analysis_results", {
        query: {
          q: `dataset_ids:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  dataset_analysis: {
    type: "dynamic",
    routeName: "dataset-id-analyses",
    title: "dataset.analyses",
    count: async () => {
      const res = await $solrFetch("/analytical_data", {
        query: {
          q: `dataset_ids:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  dataset_reference: {
    type: "dynamic",
    routeName: "dataset-id-references",
    title: "dataset.references",
    count: async () => {
      const res = await $geoloogiaFetch("/dataset_reference/", {
        query: {
          dataset: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  attachment_link: {
    type: "dynamic",
    routeName: "dataset-id-attachments",
    title: "dataset.attachments",
    count: async () => {
      const res = await $geoloogiaFetch("/attachment_link/", {
        query: {
          dataset: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  dataset_author: {
    type: "dynamic",
    routeName: "dataset-id-authors",
    title: "dataset.authors",
    count: async () => {
      const res = await $geoloogiaFetch("/dataset_author/", {
        query: {
          dataset: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  dataset_geolocation: {
    type: "dynamic",
    routeName: "dataset-id-geolocations",
    title: "dataset.geolocations",
    count: async () => {
      const res = await $geoloogiaFetch("/dataset_geolocation/", {
        query: {
          dataset: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
};

const { data } = await useAsyncData("dataset", async () => {
  const dataset = await $geoloogiaFetch(`/dataset/${route.params.id}/`, {
    query: {
      nest: 1,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Dataset not found",
        });
      }
    },
  });

  const parametersResponse = await $solrFetch("/dataset", {
    query: {
      q: `id:${route.params.id}`,
      fl: "parameter_index_list,parameter_list",
    },
  });

  // hydratedTabsByIds.graphs.count =
  //   locationMarkers.length === 1 ? locationMarkers.length : 0;

  const parameterValues
    = parametersResponse.response.docs[0]?.parameter_index_list?.[0]?.split("; ");
  const parameterText
    = parametersResponse.response.docs[0]?.parameter_list?.[0]?.split("; ");

  const parameters
    = parameterValues?.map((v: string, i: number) => {
      return { text: parameterText[i], value: v };
    }) ?? [];

  const parameterHeaders = {
    byIds: parameters.reduce((prev, parameter) => {
      return { ...prev, [parameter.value]: { ...parameter, show: true } };
    }, {}),
    allIds: parameterValues,
  };
  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
      general: { dataset, parameters },
      sample_results: { parameterHeaders },
      graphs: { dataset },
    },
  });

  return {
    dataset,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "sample_results",
      "graphs",
      "dataset_analysis",
      "dataset_reference",
      "attachment_link",
      "dataset_author",
      "dataset_geolocation",
    ]),
  };
});
const title = computed(() => data.value?.dataset.title);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "dataset-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${title.value}| ${i18n.t("dataset.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             content: `${title.value}| ${i18n.t("dataset.pageTitle")}`,
//             hid: "og:title",
//           },
//           {
//             property: "og:description",
//             content: data.value?.dataset.abstract,
//             hid: "og:description",
//           },
//           {
//             property: "description",
//             content: data.value?.dataset.abstract,
//             hid: "description",
//           },
//         ],
//       };
//     });
//   },
// });
//
</script>

<template>
  <detail-new :show-similar="showDrawer">
    <template #title>
      <header-detail-new :title="data?.dataset.title">
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </header-detail-new>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarDatasets"
        :total-results="datasetsRes?.response.numFound ?? 0"
        :search-route="
          localePath({ path: '/dataset', query: getQueryParams() })
        "
        :get-result-route="
          (item) => localePath({ name: 'dataset-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: dataset }">
          <div class="font-weight-medium text-wrap">
            {{ dataset.title }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>

    <NuxtPage v-bind="activeTabProps" />
  </detail-new>
</template>

<style lang="scss" scoped>
.active-tab {
  background-color: rgb(var(--v-theme-grey-lighten3)) !important;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: var(--v-theme-accent-lighten2) !important;

  &:before {
    background-color: white !important;
  }
}
</style>
