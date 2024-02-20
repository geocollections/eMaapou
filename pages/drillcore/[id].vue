<template>
  <detail-new :show-similar="showDrawer">
    <template #title>
      <header-detail-new
        :title="
          $translate({
            et: data?.drillcore.drillcore,
            en: data?.drillcore.drillcore_en,
          })
        "
      >
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </header-detail-new>
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
  </detail-new>
</template>

<script setup lang="ts">
import type { Tab } from "~/composables/useTabs";
const { $translate, $geoloogiaFetch, $solrFetch } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const drillcore = computed(() => data.value?.drillcore);

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
const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
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
      if (!ctx?.drillcore.locality) return 0;
      const response = await $geoloogiaFetch("/locality_description/", {
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
      if (!ctx?.drillcore.locality) return 0;
      const response = await $geoloogiaFetch("/locality_reference/", {
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
      if (ctx?.drillcore.locality) {
        orQueries.push(`locality:${ctx.drillcore.locality.id}`);
      }
      const response = await $geoloogiaFetch("/attachment_link/", {
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
      if (!ctx?.drillcore.locality) return 0;
      const res = await $solrFetch("/sample", {
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
      if (!ctx?.drillcore.locality) return 0;
      const res = await $solrFetch("/analysis", {
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
      if (!ctx?.drillcore.locality) return 0;
      const res = await $solrFetch("/specimen", {
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
      if (ctx?.lasFile) {
        return 1;
      }
      if (!ctx?.drillcore.locality) return 0;

      const response = await $solrFetch("/analysis_results", {
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

const { data } = await useAsyncData("drillcore", async () => {
  const drillcore = await $geoloogiaFetch(`/drillcore/${route.params.id}/`, {
    query: {
      nest: 2,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Drillcore not found",
        });
      }
    },
  });

  let lasFileResponse;
  if (drillcore?.locality) {
    lasFileResponse = await $geoloogiaFetch("/attachment_link/", {
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
    drillcore: drillcore,
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
});
const title = computed(() =>
  $translate({
    et: data.value?.drillcore.drillcore,
    en: data.value?.drillcore.drillcore_en,
  }),
);
redirectInvalidTab({
  redirectRoute: localePath({
    name: "drillcore-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});
// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t("drillcore.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             content: `${title.value} | ${i18n.t("drillcore.pageTitle")}`,
//             hid: "og:title",
//           },
//           {
//             property: "og:url",
//             hid: "og:url",
//             content: route.value.path,
//           },
//         ],
//       };
//     });
//   },
// });
</script>
