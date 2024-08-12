<script setup lang="ts">
import { mdiScrewMachineFlatTop } from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const { $translate, $geoloogiaFetch, $solrFetch, $apiFetch } = useNuxtApp();
const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const drillcoresStore = useDrillcores();
const { getQueryParams } = drillcoresStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(drillcoresStore);

const {
  data: drillcoresRes,
  page,
  handleSelect,
  showDrawer,
} = await useSearchResultsDrawer("/drillcore", {
  routeName: "drillcore-id",
  solrParams: {
    query: solrQuery,
    filter: solrFilters,
    sort: solrSort,
  },
});

const similarDrillcores = computed(
  () => drillcoresRes.value?.response.docs ?? [],
);
const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const tabs = {
  general: {
    type: "static",
    routeName: "drillcore-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
  boxes: {
    type: "dynamic",
    routeName: "drillcore-id-boxes",
    title: "drillcore.drillcoreBoxesTitle",
    count: async (ctx) => {
      return ctx?.drillcore.boxes ?? 0;
    },
    props: {},
  } satisfies Tab,
  locality_description: {
    type: "dynamic",
    routeName: "drillcore-id-descriptions",
    title: "drillcore.localityDescriptions",
    count: async (ctx) => {
      if (!ctx?.drillcore.locality)
        return 0;
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_description/", {
        query: {
          locality: ctx.drillcore.locality.id,
          limit: 0,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
  locality_reference: {
    type: "dynamic",
    routeName: "drillcore-id-references",
    title: "drillcore.localityReferences",
    count: async (ctx) => {
      if (!ctx?.drillcore.locality)
        return 0;
      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_reference/", {
        query: {
          locality: ctx.drillcore.locality.id,
          limit: 0,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
  attachment_link: {
    type: "dynamic",
    routeName: "drillcore-id-attachments",
    title: "drillcore.attachments",
    count: async (ctx) => {
      const orQueries = [`drillcore:${route.params.id}`];
      if (ctx?.drillcore.locality)
        orQueries.push(`locality:${ctx.drillcore.locality.id}`);

      const response = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
        query: {
          or_search: orQueries.join(" OR "),
          limit: 0,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
  sample: {
    type: "dynamic",
    routeName: "drillcore-id-samples",
    title: "drillcore.samples",
    count: async (ctx) => {
      if (!ctx?.drillcore.locality)
        return 0;
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
  analysis: {
    type: "dynamic",
    routeName: "drillcore-id-analyses",
    title: "drillcore.analyses",
    count: async (ctx) => {
      if (!ctx?.drillcore.locality)
        return 0;
      const res = await $solrFetch<SolrResponse>("/analysis", {
        query: {
          q: `locality_id:${ctx.drillcore.locality.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  specimen: {
    type: "dynamic",
    routeName: "drillcore-id-specimens",
    title: "drillcore.specimens",
    count: async (ctx) => {
      if (!ctx?.drillcore.locality)
        return 0;
      const res = await $solrFetch<SolrResponse>("/specimen", {
        query: {
          q: `locality_id:${ctx.drillcore.locality.id}`,
          rows: 0,
        },
      });
      return res.response.numFound;
    },
    props: {},
  } satisfies Tab,
  graphs: {
    type: "dynamic",
    routeName: "drillcore-id-graphs",
    title: "locality.graphs",
    count: async (ctx) => {
      if (ctx?.lasFile)
        return 1;

      if (!ctx?.drillcore.locality)
        return 0;

      const response = await $solrFetch<SolrResponse>("/analysis_results", {
        query: {
          q: `locality_id:${ctx.drillcore.locality.id}`,
          rows: 0,
        },
      });
      return response.response.numFound;
    },
    props: {},
  } satisfies Tab,
};

export interface Drillcore {
  id: number;
  name: string;
  name_en: string;
  boxes: Nullable<number>;
  box_numbers: Nullable<string>;
  year: Nullable<string>;
  meters_in_box: Nullable<number>;
  remarks: Nullable<string>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
  locality: Nullable<{
    id: number;
    name: string;
    name_en: string;
    latitude: Nullable<number>;
    longitude: Nullable<number>;
    elevation: Nullable<string>;
    depth: Nullable<number>;
    country: Nullable<{
      name: string;
      name_en: string;
      iso_3166_1_alpha_2: string;
    }>;
  }>;
  database: Nullable<{
    name: string;
    name_en: string;
    url: string;
  }>;
  agent: Nullable<{
    name: string;
  }>;
  storage: Nullable<{
    name: string;
  }>;
  depository: Nullable<{
    value: string;
    value_en: string;
  }>;
};

const { data } = await useAsyncData("drillcore", async () => {
  const drillcore = await $apiFetch<Drillcore>(`/drillcores/${route.params.id}/`, {
    query: {
      expand: "locality,locality.country,database,agent,storage,depository",
      fields: [
        "name",
        "name_en",
        "boxes",
        "box_numbers",
        "year",
        "meters_in_box",
        "remarks",
        "date_added",
        "date_changed",
        "locality.id",
        "locality.name",
        "locality.name_en",
        "locality.latitude",
        "locality.longitude",
        "locality.elevation",
        "locality.depth",
        "locality.country.name",
        "locality.country.name_en",
        "locality.country.iso_3166_1_alpha_2",
        "database.name",
        "database.name_en",
        "database.url",
        "agent.name",
        "storage.name",
        "depository.value",
        "depository.value_en",
      ],
    },
    onResponseError: (_error) => {
      showError({
        statusCode: 404,
        message: t("error.notFound"),
      });
    },
  });

  let lasFileResponse;
  if (drillcore?.locality) {
    lasFileResponse = await $geoloogiaFetch<any>("/attachment_link/", {
      query: {
        attachment__uuid_filename__iendswith: ".las",
        locality: drillcore.locality.id,
        fields: "attachment",
      },
    });
  }

  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
      general: { drillcore },
      graphs: {
        drillcoreObject: drillcore,
        locality: drillcore?.locality?.id,
        attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
      },
    },
    ctx: {
      drillcore,
      lasFile: lasFileResponse?.items?.[0]?.attachment,
    },
  });

  return {
    drillcore,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
      "boxes",
      "locality_description",
      "locality_reference",
      "attachment_link",
      "sample",
      "analysis",
      "specimen",
      "graphs",
    ]),
  };
}, {
  default: () => ({
    drillcore: null,
    tabs: [],
  }),
});

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});

const title = computed(() =>
  $translate({
    et: data.value?.drillcore?.name,
    en: data.value?.drillcore?.name_en,
  }),
);
redirectInvalidTab({
  redirectRoute: localePath({
    name: "drillcore-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

useHead({
  title: `${title.value} | ${t("drillcore.pageTitle")}`,
});
</script>

<template>
  <TemplateDetail :show-similar="showDrawer">
    <template #title>
      <HeaderDetail
        :title="
          $translate({
            et: data?.drillcore?.name,
            en: data?.drillcore?.name_en,
          })
        "
      >
        <template #prepend>
          <CategoryChip
            :title="$t('common.drillcore')"
            :to="localePath({ path: '/drillcore', query: getQueryParams() })"
            :icon="mdiScrewMachineFlatTop"
          />
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </HeaderDetail>
    </template>
    <template #drawer>
      <SearchResultsDrawer
        :page="page"
        :results="similarDrillcores"
        :total-results="drillcoresRes?.response.numFound ?? 0"
        :search-route="
          localePath({ path: '/drillcore', query: getQueryParams() })
        "
        :get-result-route="
          (item) =>
            localePath({ name: 'drillcore-id', params: { id: item.id } })
        "
        @page:next="page++"
        @page:previous="page--"
        @select="handleSelect"
      >
        <template #itemTitle="{ item: drillcore }">
          <div class="font-weight-medium text-wrap">
            {{
              $translate({
                et: drillcore.drillcore,
                en: drillcore.drillcore_en,
              })
            }}
          </div>
        </template>
      </SearchResultsDrawer>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </TemplateDetail>
</template>
