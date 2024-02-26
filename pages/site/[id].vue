<script setup lang="ts">
import { mdiTextureBox } from "@mdi/js";
import isEmpty from "lodash/isEmpty";

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

const { data } = useAsyncData("site", async () => {
  const site = await $geoloogiaFetch<any>(`/site/${route.params.id}/`, {
    query: {
      nest: 2,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Site not found",
        });
      }
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
      general: { site },
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
  };
}, {
  default: () => ({
    site: null,
    tabs: [] as HydratedTab[],
  }),
});
const title = computed(() => {
  const engTitle = isEmpty(data.value?.site.name_en)
    ? data.value?.site.name
    : data.value?.site.name_en;
  return $translate({ et: data.value?.site.name, en: engTitle });
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
// export default defineComponent({
//   components: {
//     HeaderDetail,
//     MapDetail,
//     TableRow,
//     TableRowLink,
//     Detail,
//     ImageBar,
//     BaseTable,
//   },
//   setup() {
//     const { $services, $hydrateTab, $translate, $formatDate, i18n, $img } =
//       useContext();
//     const route = useRoute();
//     const state = reactive({
//       site: null as any,
//       ids: {} as any,
//       validRoute: {} as Location,
//       tabs: [] as Tab[],
//       images: [] as any[],
//     });
//     const planArray = computed(() => {
//       return data.value?.site?.area?.text1
//         ? data.value?.site?.area?.text1.split(",")
//         : [];
//     });
//     const elevation = computed(() => {
//       return data.value?.site?.elevation_accuracy
//         ? `${data.value?.site?.elevation} (± ${data.value?.site?.elevation_accuracy})`
//         : data.value?.site?.elevation;
//     });
//     const studied = computed(() => {
//       return data.value?.site?.date_start
//         ? $formatDate(data.value?.site?.date_start)
//         : data.value?.site?.date_free;
//     });
//     const locality = computed(() => data.value?.site?.locality);
//     const area = computed(() => data.value?.site?.area);
//
//     const icons = computed(() => {
//       return {
//         mdiOpenInNew,
//         mdiFileDownloadOutline,
//       };
//     });
//     const { fetchState } = useFetch(async () => {
//       const sitePromise = $services.sarvREST.getResource(
//         "site",
//         parseInt(route.value.params.id),
//         {
//           params: {
//             nest: 2,
//           },
//         },
//       );
//       const attachmentPromise = $services.sarvREST
//         .getResourceList("attachment_link", {
//           defaultParams: {
//             site: route.value.params.id,
//             attachment__attachment_format__value__istartswith: "image",
//             nest: 2,
//           },
//           fields: {},
//         })
//         .then((res) => {
//           return res.items.map((image: any) => ({
//             id: image.attachment.id,
//             filename: image.attachment.filename,
//             author: image.attachment.author?.agent ?? null,
//             date: image.attachment.date_created,
//             dateText: image.attachment.date_created_free,
//           }));
//         });
//
//       const tabs = TABS_SITE.allIds.map((id) => TABS_SITE.byIds[id]);
//       const hydratedTabsPromise = Promise.all(
//         tabs.map((tab) =>
//           $hydrateTab(tab, {
//             countParams: {
//               solr: { default: { fq: `site_id:${route.value.params.id}` } },
//               api: { default: { site: route.value.params.id } },
//             },
//           }),
//         ),
//       );
//       const [siteResponse, attachmentResponse, hydratedTabs] =
//         await Promise.all([
//           sitePromise,
//           attachmentPromise,
//           hydratedTabsPromise,
//         ]);
//
//       state.ids = siteResponse?.ids;
//       data.value?.site = siteResponse;
//       state.images = attachmentResponse ?? [];
//       state.tabs = hydratedTabs.filter((item) => item.count > 0);
//     });
//
//     const title = computed(() => {
//       const engTitle = isEmpty(data.value?.site?.name_en)
//         ? data.value?.site?.name
//         : data.value?.site?.name_en;
//       return $translate({ et: data.value?.site?.name, en: engTitle });
//     });
//     useRedirectInvalidTabRoute({
//       tabs: toRef(state, "tabs"),
//       watchableObject: toRef(state, "site"),
//       pending: toRef(fetchState, "pending"),
//       validRoute: toRef(state, "validRoute"),
//     });
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t("site.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             hid: "og:title",
//             content: `${title.value} | ${i18n.t("site.pageTitle")}`,
//           },
//           {
//             property: "description",
//             hid: "description",
//             content: data.value?.site?.description ?? undefined,
//           },
//           {
//             property: "og:description",
//             hid: "og:description",
//             content: data.value?.site?.description ?? undefined,
//           },
//           {
//             property: "og:image",
//             hid: "og:image",
//             content: state.images[0]?.filename
//               ? $img(
//                   `${state.images[0]?.filename}`,
//                   { size: "small" },
//                   {
//                     provider: "geocollections",
//                   },
//                 )
//               : undefined,
//           },
//         ],
//       };
//     });
//     return {
//       ...toRefs(state),
//       title,
//       planArray,
//       elevation,
//       studied,
//       locality,
//       area,
//       icons,
//       isNil,
//     };
//   },
//   head: {},
//   computed: {},
// });
</script>

<template>
  <DetailNew :show-similar="showDrawer">
    <template #title>
      <HeaderDetailNew :title="title">
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
  </DetailNew>
</template>
