<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <header-detail
        :ids="prevNext"
        :title="
          $translate({
            et: data?.locality.locality,
            en: data?.locality.locality_en,
          })
        "
        :search-to="localePath({ path: '/locality', query: getQueryParams() })"
        @click:next="searchPosition++"
        @click:previous="searchPosition--"
      />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t("common.general")
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row
            :title="$t('locality.name').toString()"
            :value="
              $translate({
                et: data?.locality.locality,
                en: data?.locality.locality_en,
              })
            "
          />
          <table-row
            :title="$t('locality.number').toString()"
            :value="data?.locality.number"
          />
          <table-row
            v-if="type"
            :title="$t('locality.type').toString()"
            :value="
              $translate({
                et: type.value,
                en: type.value_en,
              })
            "
          />
          <table-row
            v-if="country"
            :title="$t('locality.country').toString()"
            :value="
              $translate({
                et: country.value,
                en: country.value_en,
              })
            "
          />
          <table-row
            v-if="municipality"
            :title="$t('locality.parish').toString()"
            :value="
              $translate({
                et: municipality.vald,
                en: municipality.vald_en,
              })
            "
          />
          <table-row
            v-if="settlementUnit"
            :title="$t('locality.settlement').toString()"
            :value="
              $translate({
                et: settlementUnit.asustusyksus,
                en: settlementUnit.asustusyksus_en,
              })
            "
          />
          <table-row
            :title="$t('locality.elevation').toString()"
            :value="data?.locality.elevation"
          />
          <table-row
            :title="$t('locality.latitude').toString()"
            :value="data?.locality.latitude"
          />
          <table-row
            :title="$t('locality.longitude').toString()"
            :value="data?.locality.longitude"
          />
          <table-row
            :title="$t('locality.coordinateSystem').toString()"
            :value="data?.locality.coord_system"
          />
          <table-row
            :title="$t('locality.coordinateX').toString()"
            :value="data?.locality.coordx"
          />
          <table-row
            :title="$t('locality.coordinateY').toString()"
            :value="data?.locality.coordy"
          />
          <table-row
            v-if="coordinatePrecision"
            :title="$t('locality.coordinatePrecision').toString()"
            :value="coordinatePrecision.value"
          />
          <table-row
            v-if="coordinateMethod"
            :title="$t('locality.coordinateMethod').toString()"
            :value="
              $translate({
                et: coordinateMethod.value,
                en: coordinateMethod.value_en,
              })
            "
          />
          <table-row
            v-if="coordinateAgent"
            :title="$t('locality.coordinateAgent').toString()"
            :value="coordinateAgent.agent"
          />
          <table-row
            :title="$t('locality.locationRemarks').toString()"
            :value="data?.locality.remarks_location"
          />
          <table-row-link
            v-if="stratigraphyTop"
            :title="$t('locality.stratigraphyTop').toString()"
            :value="
              $translate({
                et: stratigraphyTop.stratigraphy,
                en: stratigraphyTop.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: data?.locality.stratigraphy_top.id },
              })
            "
          />
          <table-row-link
            v-if="stratigraphyBase"
            :title="$t('locality.stratigraphyBase').toString()"
            :value="
              $translate({
                et: stratigraphyBase.stratigraphy,
                en: stratigraphyBase.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: data?.locality.stratigraphy_base.id },
              })
            "
          />
          <table-row
            :title="$t('locality.remarks').toString()"
            :value="data?.locality.remarks"
          />
          <table-row-link
            v-if="data?.locality.maaamet_pa_id"
            :title="$t('locality.linkLandBoard').toString()"
            :value="data?.locality.maaamet_pa_id"
            :href="`https://geoportaal.maaamet.ee/index.php?lang_id=1&action=viewPA&pa_id=${data?.locality.maaamet_pa_id}&fr=o&bk=1&page_id=382`"
          />
          <table-row
            v-if="data?.locality.date_added"
            :title="$t('locality.dateAdded').toString()"
            :value="$formatDate(data?.locality.date_added)"
          />
          <table-row
            v-if="data?.locality.date_changed"
            :title="$t('locality.dateChanged').toString()"
            :value="$formatDate(data?.locality.date_changed)"
          />
        </base-table>

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
          v-if="analysisResultsCount > 0"
          size="small"
          rounded
          color="accent"
          class="mt-2 mr-2 montserrat text-none"
          @click="goToAnalyticalData"
        >
          <v-icon start>{{ mdiChartScatterPlot }}</v-icon>
          {{ $t("locality.linkToAnalyticalData") }}
        </v-btn>
        <v-btn
          v-if="referenceCount > 0"
          size="small"
          rounded
          color="accent"
          class="mt-2 montserrat text-none"
          @click="goToGeoscienceLiterature"
        >
          <v-icon start>{{ mdiBookOpenPageVariantOutline }}</v-icon>
          {{ $t("locality.linkGeoscienceLiterature") }}
          <v-icon end>{{ mdiOpenInNew }}</v-icon>
        </v-btn>
      </v-card-text>
    </template>
    <template
      v-if="
        data?.locality && data?.locality.latitude && data?.locality.longitude
      "
      #column-right
    >
      <v-card-title class="subsection-title">
        {{ $t("locality.map") }}
      </v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <map-detail
            rounded
            :estonian-map="country ? country.value === 'Eesti' : false"
            :estonian-bedrock-overlay="
              country ? country.value === 'Eesti' : false
            "
            locality-overlay
            :center="{
              latitude: data?.locality.latitude,
              longitude: data?.locality.longitude,
            }"
            :markers="[
              {
                latitude: data?.locality.latitude,
                longitude: data?.locality.longitude,
                text: $translate({
                  et: data?.locality.locality,
                  en: data?.locality.locality_en,
                }),
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <image-bar
        v-if="data?.images.length > 0"
        class="mt-4"
        :images="data?.images"
        @update="imageQuery"
      />
      <v-card v-if="data?.tabs.length > 0" class="mt-4 mb-4">
        <DetailTabs :tabs="data?.tabs" :init-active-tab="validRoute">
          <template #default="{ activeTabProps }">
            <NuxtPage v-bind="activeTabProps" />
          </template>
        </DetailTabs>
      </v-card>
    </template>
  </detail>
</template>

<script setup lang="ts">
import {
  mdiScrewMachineFlatTop,
  mdiChartScatterPlot,
  mdiBookOpenPageVariantOutline,
  mdiOpenInNew,
} from "@mdi/js";

import type { RouteLocationRaw } from "vue-router";
import type { Tab } from "~/constants";
import { TABS_LOCALITY } from "~/constants";

const { $hydrateTab, $translate, $geoloogiaFetch } = useNuxtApp();

const localePath = useLocalePath();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const validRoute = ref<RouteLocationRaw>({});

const images = ref<any[]>([]);
const imagesHasNext = ref(true);

const analysisResultsCount = computed(
  () => data.value?.tabs.find((tab) => tab.id === "graphs")?.count ?? 0,
);
const referenceCount = computed(
  () =>
    data.value?.tabs.find((tab) => tab.id === "locality_reference")?.count ?? 0,
);
const type = computed(() => data.value?.locality.type);
const country = computed(() => data.value?.locality.country);
const municipality = computed(() => data.value?.locality.vald);
const settlementUnit = computed(() => data.value?.locality.asustusyksus);
const coordinatePrecision = computed(
  () => data.value?.locality.coord_det_precision,
);
const coordinateMethod = computed(() => data.value?.locality.coord_det_method);
const coordinateAgent = computed(() => data.value?.locality.coord_det_agent);
const stratigraphyTop = computed(() => data.value?.locality.stratigraphy_top);
const stratigraphyBase = computed(() => data.value?.locality.stratigraphy_base);

const imageQuery = async ({ rows, page }: { rows: number; page: number }) => {
  if (!imagesHasNext.value) return;
  // TODO: this request is defined in fetch also. Find a way to unify them.
  const newImages = await $geoloogiaFetch("/locality_image", {
    query: {
      locality: route.params.id,
      nest: 2,
      limit: rows,
      offset: rows * page,
      ordering: "sort",
    },
  }).then((res) => {
    imagesHasNext.value = !!res.next;
    return res.results
      .filter((image: any) => !image.attachment.is_private)
      .map((image: any) => ({
        id: image.attachment.id,
        filename: image.attachment.filename,
        author: image.attachment.author?.agent ?? null,
        date: image.attachment.date_created,
        dateText: image.attachment.date_created_free,
      }));
  });
  images.value = [...images.value, ...newImages];
};

const localitiesStore = useLocalities();
const { getQueryParams } = localitiesStore;
const { solrFilters, solrQuery, solrSort, searchPosition, resultsCount } =
  storeToRefs(localitiesStore);

const { prevNext } = await usePrevNext("/locality", {
  searchPosition,
  solrParams: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value ?? "locality asc",
    fields: ["id", "locality", "locality_en"],
  })),
  count: resultsCount.value,
  mapper: (doc) => ({
    id: doc.id,
    name: {
      et: doc.locality,
      en: doc.locality_en,
    },
  }),
});

const { data, pending, error } = await useLazyAsyncData(
  "locality",
  async () => {
    const localityPromise = $geoloogiaFetch(`/locality/${route.params.id}/`, {
      query: {
        nest: 1,
      },
    });
    const drillcorePromise = $geoloogiaFetch("/drillcore/", {
      query: {
        locality: route.params.id,
      },
    });

    const localityImagesPromise = $geoloogiaFetch("/locality_image/", {
      query: {
        locality: route.params.id,
        nest: 2,
        ordering: "sort",
      },
    }).then((res) => {
      return res.results
        .filter((image: any) => !image.attachment.is_private)
        .map((image: any) => ({
          id: image.attachment.id,
          filename: image.attachment.filename,
          author: image.attachment.author?.agent ?? null,
          date: image.attachment.date_created,
          dateText: image.attachment.date_created_free,
        }));
    });

    // Checking if locality has a related .las file to show in graph tab
    const lasFilePromise = $geoloogiaFetch("/attachment_link/", {
      query: {
        attachment__uuid_filename__iendswith: ".las",
        locality: route.params.id,
        fields: "attachment",
      },
    });
    const tabsObject = TABS_LOCALITY;
    const initTabs = tabsObject.allIds.map((id) => {
      return { ...tabsObject.byIds[id], objectId: id };
    });
    const hydratedTabsByIdsPromise = Promise.all(
      initTabs.map((tab) =>
        $hydrateTab(tab, {
          countParams: {
            solr: {
              default: {
                fq:
                  tab.id === "graphs"
                    ? `locality_id:${route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`
                    : `locality_id:${route.params.id}`,
              },
              fossils: {
                fq: `locality_id:${route.params.id} AND rank:[14 TO 18]`,
              },
            },
            api: { default: { locality: route.params.id } },
          },
        }),
      ),
    ).then((res): { [K: string]: Tab } => {
      return res.reduce((prev, tab) => {
        return { ...prev, [tab.objectId as string]: tab };
      }, {});
    });
    const [
      localityResponse,
      drillcoreResponse,
      localityImageResponse,
      lasFileResponse,
      hydratedTabsByIds,
    ] = await Promise.all([
      localityPromise,
      drillcorePromise,
      localityImagesPromise,
      lasFilePromise,
      hydratedTabsByIdsPromise,
    ]);
    const locality = localityResponse;
    const drillcore =
      drillcoreResponse.results.length > 0
        ? drillcoreResponse.results[0]
        : null;

    hydratedTabsByIds.boxes.count = drillcore?.boxes || 0;
    hydratedTabsByIds.boxes.props.drillcore = drillcore?.id;
    hydratedTabsByIds.analysis_results.props = {
      localityObject: locality,
      attachment: lasFileResponse?.results?.[0]?.attachment?.toString(),
      analysisResultsCount: hydratedTabsByIds.analysis_results.count,
    };
    hydratedTabsByIds.analysis_results.count =
      hydratedTabsByIds.analysis_results.count +
      hydratedTabsByIds.locality_description.count +
      hydratedTabsByIds.sample.count +
      (lasFileResponse?.results?.[0]?.attachment ? 1 : 0);

    return {
      ids: localityResponse?.ids,
      locality: localityResponse as any,
      drillcore,
      images: localityImageResponse ?? [],
      tabs: TABS_LOCALITY.allIds
        .map((id) => hydratedTabsByIds[id])
        .filter((tab) => {
          if (tab.id === "graphs") {
            // Todo: also add taxa check
            return (
              tab.props.attachment ||
              tab.props.analysisResultsCount > 0 ||
              tab.props.sampleCount > 0 ||
              tab.props.localityDescriptionCount > 0
            );
          } else return tab.count > 0;
        }),
    };
  },
);
const title = computed(() =>
  $translate({
    et: data.value?.locality.locality,
    en: data.value?.locality.locality_en,
  }),
);
useRedirectInvalidTabRoute({
  tabs: data.value?.tabs ?? [],
  watchableObject: data.value?.locality,
  pending,
  validRoute: validRoute,
});

const goToGeoscienceLiterature = () => {
  window.open(
    `https://kirjandus.geoloogia.info/reference/?localities=${title.value}`,
    "_blank",
    "height=800, width=800",
  );
};
const goToAnalyticalData = () => {
  router.push(
    localePath({
      name: "analytical-data",
      query: {
        locality: title.value,
      },
    }),
  );
};
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
