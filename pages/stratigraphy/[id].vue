<script setup lang="ts">
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import type { MapMarker } from "~/types/map";

const route = useRoute();

const { $translate, $geoloogiaFetch, $solrFetch } = useNuxtApp();
const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();
const tabs = {
  general: {
    type: "static",
    routeName: "stratigraphy-id",
    title: "common.general",
    props: {},
  } satisfies Tab,
};

const { data } = await useAsyncData("stratigraphy", async () => {
  const stratigraphy = await $geoloogiaFetch<any>(`/stratigraphy/${route.params.id}/`, {
    query: {
      nest: 2,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Stratigraphy not found",
        });
      }
    },
  });

  const hydratedTabs = await hydrateTabs(tabs, {
    props: { general: { stratigraphy } },
  });

  return {
    stratigraphy,
    tabs: filterHydratedTabs(hydratedTabs, [
      "general",
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

// export default defineComponent({
//   components: {
//     HeaderDetail,
//     Tabs,
//     TableRowLink,
//     TableRow,
//     DataTableStratigraphyStratotype,
//     MapDetail,
//     Detail,
//     BaseTable,
//   },
//   setup() {
//     const { $services, $getAPIFieldValues, $hydrateTab, $translate, i18n }
//       = useContext();
//     const route = useRoute();
//     const state = reactive({
//       stratigraphy: null as any,
//       ids: {} as any,
//       validRoute: {} as Location,
//       tabs: [] as Tab[],
//       stratotypes: [] as any[],
//       stratotypeCount: 0,
//       options: STRATOTYPE.options,
//     });
//     const stratigraphyMarkers = computed((): MapMarker[] => {
//       return state.stratotypes?.reduce((prev, stratotype) => {
//         if (stratotype.locality) {
//           prev.push({
//             latitude: stratotype?.locality?.latitude,
//             longitude: stratotype?.locality?.longitude,
//             text: `${$translate({
//               et: stratotype?.locality?.locality,
//               en: stratotype?.locality?.locality_en,
//             })} (${$translate({
//               et: stratotype?.stratotype_type?.value,
//               en: stratotype?.stratotype_type?.value_en,
//             })})`,
//           });
//         }
//         return prev;
//       }, []);
//     });
//     const mapIsEstonian = computed(() => {
//       return state.stratotypes.some(
//         item => item?.locality?.country?.value_en === "Estonia",
//       );
//     });
//
//     const { fetchState } = useFetch(async () => {
//       const stratigraphyPromise = $services.sarvREST.getResource(
//         "stratigraphy",
//         Number.parseInt(route.value.params.id),
//         {
//           params: {
//             nest: 1,
//           },
//         },
//       );
//
//       const stratotypePromise = $services.sarvREST.getResourceList(
//         "stratigraphy_stratotype",
//         {
//           ...STRATOTYPE.options,
//           defaultParams: {
//             stratigraphy: route.value.params.id,
//             nest: 2,
//           },
//           fields: $getAPIFieldValues(HEADERS_STRATOTYPE),
//         },
//       );
//       const [stratigraphyResponse, stratotypeResponse] = await Promise.all([
//         stratigraphyPromise,
//         stratotypePromise,
//       ]);
//
//       state.ids = stratigraphyResponse?.ids;
//       state.stratigraphy = stratigraphyResponse;
//       state.stratotypes = stratotypeResponse.items;
//       state.stratotypeCount = stratotypeResponse.count;
//
//       const tabsObject = TABS_STRATIGRAPHY;
//
//       tabsObject.byIds.specimen.props.stratigraphy = state.stratigraphy;
//       tabsObject.byIds.sample.props.stratigraphy = state.stratigraphy;
//
//       const tabs = tabsObject.allIds.map(id => tabsObject.byIds[id]);
//
//       const hydratedTabs = await Promise.all(
//         tabs.map(tab =>
//           $hydrateTab(tab, {
//             countParams: {
//               api: {
//                 default: {
//                   stratigraphy: route.value.params.id,
//                 },
//                 stratigraphy_stratotype: {
//                   stratigraphy: route.value.params.id,
//                 },
//                 stratigraphy_synonym: {
//                   stratigraphy: route.value.params.id,
//                 },
//               },
//               solr: {
//                 default: {
//                   fq: state.stratigraphy.hierarchy_string
//                     ? `(stratigraphy_hierarchy:(${state.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${state.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${state.stratigraphy.hierarchy_string}*))`
//                     : `(stratigraphy_hierarchy:("") OR age_hierarchy:("") OR lithostratigraphy_hierarchy:(""))`,
//                 },
//                 lithostratigraphy: {
//                   fq: `age_chronostratigraphy:${route.value.params.id}`,
//                 },
//                 subunits: {
//                   fq: `parent_id:${route.value.params.id}`,
//                 },
//               },
//               fields: tab.fields ?? "id",
//             },
//           }),
//         ),
//       );
//       state.tabs = hydratedTabs.filter(tab => tab.count > 0);
//     });
//
//     const title = computed(() =>
//       $translate({
//         et: state.stratigraphy?.stratigraphy,
//         en: state.stratigraphy?.stratigraphy_en,
//       }),
//     );
//     useRedirectInvalidTabRoute({
//       tabs: toRef(state, "tabs"),
//       watchableObject: toRef(state, "stratigraphy"),
//       pending: toRef(fetchState, "pending"),
//       validRoute: toRef(state, "validRoute"),
//     });
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t("stratigraphy.pageTitle")}`,
//         meta: [
//           {
//             property: "og:title",
//             hid: "og:title",
//             content: `${title.value} | ${i18n.t("stratigraphy.pageTitle")}`,
//           },
//           {
//             property: "og:url",
//             hid: "og:url",
//             content: route.value.path,
//           },
//         ],
//       };
//     });
//     return {
//       ...toRefs(state),
//       title,
//       stratigraphyMarkers,
//       mapIsEstonian,
//       isEmpty,
//       isNull,
//     };
//   },
//   head: {},
// });
</script>

<template>
  <DetailNew :show-similar="false">
    <template #title>
      <HeaderDetailNew :title="title">
        <template #tabs>
          <DetailTabs :tabs="data.tabs" />
        </template>
      </HeaderDetailNew>
    </template>
    <NuxtPage v-bind="activeTabProps" />
  </DetailNew>
</template>
