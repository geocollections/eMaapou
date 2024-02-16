<template>
  <detail-new :show-similar="showDrawer">
    <template #title>
      <header-detail-new
        :title="
          $translate({
            et: data?.locality.locality,
            en: data?.locality.locality_en,
          })
        "
      >
        <template #sub>
          <v-btn
            v-if="data?.drillcore"
            size="small"
            rounded
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
            <v-icon start>{{ mdiScrewMachineFlatTop }}</v-icon>
            {{
              $translate({
                et: data?.drillcore.drillcore,
                en: data?.drillcore.drillcore_en,
              })
            }}
          </v-btn>
          <v-btn
            v-if="data?.analysisResultsCount > 0"
            size="small"
            rounded
            color="accent"
            class="mt-2 mr-2 montserrat text-none"
            :to="
              localePath({
                path: '/analytical-data',
                query: { locality: route.params.id },
              })
            "
          >
            <v-icon start>{{ mdiChartScatterPlot }}</v-icon>
            {{ $t("locality.linkToAnalyticalData") }}
          </v-btn>
          <v-btn
            v-if="data?.referenceCount > 0"
            size="small"
            rounded
            color="accent"
            class="mt-2 montserrat text-none"
            :href="`https://kirjandus.geoloogia.info/reference/?localities=${title}`"
          >
            <v-icon start>{{ mdiBookOpenPageVariantOutline }}</v-icon>
            {{ $t("locality.linkGeoscienceLiterature") }}
            <v-icon end>{{ mdiOpenInNew }}</v-icon>
          </v-btn>
        </template>
        <template #tabs>
          <DetailTabs :tabs="data?.tabs" />
        </template>
      </header-detail-new>
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
            <v-icon start size="small">{{ mdiEarth }}</v-icon>
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
  </detail-new>
</template>

<script setup lang="ts">
import {
  mdiScrewMachineFlatTop,
  mdiChartScatterPlot,
  mdiBookOpenPageVariantOutline,
  mdiOpenInNew,
  mdiEarth,
} from "@mdi/js";
import type { Tab } from "~/composables/useTabs";

const { $solrFetch, $translate, $geoloogiaFetch } = useNuxtApp();

const localePath = useLocalePath();
const route = useRoute();

const localitiesStore = useLocalities();
const { getQueryParams } = localitiesStore;
const { solrFilters, solrQuery, solrSort } = storeToRefs(localitiesStore);

const { hydrateTabs, filterHydratedTabs, getCurrentTabRouteProps } = useTabs();

const activeTabProps = computed(() => {
  return getCurrentTabRouteProps(data.value?.tabs ?? []);
});
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
        solrSort.value ??
        $translate({ et: "locality asc", en: "locality_en asc" }),
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
      const res = await $geoloogiaFetch("/locality_reference/", {
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
      const res = await $geoloogiaFetch("/locality_description/", {
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
      const res = await $geoloogiaFetch("/attachment_link/", {
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
  boxes: {
    type: "dynamic",
    routeName: "locality-id-drillcore-boxes",
    title: "locality.drillcoreBoxes",
    count: async () => {
      return 0;
    },
    props: {},
  } satisfies Tab,
  fossils: {
    type: "dynamic",
    routeName: "locality-id-fossils",
    title: "locality.fossils",
    count: async () => {
      const res = await $solrFetch("/taxon_search", {
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
      const res = await $solrFetch("/specimen", {
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
      const res = await $geoloogiaFetch("/locality_synonym/", {
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
      const res = await $geoloogiaFetch("/stratigraphy_stratotype/", {
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
      const res = await $solrFetch("/analysis", {
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
      return $solrFetch("/analysis_results", {
        query: {
          q: `locality_id:${route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
          rows: 0,
        },
      }).then((res) => res.response.numFound);
    },
    props: {},
  } satisfies Tab,
};

const { data, pending } = await useAsyncData("locality", async () => {
  const locality = await $geoloogiaFetch(`/locality/${route.params.id}/`, {
    query: {
      nest: 1,
    },
    onResponseError: (error) => {
      if (error.response?.status === 404) {
        throw createError({
          statusCode: 404,
          message: "Locality not found",
        });
      }
    },
  });

  const drillcorePromise = $geoloogiaFetch("/drillcore/", {
    query: {
      locality: route.params.id,
    },
  });
  // Checking if locality has a related .las file to show in graph tab
  const lasFilePromise = $geoloogiaFetch("/attachment_link/", {
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
  const drillcore =
    drillcoreResponse.results.length > 0 ? drillcoreResponse.results[0] : null;

  const hydratedTabs = await hydrateTabs(tabs, {
    props: {
      general: { locality },
      boxes: { drillcore: drillcore?.id },
      analysis_results: {
        localityObject: locality,
        attachment: lasFileResponse?.results?.[0]?.attachment,
      },
    },
  });
  hydratedTabs.boxes.count = drillcore?.boxes || 0;
  hydratedTabs.analysis_results.count =
    hydratedTabs.analysis_results.count +
    hydratedTabs.locality_description.count +
    hydratedTabs.sample.count +
    (lasFileResponse?.results?.[0]?.attachment ? 1 : 0);

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
  };
});
const title = computed(() =>
  $translate({
    et: data.value?.locality.locality,
    en: data.value?.locality.locality_en,
  }),
);
redirectInvalidTab({
  redirectRoute: localePath({
    name: "locality-id",
    params: { id: route.params.id },
  }),
  tabs: data.value?.tabs ?? [],
});

// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: `${title.value} | ${i18n.t('locality.pageTitle')}`,
//         meta: [
//           {
//             property: 'og:title',
//             hid: 'og:title',
//             content: `${title.value} | ${i18n.t('locality.pageTitle')}`,
//           },
//           {
//             property: 'og:url',
//             hid: 'og:url',
//             content: route.value.path,
//           },
//           {
//             property: 'og:image',
//             hid: 'og:image',
//             content: imageBarState.images[0]?.filename
//               ? $img(
//                   `${imageBarState.images[0]?.filename}`,
//                   { size: 'small' },
//                   {
//                     provider: 'geocollections',
//                   }
//                 )
//               : '',
//           },
//         ],
//       }
//     })
//     return {
//       ...toRefs(state),
//       ...toRefs(imageBarState),
//       title,
//       analysisResultsCount,
//       referenceCount,
//       type,
//       country,
//       municipality,
//       settlementUnit,
//       coordinatePrecision,
//       coordinateMethod,
//       coordinateAgent,
//       stratigraphyTop,
//       stratigraphyBase,
//       goToGeoscienceLiterature,
//       goToAnalyticalData,
//       isNil,
//       isEmpty,
//       imageQuery,
//       icons,
//     }
//   },
//   head: {},
// })
</script>
