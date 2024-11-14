<script setup lang="ts">
import { mdiMapMarkerOutline, mdiTextureBox } from "@mdi/js";

const { $translate, $geoloogiaFetch, $solrFetch, $apiFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const sitesStore = useSites();
const { getQueryParams } = sitesStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(sitesStore);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const tabs = {
  general: {
    type: "static",
    routeName: "site-id",
    title: "common.general",
    props: {},
  } satisfies StaticTab,
  attachment: {
    type: "dynamic",
    routeName: "site-id-attachments",
    title: "site.attachments",
    count: async () => {
      const res = await $apiFetch<GeoloogiaListResponse>(`/sites/${route.params.id}/attachments/`, {
        query: {
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies DynamicTab,
  sample: {
    type: "dynamic",
    routeName: "site-id-samples",
    title: "site.samples",
    count: async () => {
      const res = await $solrFetch<SolrResponse>("/sample", {
        query: {
          q: `site_id:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies DynamicTab,
  locality_description: {
    type: "dynamic",
    routeName: "site-id-descriptions",
    title: "site.localityDescriptions",
    count: async () => {
      const res = await $apiFetch<GeoloogiaListResponse>(`/sites/${route.params.id}/site-descriptions/`, {
        query: {
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies DynamicTab,
  locality_reference: {
    type: "dynamic",
    routeName: "site-id-references",
    title: "site.localityReferences",
    count: async () => {
      const res = await $apiFetch<GeoloogiaListResponse>(`/sites/${route.params.id}/site-references/`, {
        query: {
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies DynamicTab,
};

export interface Site {
  id: number;
  name: string;
  name_en: string;
  coordx: Nullable<number>;
  coordy: Nullable<number>;
  depth: Nullable<number>;
  description: Nullable<string>;
  elevation: Nullable<string>;
  elevation_accuracy: Nullable<string>;
  extent: Nullable<number>;
  date_start: Nullable<string>;
  date_text: Nullable<string>;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  accuracy: Nullable<string>;
  remarks: Nullable<string>;
  remarks_location: Nullable<string>;
  area: Nullable<{
    id: number;
    name: string;
    name_en: string;
    type: number;
    plans: Nullable<string>;
  }>;
  locality: Nullable<{
    id: number;
    name: string;
    name_en: string;
    depth: number;
    country: {
      id: number;
      name: string;
      name_en: string;
      iso_3166_1_alpha_2: string;
    };
  }>;
  project: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  coordinate_method: Nullable<{
    value: string;
    value_en: string;
  }>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
}

const { data } = await useAsyncData("site", async () => {
  const site = await $apiFetch<Site>(`/sites/${route.params.id}/`, {
    query: {
      expand: "area,locality,locality.country,project,coordinate_method",
      fields: [
        "id",
        "name",
        "name_en",
        "coordx",
        "coordy",
        "depth",
        "description",
        "elevation",
        "elevation_accuracy",
        "extent",
        "date_start",
        "date_text",
        "latitude",
        "longitude",
        "accuracy",
        "remarks",
        "remarks_location",
        "area.id",
        "area.name",
        "area.name_en",
        "area.type",
        "area.plans",
        "locality.id",
        "locality.name",
        "locality.name_en",
        "locality.depth",
        "locality.country.id",
        "locality.country.name",
        "locality.country.name_en",
        "locality.country.iso_3166_1_alpha_2",
        "project.id",
        "project.name",
        "project.name_en",
        "coordinate_method.value",
        "coordinate_method.value_en",
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
      general: { site },
    },
  });

  const imagesRes = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
    query: {
      site: route.params.id,
      attachment__attachment_format__value__istartswith: "image",
      nest: 1,
      limit: 1,
    },
  });

  return {
    site,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "attachment",
      "sample",
      "locality_description",
      "locality_reference",
    ]),
    images: imagesRes.results,
  };
}, {
  default: () => ({
    site: null,
    tabs: [] as HydratedTab[],
    images: [],
  }),
});

const {
  data: sitesRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/site", {
  routeName: "site-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});

const similarSites = computed(() => sitesRes.value?.response.docs ?? []);

const title = computed(() => {
  const engTitle = data.value?.site?.name_en
    ? data.value?.site?.name_en
    : data.value?.site?.name;
  return $translate({ et: data.value?.site?.name, en: engTitle });
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

redirectInvalidTab({
  redirectRoute: localePath({
    name: "site-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

const img = useImage();

useHead({
  title: `${title.value} | ${t("site.pageTitle")}`,
});

useSeoMeta({
  description: data.value?.site?.description,
  ogImage: data.value?.images[0]?.attachment?.filename
    ? img(
      `${data.value?.images[0]?.attachment?.filename}`,
      { size: "medium" },
      {
        provider: "geocollections",
      },
    )
    : undefined,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail :title="title">
        <template #prepend>
          <CategoryChip
            :title="$t('common.site')"
            :to="localePath({ path: '/site', query: getQueryParams() })"
            :icon="mdiMapMarkerOutline"
          />
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
        <template #titleAppend>
          <EditButton :id="route.params.id as string" module="site" />
        </template>
      </HeaderDetail>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarSites"
        :total-results="sitesRes?.response.numFound ?? 0"
        :search-route="localePath({ path: '/site', query: getQueryParams() })"
        :get-result-route="(item) => localePath({ name: 'site-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: site }">
          <div class="font-weight-medium text-wrap">
            {{ site.name }}
          </div>
        </template>
        <template #itemSubtitle="{ item: site }">
          <div v-if="site.area_id" class="d-flex align-center">
            <VIcon start size="small">
              {{ mdiTextureBox }}
            </VIcon>
            <span class="text--secondary">
              {{
                $translate({
                  et: site.area_name,
                  en: site.area_name_en,
                })
              }}
            </span>
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </TemplateDetail>
</template>
