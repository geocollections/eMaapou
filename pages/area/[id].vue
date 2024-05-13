<script setup lang="ts">
import { mdiMapMarkerRadiusOutline } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const { $geoloogiaFetch, $solrFetch, $translate } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const areasStore = useAreas();
const { getQueryParams } = areasStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(areasStore);

const {
  data: areasRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/area", {
  routeName: "area-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});
const similarAreas = computed(() => areasRes.value?.response.docs ?? []);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const tabs = {
  general: {
    type: "static",
    routeName: "area-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  site: {
    type: "dynamic",
    routeName: "area-id-sites",
    title: "area.sites",
    count: async () => {
      const response = await $solrFetch<SolrResponse>("/site", {
        query: {
          q: "*",
          fq: `area_id:${route.params.id}`,
        },
      });
      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
  locality_reference: {
    type: "dynamic",
    routeName: "area-id-references",
    title: "area.localityReferences",
    count: async () => {
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_reference/", {
        query: {
          area: route.params.id,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
  relatedArea: {
    type: "dynamic",
    routeName: "area-id-related-areas",
    title: "area.relatedAreas",
    count: async () => {
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/area/", {
        query: {
          parent_area: route.params.id,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
  locality: {
    type: "dynamic",
    routeName: "area-id-localities",
    title: "area.localities",
    count: async () => {
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/locality/", {
        query: {
          area: route.params.id,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
};
const { data } = await useAsyncData("area", async () => {
  const area = await $geoloogiaFetch<any>(`/area/${route.params.id}`, {
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
    props: {
      general: { area },
    },
  });

  return {
    area,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "site",
      "locality_reference",
      "relatedArea",
      "locality",
    ]),
  };
}, {
  default: () => ({
    area: null,
    tabs: [] as HydratedTab[],
  }),
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const pageTitle = computed(() =>
  $translate({
    et: data.value?.area.name,
    en: data.value?.area.name_en,
  }),
);
const metaTitle = computed(
  () =>
    `${$translate({
      et: data.value?.area.name,
      en: data.value?.area.name_en,
    })} | ${t("area.pageTitle")}`,
);

redirectInvalidTab({
  redirectRoute: localePath({
    name: "area-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

useHead({
  title: metaTitle.value,
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="detail" :show-similar="showDrawer">
    <template #title>
      <HeaderDetailNew :title="pageTitle">
        <template #prepend>
          <VChip
            class="text-none"
            variant="tonal"
            color="accent"
            label
            :to="localePath({ path: '/area', query: getQueryParams() })"
          >
            <VIcon start>
              {{ mdiMapMarkerRadiusOutline }}
            </VIcon>
            {{ $t("common.area") }}
          </VChip>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarAreas"
        :total-results="areasRes?.response.numFound ?? 0"
        :search-route="localePath({ path: '/area', query: getQueryParams() })"
        :get-result-route="
          (item) => localePath({ name: 'area-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: area }">
          <div class="font-weight-medium text-wrap">
            {{ $translate({ et: area.name, en: area.name_en }) }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </NuxtLayout>
</template>
