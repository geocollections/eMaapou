<script setup lang="ts">
import { mdiLayersTriple } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { $translate, $geoloogiaFetch, $solrFetch } = useNuxtApp();
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

const { data } = await useAsyncData("stratigraphy", async () => {
  const stratigraphy = await $geoloogiaFetch<any>(`/stratigraphy/${route.params.id}/`, {
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
    sample: null,
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

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="detail" :show-similar="showDrawer">
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
  </NuxtLayout>
</template>
