<script setup lang="ts">
import { mdiLayersTriple } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { $translate, $solrFetch, $apiFetch } = useNuxtApp();
const stratigraphiesStore = useStratigraphies();
const { getQueryParams } = stratigraphiesStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(stratigraphiesStore);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const tabs = {
  general: {
    type: "static",
    routeName: "stratigraphy-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  reference: {
    type: "dynamic",
    routeName: "stratigraphy-id-references",
    title: "stratigraphy.references",
    count: async () => {
      return $apiFetch<GeoloogiaListResponse>(`/stratigraphies/${route.params.id}/stratigraphy-references/`, {
        query: {
          limit: 0,
        },
      }).then(res => res.count);
    },
    props: {},
  } satisfies Tab,
  synonym: {
    type: "dynamic",
    routeName: "stratigraphy-id-synonyms",
    title: "stratigraphy.synonyms",
    count: async () => {
      const res = await $apiFetch<GeoloogiaListResponse>(`/stratigraphies/${route.params.id}/stratigraphy-synonyms/`, {
        query: {
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  subunits: {
    type: "dynamic",
    routeName: "stratigraphy-id-subunits",
    title: "stratigraphy.subUnits",
    count: async () => {
      return $solrFetch<SolrResponse>("/stratigraphy", {
        query: {
          q: `parent_id:${route.params.id}`,
          rows: 0,
        },
      }).then(res => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
  lithostratigraphy: {
    type: "dynamic",
    routeName: "stratigraphy-id-related-units",
    title: "stratigraphy.relatedUnits",
    count: async () => {
      return $solrFetch<SolrResponse>("/stratigraphy", {
        query: {
          q: `age_chronostratigraphy:${route.params.id}`,
          rows: 0,
        },
      }).then(res => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
  specimen: {
    type: "dynamic",
    routeName: "stratigraphy-id-specimens",
    title: "stratigraphy.specimens",
    count: async (ctx) => {
      if (!ctx?.stratigraphy.hierarchy_string)
        return 0;

      const stratigraphy = ctx.stratigraphy;
      return $solrFetch<SolrResponse>("/specimen", {
        query: {
          q: `(stratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*) OR age_hierarchy:(${stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*))`,
          rows: 0,
        },
      }).then(res => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
  sample: {
    type: "dynamic",
    routeName: "stratigraphy-id-samples",
    title: "stratigraphy.samples",
    count: async (ctx) => {
      if (!ctx?.stratigraphy.hierarchy_string)
        return 0;

      const stratigraphy = ctx.stratigraphy;
      return $solrFetch<SolrResponse>("/sample", {
        query: {
          q: `(stratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*) OR age_hierarchy:(${stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*))`,
          rows: 0,
        },
      }).then(res => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
};

export interface Stratigraphy {
  id: number;
  name: string;
  name_en: string;
  author_text: Nullable<string>;
  year: Nullable<number>;
  etymon: Nullable<string>;
  etymon_en: Nullable<string>;
  original_locality: Nullable<string>;
  index_html: Nullable<string>;
  index_additional_html: Nullable<string>;
  index_old: Nullable<string>;
  age_top: Nullable<number>;
  age_base: Nullable<number>;
  hierarchy_string: Nullable<string>;
  age_reference: Nullable<{
    id: number;
    reference: string;
  }>;
  age_chronostratigraphy: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  parent: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  type: Nullable<{
    value: string;
    value_en: string;
  }>;
  original_rank: Nullable<string>;
  rank: Nullable<{
    value: string;
    value_en: string;
  }>;
  scope: Nullable<{
    value: string;
    value_en: string;
  }>;
  status: Nullable<{
    value: string;
    value_en: string;
  }>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
}

const { data } = await useAsyncData("stratigraphy", async () => {
  const stratigraphy = await $apiFetch<Stratigraphy>(`/stratigraphies/${route.params.id}/`, {
    query: {
      expand: "age_chronostratigraphy,age_reference,parent,rank,scope,status,type",
      fields: [
        "id",
        "name",
        "name_en",
        "author_text",
        "year",
        "etymon",
        "etymon_en",
        "original_locality",
        "index_html",
        "index_additional_html",
        "index_old",
        "hierarchy_string",
        "age_top",
        "age_base",
        "age_reference.id",
        "age_reference.reference",
        "age_chronostratigraphy.id",
        "age_chronostratigraphy.name",
        "age_chronostratigraphy.name_en",
        "parent.id",
        "parent.name",
        "parent.name_en",
        "type.value",
        "type.value_en",
        "original_rank",
        "rank.value",
        "rank.value_en",
        "scope.value",
        "scope.value_en",
        "status.value",
        "status.value_en",
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
    props: { general: { stratigraphy }, sample: { stratigraphy }, specimen: { stratigraphy } },
    ctx: { stratigraphy },
  });

  return {
    stratigraphy,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "reference",
      "synonym",
      "subunits",
      "lithostratigraphy",
      "specimen",
      "sample",
    ]),
  };
}, {
  default: () => ({
    stratigraphy: null,
    tabs: [] as HydratedTab[],
  }),
});

const {
  data: stratigraphiesRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/stratigraphy", {
  routeName: "stratigraphy-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});

const similarStratigraphies = computed(() => stratigraphiesRes.value?.response.docs ?? []);

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
const title = computed(() =>
  $translate({
    et: data.value?.stratigraphy?.name,
    en: data.value?.stratigraphy?.name_en,
  }),
);

useHead({
  title: `${title.value} | ${t("stratigraphy.pageTitle")}`,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail :title="title">
        <template #prepend>
          <CategoryChip
            :title="$t('common.stratigraphy')"
            :to="localePath({ path: '/stratigraphy', query: getQueryParams() })"
            :icon="mdiLayersTriple"
          />
        </template>
        <template #tabs>
          <DetailTabs :tabs="data.tabs" />
        </template>
        <template #titleAppend>
          <EditButton :id="route.params.id as string" module="stratigraphy" />
        </template>
      </HeaderDetail>
    </template>
    <NuxtPage v-bind="activeTabProps" />
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarStratigraphies"
        :total-results="stratigraphiesRes?.response.numFound ?? 0"
        :search-route="localePath({ path: '/stratigraphy', query: getQueryParams() })"
        :get-result-route="(item) => localePath({ name: 'stratigraphy-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: stratigraphy }">
          <div class="font-weight-medium">
            {{ $translate({ et: stratigraphy.stratigraphy, en: stratigraphy.stratigraphy_en }) }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
  </TemplateDetail>
</template>
