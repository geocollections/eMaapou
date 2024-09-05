<script setup lang="ts">
import {
  mdiBookOpenPageVariantOutline,
  mdiChartScatterPlot,
  mdiEarth,
  mdiMapMarker,
  mdiOpenInNew,
  mdiScrewMachineFlatTop,
} from "@mdi/js";
import type { Nullable } from "vitest";
import type { Tab } from "~/composables/useTabs";

const { $solrFetch, $translate, $geoloogiaFetch, $apiFetch } = useNuxtApp();

const localePath = useLocalePath();
const { t } = useI18n();
const route = useRoute();

const localitiesStore = useLocalities();
const { getQueryParams } = localitiesStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(localitiesStore);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const {
  data: localitiesRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/locality", {
  routeName: "locality-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: computed(
      () =>
        solrSort.value
        ?? $translate({ et: "locality asc", en: "locality_en asc" }),
    ),
  },
});

const similarLocalities = computed(
  () => localitiesRes.value?.response.docs ?? [],
);

const tabs = {
  general: {
    type: "static",
    routeName: "locality-id",
    title: "locality.general",
    props: {},
  } satisfies Tab,
  locality_reference: {
    type: "dynamic",
    routeName: "locality-id-references",
    title: "locality.references",
    count: async () => {
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_reference/", {
        query: {
          locality: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  locality_description: {
    type: "dynamic",
    routeName: "locality-id-descriptions",
    title: "locality.descriptions",
    count: async () => {
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_description/", {
        query: {
          locality: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  attachment_link: {
    type: "dynamic",
    routeName: "locality-id-attachments",
    title: "locality.attachments",
    count: async () => {
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
        query: {
          locality: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  sample: {
    type: "dynamic",
    routeName: "locality-id-samples",
    title: "locality.samples",
    count: async () => {
      const res = await $solrFetch<SolrResponse>("/sample", {
        query: {
          q: `locality_id:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  boxes: {
    type: "dynamic",
    routeName: "locality-id-drillcore-boxes",
    title: "locality.drillcoreBoxes",
    count: async (ctx) => {
      if (!ctx?.drillcore)
        return 0;
      return ctx.drillcore.boxes;
    },
    props: {},
  } satisfies Tab,
  fossils: {
    type: "dynamic",
    routeName: "locality-id-fossils",
    title: "locality.fossils",
    count: async () => {
      const res = await $solrFetch<SolrResponse>("/taxon_search", {
        query: {
          q: `locality_id:${route.params.id} AND rank:[14 TO 18]`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  specimen: {
    type: "dynamic",
    routeName: "locality-id-specimens",
    title: "locality.specimens",
    count: async () => {
      const res = await $solrFetch<SolrResponse>("/specimen", {
        query: {
          q: `locality_id:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  locality_synonym: {
    type: "dynamic",
    routeName: "locality-id-synonyms",
    title: "locality.synonyms",
    count: async () => {
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_synonym/", {
        query: {
          locality: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  stratigraphy_stratotype: {
    type: "dynamic",
    routeName: "locality-id-stratotypes",
    title: "locality.stratotypes",
    count: async () => {
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/stratigraphy_stratotype/", {
        query: {
          locality: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies Tab,
  analysis: {
    type: "dynamic",
    routeName: "locality-id-analyses",
    title: "locality.analyses",
    count: async () => {
      const res = await $solrFetch<SolrResponse>("/analysis", {
        query: {
          q: `locality_id:${route.params.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  analysis_results: {
    type: "dynamic",
    routeName: "locality-id-graphs",
    title: "locality.graphs",
    count: async () => {
      const res = await $solrFetch<SolrResponse>("/analysis_results", {
        query: {
          q: `locality_id:${route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
};

export interface Locality {
  id: number;
  name: string;
  name_en: string;
  number: Nullable<string>;
  longitude: Nullable<number>;
  latitude: Nullable<number>;
  elevation: Nullable<string>;
  coordx: Nullable<number>;
  coordy: Nullable<number>;
  remarks: Nullable<string>;
  remarks_location: Nullable<string>;
  land_board_id: Nullable<number>;
  coordinate_system: Nullable<string>;
  type: Nullable<{
    value: string;
    value_en: string;
  }>;
  country: Nullable<{
    name: string;
    name_en: string;
    iso_3166_1_alpha_2: string;
  }>;
  coordinate_agent: Nullable<{
    name: string;
  }>;
  coordinate_method: Nullable<{
    value: string;
    value_en: string;
  }>;
  coordinate_precision: Nullable<{
    value: string;
  }>;
  stratigraphy_top: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  stratigraphy_base: Nullable<{
    id: number;
    name: string;
    name_en: string;
  }>;
  municipality: Nullable<{
    name: string;
    name_en: string;
  }>;
  settlement: Nullable<{
    name: string;
    name_en: string;
  }>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
};

const { data } = await useAsyncData("locality", async () => {
  const locality = await $apiFetch<Locality>(`/localities/${route.params.id}/`, {
    query: {
      expand: "type,country,coordinate_agent,coordinate_method,coordinate_precision,stratigraphy_top,stratigraphy_base,municipality,settlement",
      fields: [
        "id",
        "name",
        "name_en",
        "number",
        "longitude",
        "latitude",
        "elevation",
        "coordx",
        "coordy",
        "remarks",
        "remarks_location",
        "land_board_id",
        "coordinate_system",
        "type.value",
        "type.value_en",
        "country.name",
        "country.name_en",
        "coordinate_agent.name",
        "coordinate_method.value",
        "coordinate_method.value_en",
        "coordinate_precision.value",
        "stratigraphy_top.id",
        "stratigraphy_top.name",
        "stratigraphy_top.name_en",
        "stratigraphy_base.id",
        "stratigraphy_base.name",
        "stratigraphy_base.name_en",
        "municipality.name",
        "municipality.name_en",
        "settlement.name",
        "settlement.name_en",
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

  const drillcorePromise = $apiFetch<GeoloogiaListResponse<{ id: number; name: string; name_en: string; boxes?: number }>>("/drillcores/", {
    query: {
      locality: route.params.id,
      fields: "id,name,name_en,boxes",
      limit: 1,
    },
  });
  // Checking if locality has a related .las file to show in graph tab
  const lasFilePromise = $geoloogiaFetch<any>("/attachment_link/", {
    query: {
      attachment__uuid_filename__iendswith: ".las",
      locality: route.params.id,
      fields: "attachment",
    },
  });

  const [drillcoreResponse, lasFileResponse] = await Promise.all([
    drillcorePromise,
    lasFilePromise,
  ]);
  const drillcore
    = drillcoreResponse.results.length > 0 ? drillcoreResponse.results[0] : null;

  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
      general: { locality },
      boxes: { drillcore: drillcore?.id },
      analysis_results: {
        localityObject: locality,
        attachment: lasFileResponse?.results?.[0]?.attachment,
      },
    },
    ctx: { drillcore },
  });

  hydratedTabs.analysis_results.count
    = hydratedTabs.analysis_results.count
    + hydratedTabs.locality_description.count
    + hydratedTabs.sample.count
    + (lasFileResponse?.results?.[0]?.attachment ? 1 : 0);

  const imagesRes = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_image/", {
    query: {
      locality: route.params.id,
      nest: 1,
      limit: 1,
      ordering: "sort",
    },
  });

  return {
    locality,
    drillcore,
    analysisResultsCount: hydratedTabs.analysis_results.count,
    referenceCount: hydratedTabs.locality_reference.count,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "locality_reference",
      "locality_description",
      "attachment_link",
      "sample",
      "boxes",
      "fossils",
      "specimen",
      "locality_synonym",
      "stratigraphy_stratotype",
      "analysis",
      "analysis_results",
    ]),
    images: imagesRes.results,
  };
}, {
  default: () => ({
    locality: null,
    drillcore: null,
    analysisResultsCount: 0,
    referenceCount: 0,
    tabs: [] as HydratedTab[],
    images: [],
  }),
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const title = computed(() =>
  $translate({
    et: data.value?.locality!.name,
    en: data.value?.locality!.name_en,
  }),
);
redirectInvalidTab({
  redirectRoute: localePath({
    name: "locality-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

const img = useImage();

useHead({
  title: `${title.value} | ${t("locality.pageTitle")}`,
});

useSeoMeta({
  ogImage: data.value?.images[0]?.attachment?.filename
    ? img(
        `${data.value.images[0].attachment.filename}`,
        { size: "medium" },
        {
          provider: "geocollections",
        },
    )
    : null,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail
        :title="
          $translate({
            et: data?.locality?.name,
            en: data?.locality?.name_en,
          })
        "
      >
        <template #prepend>
          <CategoryChip
            :title="$t('common.locality')"
            :to="localePath({ path: '/locality', query: getQueryParams() })"
            :icon="mdiMapMarker"
          />
        </template>
        <template #sub>
          <VBtn
            v-if="data?.drillcore"
            size="small"
            rounded
            flat
            color="accent"
            class="mt-2 mr-2 montserrat text-none"
            @click="
              $router.push(
                localePath({
                  name: 'drillcore-id',
                  params: { id: data?.drillcore.id },
                }),
              )
            "
          >
            <VIcon start>
              {{ mdiScrewMachineFlatTop }}
            </VIcon>
            {{
              $translate({
                et: data?.drillcore.name,
                en: data?.drillcore.name_en,
              })
            }}
          </VBtn>
          <VBtn
            v-if="data?.analysisResultsCount > 0"
            size="small"
            rounded
            flat
            color="accent"
            class="mt-2 mr-2 montserrat text-none"
            :to="
              localePath({
                path: '/analytical-data',
                query: { locality: route.params.id },
              })
            "
          >
            <VIcon start>
              {{ mdiChartScatterPlot }}
            </VIcon>
            {{ $t("locality.linkToAnalyticalData") }}
          </VBtn>
          <VBtn
            v-if="data?.referenceCount > 0"
            size="small"
            rounded
            flat
            color="accent"
            class="mt-2 montserrat text-none"
            :href="`https://kirjandus.geoloogia.info/reference/?localities=${title}`"
          >
            <VIcon start>
              {{ mdiBookOpenPageVariantOutline }}
            </VIcon>
            {{ $t("locality.linkGeoscienceLiterature") }}
            <VIcon end>
              {{ mdiOpenInNew }}
            </VIcon>
          </VBtn>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
        <template #titleAppend>
          <EditButton :id="route.params.id as string" module="locality" />
        </template>
      </HeaderDetail>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarLocalities"
        :total-results="localitiesRes?.response.numFound ?? 0"
        :search-route="
          localePath({ path: '/locality', query: getQueryParams() })
        "
        :get-result-route="
          (item) => localePath({ name: 'locality-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: locality }">
          <div class="font-weight-medium text-wrap">
            {{
              $translate({ et: locality.locality, en: locality.locality_en })
            }}
          </div>
        </template>
        <template #itemSubtitle="{ item: locality }">
          <div v-if="locality.country_id" class="d-flex align-center">
            <VIcon start size="small">
              {{ mdiEarth }}
            </VIcon>
            <span class="text--secondary">
              {{
                $translate({
                  et: locality.country,
                  en: locality.country_en,
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
