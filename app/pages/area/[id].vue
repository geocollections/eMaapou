<script setup lang="ts">
import { mdiMapMarkerRadiusOutline } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const { $solrFetch, $apiFetch, $translate } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

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
          rows: 0,
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
      const response = await $apiFetch<GeoloogiaListResponse>(`/areas/${route.params.id}/area-references/`, {
        query: {
          limit: 0,
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
      const response = await $solrFetch<SolrResponse>("/area", {
        query: {
          q: "*",
          fq: `parent_area_id:${route.params.id}`,
          rows: 0,
        },
      });
      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
  locality: {
    type: "dynamic",
    routeName: "area-id-localities",
    title: "area.localities",
    count: async () => {
      const response = await $solrFetch<SolrResponse>("/locality", {
        query: {
          q: "*",
          area: route.params.id,
          fq: `area_id:${route.params.id}`,
          rows: 0,
        },
      });
      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
};

export interface Area {
  id: number;
  name: string;
  name_en: string;
  type: {
    id: number;
    name: string;
    name_en: string;
  };
  parent: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  county: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  eelis: Nullable<string>;
  egf: Nullable<string>;
  plans: Nullable<string>;
  polygon: Nullable<string>;
  area_ha: Nullable<number>;
  deposit: Nullable<number>;
  deposit_area_ha: Nullable<number>;
  description: Nullable<string>;
  description_en: Nullable<string>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
  land_board_deposit: Nullable<{
    id: number;
    nimetus: string;
    maardla_os: string;
    pindala: number;
    aluspohja: boolean;
    maavara: string;
    pohimaavar: string;
    kaasmaavar: string;
    maeteh_ti: string;
    geookol_ti: string;
    eksporditi: string;
  }>;
  land_board_claim: Nullable<{
    id: number;
    nimetus: string;
    reg_kaart: string;
    pindala: number;
    erald_varu: string;
    kas_eesm: string;
    rekult: string;
    me_olek: string;
    loa_number: string;
    loa_algus: string;
    loa_lopp: string;
    kaevandaja: string;
    eksporditi: string;
    loa_omanik: string;
  }>;
}

const { data } = await useAsyncData("area", async () => {
  const area = await $apiFetch<Area>(`/areas/${route.params.id}/`, {
    query: {
      expand: "type,parent,county,land_board_deposit,land_board_claim",
      fields: [
        "id",
        "name",
        "name_en",
        "type.id",
        "type.name",
        "type.name_en",
        "parent.id",
        "parent.name",
        "parent.name_en",
        "plans",
        "eelis",
        "egf",
        "polygon",
        "area_ha",
        "deposit",
        "deposit_area_ha",
        "description",
        "description_en",
        "land_board_deposit",
        "land_board_claim",
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

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const pageTitle = computed(() =>
  $translate({
    et: data.value?.area?.name,
    en: data.value?.area?.name_en,
  }),
);
const metaTitle = computed(
  () =>
    `${$translate({
      et: data.value?.area?.name,
      en: data.value?.area?.name_en,
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
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail :title="pageTitle">
        <template #prepend>
          <CategoryChip
            :title="$t('common.area')"
            :to="localePath({ path: '/area', query: getQueryParams() })"
            :icon="mdiMapMarkerRadiusOutline"
          />
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
        <template #titleAppend>
          <EditButton :id="route.params.id as string" module="area" />
        </template>
      </HeaderDetail>
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
  </TemplateDetail>
</template>
