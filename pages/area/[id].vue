<script setup lang="ts">
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
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
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
      const response = await $solrFetch("/site", {
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
      const response = await $geoloogiaFetch("/locality_reference/", {
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
      const response = await $geoloogiaFetch("/area/", {
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
      const response = await $geoloogiaFetch("/locality/", {
        query: {
          area: route.params.id,
        },
      });
      return response.count;
    },
    props: {},
  } satisfies Tab,
};
const { data, pending, error } = await useAsyncData("area", async () => {
  const area = await $geoloogiaFetch(`/area/${route.params.id}`, {
    query: {
      nest: 1,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Area not found",
        });
      }
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

// export default defineComponent({
//     useMeta(() => {
//       return {
//         title: metaTitle.value,
//         meta: [
//           {
//             property: "og:title",
//             content: metaTitle.value,
//             hid: "og:title",
//           },
//         ],
//       };
//     });
// });
</script>

<template>
  <DetailNew :show-similar="showDrawer">
    <template #title>
      <HeaderDetailNew :title="pageTitle">
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
  </DetailNew>
</template>
