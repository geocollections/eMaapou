<script setup lang="ts">
import { mdiLayersTriple } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { $translate, $geoloogiaFetch, $solrFetch, $apiFetch } = useNuxtApp();
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
      return $geoloogiaFetch<GeoloogiaListResponse>("/stratigraphy_reference/", {
        query: {
          stratigraphy: route.params.id,
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
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/stratigraphy_synonym/", {
        query: {
          stratigraphy: route.params.id,
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

const stratigraphiesStore = useStratigraphies();
const { getQueryParams } = stratigraphiesStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(stratigraphiesStore);

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

export interface Stratigraphy {
  id: number;
  name: string;
  name_en: string;
  author_text?: string;
  year?: number;
  etymon?: string;
  etymon_en?: string;
  original_locality?: string;
  index_html?: string;
  index_additional_html?: string;
  index_old?: string;
  age_top?: number;
  age_base?: number;
  age_reference?: {
    id: number;
    reference: string;
  };
  age_chronostratigraphy?: {
    id: number;
    name: string;
    name_en: string;
  };
  parent?: {
    id: number;
    name: string;
    name_en: string;
  };
  type?: {
    value: string;
    value_en: string;
  };
  original_rank?: string;
  rank?: {
    value: string;
    value_en: string;
  };
  scope?: {
    value: string;
    value_en: string;
  };
  status?: {
    value: string;
    value_en: string;
  };
  date_added?: string;
  date_changed?: string;
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
        "age_top",
        "age_base",
        "age_reference",
        "age_chronostratigraphy",
        "parent",
        "type",
        "original_rank",
        "rank",
        "scope",
        "status",
        "date_added",
        "date_changed",
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

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
const title = computed(() =>
  $translate({
    et: data.value?.stratigraphy.stratigraphy,
    en: data.value?.stratigraphy.stratigraphy_en,
  }),
);

useHead({
  title: `${title.value} | ${t("stratigraphy.pageTitle")}`,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetailNew :title="title">
        <template #prepend>
          <VChip
            class="text-none"
            variant="tonal"
            color="accent"
            label
            :to="localePath({ path: '/stratigraphy', query: getQueryParams() })"
          >
            <VIcon start>
              {{ mdiLayersTriple }}
            </VIcon>
            {{ $t("common.stratigraphy") }}
          </VChip>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data.tabs" />
        </template>
      </HeaderDetailNew>
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
