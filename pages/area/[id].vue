<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <header-detail
        :ids="prevNext"
        :title="pageTitle"
        :search-to="localePath({ path: '/area', query: getQueryParams() })"
        @click:next="searchPosition++"
        @click:previous="searchPosition--"
      />
    </template>

    <template #column-left>
      <v-row no-gutters justify="center">
        <v-col cols="12">
          <v-card-title class="subsection-title">{{
            $t("common.general")
          }}</v-card-title>
          <v-card-text>
            <base-table>
              <table-row
                :title="$t('area.name').toString()"
                :value="$translate({ et: area.name, en: area.name_en })"
              />
              <table-row-link
                v-if="area.area_type === 2"
                :title="$t('area.areaType').toString()"
                :value="
                  $translate({
                    et: area.area_type__name,
                    en: area.area_type__name_en,
                  })
                "
                @link-click="$openTurba('turbaala', area.id)"
              />
              <table-row
                v-else
                :title="$t('area.areaType').toString()"
                :value="
                  $translate({
                    et: area.area_type.name,
                    en: area.area_type.name_en,
                  })
                "
              />
              <table-row-link
                v-if="area.parent_area"
                nuxt
                :href="
                  localePath({
                    name: 'area-id',
                    params: { id: area.parent_area.id },
                  })
                "
                :title="$t('area.parentArea').toString()"
                :value="
                  $translate({
                    et: area.parent_area.name,
                    en: area.parent_area.name_en,
                  })
                "
              />
              <table-row
                :title="$t('area.county').toString()"
                :value="
                  $translate({
                    et: area.maakond__maakond,
                    en: area.maakond__maakond_en,
                  })
                "
              />
              <table-row
                :title="$t('area.areaHa').toString()"
                :value="area.area_ha"
              />
              <table-row
                :title="$t('area.depositAreaHa').toString()"
                :value="area.deposit_area_ha"
              />
              <table-row
                v-if="
                  $translate({
                    et: area.description,
                    en: area.description_en,
                  })
                "
                :title="$t('area.description').toString()"
              >
                <template #value>
                  <!-- eslint-disable vue/no-v-html -->
                  <div
                    v-html="
                      $translate({
                        et: area.description,
                        en: area.description_en,
                      })
                    "
                  />
                  <!-- eslint-enable -->
                </template>
              </table-row>
              <table-row :title="$t('area.egf').toString()">
                <template #value>
                  <span v-for="(item, index) in egfArray" :key="index">
                    <a class="text-link" @click="$openEgf(item)">
                      {{ item }}
                    </a>
                    <span v-if="index !== egfArray.length - 1" class="mr-1"
                      >|</span
                    >
                  </span>
                </template>
              </table-row>
              <table-row-link
                :title="$t('area.maardla').toString()"
                @link-click="$openEelis(area.maardla)"
              >
                <template #value>
                  {{ $t("area.maardlaLink") }} ({{ area.maardla }})
                </template>
              </table-row-link>
              <table-row :title="$t('area.eelis').toString()">
                <template #value>
                  <span v-for="(item, index) in eelisArray" :key="index">
                    <a class="text-link" @click="$openEelis(item)">
                      {{ item }}
                    </a>
                    <span v-if="index !== eelisArray.length - 1" class="mr-1"
                      >|</span
                    >
                  </span>
                </template>
              </table-row>

              <table-row
                v-if="area.area_type === 2"
                :title="$t('area.text1').toString()"
                :value="planArray"
              >
                <template #value>
                  <span v-for="(item, index) in planArray" :key="index">
                    <a
                      class="text-link"
                      :download="item.trim()"
                      @click="$openTurba('plaanid', item.trim(), false)"
                    >
                      {{ item }}
                      <v-icon small color="primary darken-2">
                        {{ mdiFileDownloadOutline }}
                      </v-icon>
                    </a>
                    <span v-if="index !== planArray.length - 1" class="mr-1"
                      >|</span
                    >
                  </span>
                </template>
              </table-row>
              <table-row
                v-if="area.date_added"
                :title="$t('area.dateAdded').toString()"
                :value="$formatDate(area.date_added)"
              />
              <table-row
                v-if="area.date_changed"
                :title="$t('area.dateChanged').toString()"
                :value="$formatDate(area.date_changed)"
              />
            </base-table>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row v-if="deposit" no-gutters justify="center">
        <v-col cols="12">
          <v-card-title class="subsection-title">{{
            $t("area.deposit")
          }}</v-card-title>
          <v-card-text>
            <v-alert
              dense
              type="info"
              color="accent"
              outlined
              class="text-body-2"
            >
              {{ $t("alert.estonianLandBoardDatabase") }}
            </v-alert>
            <base-table>
              <table-row-link
                :title="$t('deposit.registrationNo').toString()"
                :value="deposit.id"
                @link-click="
                  $openWindow(
                    `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${deposit.id}`,
                  )
                "
              />
              <table-row
                :title="$t('deposit.name').toString()"
                :value="`${deposit.nimetus} ${
                  deposit.maardla_os ? `(${deposit.maardla_os})` : ''
                }`"
              />
              <table-row
                :title="$t('deposit.name').toString()"
                :value="deposit.maardla_os"
              />
              <table-row
                :title="$t('deposit.area').toString()"
                :value="deposit.pindala"
              />
              <table-row :title="$t('deposit.isBedrock').toString()">
                <template #value>
                  <base-boolean :value="deposit.aluspohja" />
                </template>
              </table-row>
              <table-row
                :title="$t('deposit.commodity').toString()"
                :value="deposit.maavara"
              />
              <table-row
                :title="$t('deposit.usage').toString()"
                :value="deposit.pohimaavar"
              />
              <table-row
                :title="$t('deposit.additionalCommodity').toString()"
                :value="deposit.kaasmaavar"
              />

              <table-row
                :title="$t('deposit.miningConditions').toString()"
                :value="deposit.maeteh_ti"
              />
              <table-row
                :title="$t('deposit.enviromentalRestrictions').toString()"
                :value="deposit.geookol_ti"
              />
              <table-row
                :title="$t('deposit.dataExportDate').toString()"
                :value="deposit.eksporditi"
              />
            </base-table>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row v-if="miningClaim" no-gutters justify="center">
        <v-col cols="12">
          <v-card-title class="subsection-title">{{
            $t("area.miningClaim")
          }}</v-card-title>
          <v-card-text>
            <v-alert
              dense
              type="info"
              color="accent"
              outlined
              class="text-body-2"
            >
              {{ $t("alert.estonianLandBoardDatabase") }}
            </v-alert>
            <base-table>
              <table-row :title="$t('miningClaim.number').toString()">
                <template #value>
                  <base-link-external
                    @click.native="
                      $openWindow(
                        `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7935&LOA_NUMBER=${miningClaim.loa_number}&hide=true`,
                      )
                    "
                  >
                    {{ area.maaamet_maeeraldis.id }}
                  </base-link-external>
                  (Maaamet XGIS2)
                </template>
              </table-row>
              <table-row :title="$t('miningClaim.registrationNo').toString()">
                <template #value>
                  <base-link-external
                    @click.native="
                      $openWindow(
                        `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${miningClaim.reg_kaart}`,
                      )
                    "
                  >
                    {{ miningClaim.reg_kaart }}
                  </base-link-external>
                  (Maaamet XGIS2)
                </template>
              </table-row>
              <table-row
                :title="$t('miningClaim.name').toString()"
                :value="`${miningClaim.nimetus} ${
                  miningClaim.maardla_os ? `(${miningClaim.maardla_os})` : ''
                }`"
              />
              <table-row
                :title="$t('miningClaim.area').toString()"
                :value="miningClaim.pindala"
              />
              <table-row
                :title="$t('miningClaim.reserve').toString()"
                :value="miningClaim.erald_varu"
              />
              <table-row
                :title="$t('miningClaim.usage').toString()"
                :value="miningClaim.kas_eesm"
              />
              <table-row
                :title="$t('miningClaim.reclamation').toString()"
                :value="miningClaim.rekult"
              />

              <table-row
                :title="$t('miningClaim.status').toString()"
                :value="miningClaim.me_olek"
              />

              <table-row
                v-if="miningClaim.loa_number"
                :title="$t('miningClaim.extractionPermit').toString()"
              >
                <template #value>
                  <base-link-external
                    @click.native="
                      $openWindow(
                        `https://kotkas.envir.ee/permits/public_index?search=1&permit_nr=${miningClaim.loa_number}`,
                      )
                    "
                  >
                    {{ miningClaim.loa_number }}
                  </base-link-external>
                  (Kotkas)
                </template>
              </table-row>
              <table-row
                :title="$t('miningClaim.period').toString()"
                :value="`${miningClaim.loa_algus} - ${miningClaim.loa_lopp}`"
              />
              <table-row
                :title="$t('miningClaim.permitOwner').toString()"
                :value="miningClaim.loa_omanik"
              />
              <table-row
                :title="$t('miningClaim.miningCompany').toString()"
                :value="miningClaim.kaevandaja"
              />

              <table-row
                :title="$t('miningClaim.dataExportDate').toString()"
                :value="miningClaim.eksporditi"
              />
            </base-table>
          </v-card-text>
        </v-col>
      </v-row>
    </template>

    <template v-if="data?.siteMarkers.length > 0 || geojson" #column-right>
      <v-card-title class="subsection-title">{{
        $t("locality.map")
      }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <map-detail
            rounded
            estonian-map
            estonian-bedrock-overlay
            :markers="data?.siteMarkers"
            :geojson="geojson"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
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
import { mdiFileDownloadOutline } from "@mdi/js";
import isEmpty from "lodash/isEmpty";
import { type Tab, TABS_AREA } from "~/constants";
import type { MapMarker } from "~/types/map";
import type { RouteLocationRaw } from "vue-router";

const { $geoloogiaFetch, $solrFetch, $hydrateTab, $translate } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const validRoute = ref<RouteLocationRaw>({});

const area = computed(() => data.value?.area);
const deposit = computed(() => data.value?.deposit);
const miningClaim = computed(() => data.value?.area.miningClaim);
const eelisArray = computed(() => data.value?.area.eelis?.split(";") ?? []);
const egfArray = computed(() => data.value?.area.egf?.split(";") ?? []);
const planArray = computed(() => data.value?.area.text1?.split(";") ?? []);
const geojson = computed(() => {
  if (isEmpty(data.value?.area)) return null;
  if (isEmpty(data.value?.area.polygon)) return null;
  const parsedPolygon =
    JSON.parse(
      // NOTE: Remove trailing commas from JSON object string
      // eslint-disable-next-line no-useless-escape
      data.value?.area.polygon?.replace(/\,(?!\s*?[\{\[\"\'\w])/g, ""),
    ) ?? null;
  if (parsedPolygon === null) return null;
  if (!(parsedPolygon instanceof Array)) return parsedPolygon;
  else
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: parsedPolygon,
      },
    };
});

const areasStore = useAreas();
const { getQueryParams } = areasStore;
const { solrFilters, solrQuery, solrSort, searchPosition, resultsCount } =
  storeToRefs(areasStore);

const { prevNext } = await usePrevNext("/area", {
  searchPosition,
  solrParams: computed(() => ({
    query: solrQuery.value,
    filter: solrFilters.value,
    sort: solrSort.value,
    fields: ["id", "name", "name_en"],
  })),
  count: resultsCount.value,
  mapper: (doc) => ({
    id: doc.id,
    name: {
      et: doc.name,
      en: doc.name_en,
    },
  }),
});
const { data, pending, error } = useLazyAsyncData("area", async () => {
  const areaPromise = $geoloogiaFetch(`/area/${route.params.id}`, {
    query: {
      nest: 1,
    },
  });
  const sitesForMapPromise = $solrFetch("/site", {
    query: {
      q: "*",
      fq: `area_id:${route.params.id}`,
    },
  });
  const tabs = TABS_AREA.allIds.map((id) => TABS_AREA.byIds[id]);
  const hydratedTabsPromise = Promise.all(
    tabs.map(
      async (tab) =>
        await $hydrateTab(tab, {
          countParams: {
            solr: {
              default: { fq: `area_id:${route.params.id}` },
            },
            api: {
              default: { area: route.params.id },
              relatedArea: { parent_area: route.params.id },
            },
          },
        }),
    ),
  );
  const [areaResponse, sitesForMapResponse, hydratedTabs] = await Promise.all([
    areaPromise,
    sitesForMapPromise,
    hydratedTabsPromise,
  ]);
  return {
    ids: areaResponse?.ids,
    area: areaResponse,
    tabs: hydratedTabs.filter((tab) => tab.count > 0),
    deposit: areaResponse.maaamet_maardla,
    miningClaim: areaResponse.maaamet_maeeraldis,
    siteMarkers: sitesForMapResponse.response.docs.reduce(
      (filtered: MapMarker[], item: any) => {
        if (!(item.longitude && item.latitude)) return filtered;
        const isItemInArray = filtered.some(
          (existingItem: any) =>
            existingItem.latitude === item.latitude &&
            existingItem.longitude === item.longitude,
        );
        if (isItemInArray) return filtered;
        const newItem = {
          longitude: item.longitude,
          latitude: item.latitude,
          text:
            $translate({ et: item.name, en: item.name_en }) ?? `ID: ${item.id}`,
          routeName: "site",
          id: item.id,
        };

        return [...filtered, newItem];
      },
      [],
    ),
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

useRedirectInvalidTabRoute({
  tabs: data.value?.tabs ?? [],
  watchableObject: data.value?.area,
  pending,
  validRoute: validRoute,
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
