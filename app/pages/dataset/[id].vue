<script setup lang="ts">
import { mdiDatabaseOutline } from "@mdi/js";
import type { HydratedTab, Tab } from "~/composables/useTabs";

const { $solrFetch, $apiFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const datasetsStore = useDatasets();
const { getQueryParams } = datasetsStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(datasetsStore);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
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
      const res = await $solrFetch<SolrResponse>("/sample_data", {
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
      const res = await $solrFetch<SolrResponse>("/analysis_results", {
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
      const res = await $solrFetch<SolrResponse>("/analytical_data", {
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
      const res = await $apiFetch<GeoloogiaListResponse>(`/datasets/${route.params.id}/dataset-references/`, {
        query: {
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
      const res = await $apiFetch<GeoloogiaListResponse>(`/datasets/${route.params.id}/attachments/`, {
        query: {
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
      const res = await $apiFetch<GeoloogiaListResponse>(`/datasets/${route.params.id}/dataset-authors/`, {
        query: {
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
      const res = await $apiFetch<GeoloogiaListResponse>(`/datasets/${route.params.id}/dataset-geolocations/`, {
        query: {
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
};

export interface Dataset {
  id: number;
  title: string;
  title_alternative: Nullable<string>;
  title_translated: Nullable<string>;
  owner: Nullable<{
    name: string;
  }>;
  owner_text: Nullable<string>;
  creators: Nullable<string>;
  publication_year: Nullable<string>;
  date: Nullable<string>;
  resource: Nullable<string>;
  publisher: Nullable<string>;
  subjects: Nullable<string>;
  language: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  abstract: Nullable<string>;
  methods: Nullable<string>;
  version: Nullable<string>;
  reference: Nullable<{
    id: number;
    reference: string;
  }>;
  locality: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  copyright_agent: Nullable<{
    name: string;
  }>;
  licence: Nullable<{
    id: number;
    name: string;
    name_en: string;
    url: Nullable<string>;
    url_en: Nullable<string>;
  }>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
}

const { data } = await useAsyncData("dataset", async () => {
  const dataset = await $apiFetch<Dataset>(`/datasets/${route.params.id}/`, {
    query: {
      expand: "language,locality,licence,reference,copyright_agent,owner",
      fields: [
        "id",
        "title",
        "title_alternative",
        "title_translated",
        "owner.name",
        "owner_text",
        "creators",
        "publication_year",
        "date",
        "resource",
        "publisher",
        "subjects",
        "language.id",
        "language.name",
        "language.name_en",
        "abstract",
        "methods",
        "version",
        "reference.id",
        "reference.reference",
        "locality.id",
        "locality.name",
        "locality.name_en",
        "licence.id",
        "licence.name",
        "licence.name_en",
        "licence.url",
        "licence.url_en",
        "copyright_agent.name",
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

  const parametersResponse = await $solrFetch<SolrResponse>("/dataset", {
    query: {
      q: `id:${route.params.id}`,
      fl: "parameter_index_list,parameter_list",
    },
  });

  const parameterValues
    = parametersResponse.response.docs[0]?.parameter_index_list?.[0]?.split("; ");
  const parameterText
    = parametersResponse.response.docs[0]?.parameter_list?.[0]?.split("; ");

  const parameters
    = parameterValues?.map((v: string, i: number) => {
      return { title: parameterText[i], value: v };
    }) ?? [];

  const parameterHeaders = {
    byIds: parameters.reduce((prev: { [key: string]: any }, parameter: any) => {
      return { ...prev, [parameter.value]: { ...parameter, show: true } };
    }, {} as { [key: string]: any }),
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
}, {
  default: () => ({
    dataset: null,
    tabs: [] as HydratedTab[],
  }),
});

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

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
const title = computed(() => data.value?.dataset?.title);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "dataset-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

useHead({
  title: `${title.value}| ${t("dataset.pageTitle")}`,
});

useSeoMeta({
  description: data.value?.dataset?.abstract,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail :title="data?.dataset?.title">
        <template #prepend>
          <CategoryChip
            :title="$t('common.dataset')"
            :to="localePath({ path: '/dataset', query: getQueryParams() })"
            :icon="mdiDatabaseOutline"
          />
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
        <template #titleAppend>
          <EditButton :id="route.params.id as string" module="dataset" />
        </template>
      </HeaderDetail>
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
  </TemplateDetail>
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
