<script setup lang="ts">
import { mdiMapMarkerOutline, mdiTextureBox } from "@mdi/js";

const { $translate, $geoloogiaFetch, $solrFetch } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const sitesStore = useSites();
const { getQueryParams } = sitesStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(sitesStore);
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
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
        query: {
          site: route.params.id,
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
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_description/", {
        query: {
          site: route.params.id,
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
      const res = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_reference/", {
        query: {
          site: route.params.id,
          limit: 0,
        },
      });
      return res.count;
    },
    props: {},
  } satisfies DynamicTab,
};

const { data } = await useAsyncData("site", async () => {
  const site = await $geoloogiaFetch<any>(`/site/${route.params.id}/`, {
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

const { t } = useI18n();
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
      <HeaderDetailNew :title="title">
        <template #prepend>
          <VChip
            class="text-none"
            variant="tonal"
            color="accent"
            label
            :to="localePath({ path: '/site', query: getQueryParams() })"
          >
            <VIcon start>
              {{ mdiMapMarkerOutline }}
            </VIcon>
            {{ $t("common.site") }}
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
