<script setup lang="ts">
import { mdiFileDownloadOutline } from "@mdi/js";
import isEmpty from "lodash/isEmpty";
import type { MapMarker } from "~/types/map";

const props = defineProps<{ area: any }>();

const area = computed(() => props.area);
const deposit = computed(() => props.area.maaamet_maardla);
const miningClaim = computed(() => props.area.maaamet_maeeraldis);
const eelisArray = computed(() => props.area.eelis?.split(";") ?? []);
const egfArray = computed(() => props.area.egf?.split(";") ?? []);
const planArray = computed(() => props.area.text1?.split(";") ?? []);
const geojson = computed(() => {
  if (isEmpty(props.area))
    return null;
  if (isEmpty(props.area.polygon))
    return null;
  const parsedPolygon
    = JSON.parse(
      // NOTE: Remove trailing commas from JSON object string

      props.area.polygon?.replace(/\,(?!\s*?[\{\[\"\'\w])/g, ""),
    ) ?? null;
  if (parsedPolygon === null)
    return null;
  if (!(Array.isArray(parsedPolygon))) { return parsedPolygon; }
  else {
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: parsedPolygon,
      },
    };
  }
});
const route = useRoute();
const localePath = useLocalePath();
const { $solrFetch, $translate } = useNuxtApp();

const { data: siteMarkers } = await useAsyncData("siteMarkers", async () => {
  const sites = await $solrFetch<{
    response: { numFound: number; docs: any[] };
  }>("/site", {
    query: {
      json: {
        query: `area_id:${route.params.id}`,
      },
    },
  });
  return sites.response.docs.reduce((filtered: MapMarker[], item: any) => {
    if (!(item.longitude && item.latitude))
      return filtered;
    const isItemInArray = filtered.some(
      (existingItem: any) =>
        existingItem.latitude === item.latitude
        && existingItem.longitude === item.longitude,
    );
    if (isItemInArray)
      return filtered;
    const newItem = {
      longitude: item.longitude,
      latitude: item.latitude,
      text: $translate({ et: item.name, en: item.name_en }) ?? `ID: ${item.id}`,
      routeName: "site",
      id: item.id,
    };

    return [...filtered, newItem];
  }, []);
});
</script>

<template>
  <v-container style="margin: initial">
    <v-row>
      <v-col
        :sm="12"
        :md="6"
        :lg="7"
        :xl="5"
      >
        <v-card>
          <base-table>
            <table-row
              :title="$t('area.name')"
              :value="$translate({ et: area.name, en: area.name_en })"
            />
            <table-row-link
              v-if="area.area_type === 2"
              :title="$t('area.areaType')"
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
              :title="$t('area.areaType')"
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
              :title="$t('area.parentArea')"
              :value="
                $translate({
                  et: area.parent_area.name,
                  en: area.parent_area.name_en,
                })
              "
            />
            <table-row
              :title="$t('area.county')"
              :value="
                $translate({
                  et: area.maakond__maakond,
                  en: area.maakond__maakond_en,
                })
              "
            />
            <table-row :title="$t('area.areaHa')" :value="area.area_ha" />
            <table-row
              :title="$t('area.depositAreaHa')"
              :value="area.deposit_area_ha"
            />
            <table-row v-if="egfArray.length > 0" :title="$t('area.egf')">
              <template #value>
                <span v-for="(item, index) in egfArray" :key="index">
                  <a class="text-link" @click="$openEgf(item)">
                    {{ item }}
                  </a>
                  <span v-if="index !== egfArray.length - 1" class="mr-1">|</span>
                </span>
              </template>
            </table-row>
            <table-row-link
              :title="$t('area.maardla')"
              @link-click="$openEelis(area.maardla)"
            >
              <template #value>
                {{ $t("area.maardlaLink") }} ({{ area.maardla }})
              </template>
            </table-row-link>
            <table-row v-if="eelisArray.length > 0" :title="$t('area.eelis')">
              <template #value>
                <span v-for="(item, index) in eelisArray" :key="index">
                  <a class="text-link" @click="$openEelis(item)">
                    {{ item }}
                  </a>
                  <span v-if="index !== eelisArray.length - 1" class="mr-1">|</span>
                </span>
              </template>
            </table-row>

            <table-row
              v-if="area.area_type === 2 && planArray.length > 0"
              :title="$t('area.text1')"
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
                    <v-icon size="small" color="primary-darken-2">
                      {{ mdiFileDownloadOutline }}
                    </v-icon>
                  </a>
                  <span v-if="index !== planArray.length - 1" class="mr-1">|</span>
                </span>
              </template>
            </table-row>
            <table-row
              v-if="area.date_added"
              :title="$t('area.dateAdded')"
              :value="$formatDate(area.date_added)"
            />
            <table-row
              v-if="area.date_changed"
              :title="$t('area.dateChanged')"
              :value="$formatDate(area.date_changed)"
            />
          </base-table>
        </v-card>
        <template
          v-if="$translate({ et: area.description, en: area.description_en })"
        >
          <div class="text-h6 py-2">
            {{ $t("area.description") }}
          </div>
          <div
            v-html="
              $translate({
                et: area.description,
                en: area.description_en,
              })
            "
          />
        </template>

        <template v-if="deposit">
          <div class="text-h6 py-2">
            {{ $t("area.deposit") }}
          </div>
          <v-alert
            density="compact"
            type="info"
            color="accent"
            variant="outlined"
            class="text-body-2 mb-2"
          >
            {{ $t("alert.estonianLandBoardDatabase") }}
          </v-alert>
          <v-card>
            <base-table>
              <table-row-link
                :title="$t('deposit.registrationNo')"
                :value="deposit.id"
                @link-click="
                  $openWindow(
                    `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${deposit.id}`,
                  )
                "
              />
              <table-row
                :title="$t('deposit.name')"
                :value="`${deposit.nimetus} ${
                  deposit.maardla_os ? `(${deposit.maardla_os})` : ''
                }`"
              />
              <table-row
                :title="$t('deposit.name')"
                :value="deposit.maardla_os"
              />
              <table-row :title="$t('deposit.area')" :value="deposit.pindala" />
              <table-row :title="$t('deposit.isBedrock')">
                <template #value>
                  <base-boolean :value="deposit.aluspohja" />
                </template>
              </table-row>
              <table-row
                :title="$t('deposit.commodity')"
                :value="deposit.maavara"
              />
              <table-row
                :title="$t('deposit.usage')"
                :value="deposit.pohimaavar"
              />
              <table-row
                :title="$t('deposit.additionalCommodity')"
                :value="deposit.kaasmaavar"
              />

              <table-row
                :title="$t('deposit.miningConditions')"
                :value="deposit.maeteh_ti"
              />
              <table-row
                :title="$t('deposit.enviromentalRestrictions')"
                :value="deposit.geookol_ti"
              />
              <table-row
                :title="$t('deposit.dataExportDate')"
                :value="deposit.eksporditi"
              />
            </base-table>
          </v-card>
        </template>
        <template v-if="miningClaim">
          <div class="text-h6 py-2">
            {{ $t("area.miningClaim") }}
          </div>
          <v-alert
            density="compact"
            type="info"
            color="accent"
            variant="outlined"
            class="text-body-2 mb-2"
          >
            {{ $t("alert.estonianLandBoardDatabase") }}
          </v-alert>
          <v-card>
            <base-table>
              <table-row :title="$t('miningClaim.number')">
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
              <table-row :title="$t('miningClaim.registrationNo')">
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
                :title="$t('miningClaim.name')"
                :value="`${miningClaim.nimetus} ${
                  miningClaim.maardla_os ? `(${miningClaim.maardla_os})` : ''
                }`"
              />
              <table-row
                :title="$t('miningClaim.area')"
                :value="miningClaim.pindala"
              />
              <table-row
                :title="$t('miningClaim.reserve')"
                :value="miningClaim.erald_varu"
              />
              <table-row
                :title="$t('miningClaim.usage')"
                :value="miningClaim.kas_eesm"
              />
              <table-row
                :title="$t('miningClaim.reclamation')"
                :value="miningClaim.rekult"
              />

              <table-row
                :title="$t('miningClaim.status')"
                :value="miningClaim.me_olek"
              />

              <table-row
                v-if="miningClaim.loa_number"
                :title="$t('miningClaim.extractionPermit')"
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
                :title="$t('miningClaim.period')"
                :value="`${miningClaim.loa_algus} - ${miningClaim.loa_lopp}`"
              />
              <table-row
                :title="$t('miningClaim.permitOwner')"
                :value="miningClaim.loa_omanik"
              />
              <table-row
                :title="$t('miningClaim.miningCompany')"
                :value="miningClaim.kaevandaja"
              />

              <table-row
                :title="$t('miningClaim.dataExportDate')"
                :value="miningClaim.eksporditi"
              />
            </base-table>
          </v-card>
        </template>
      </v-col>
      <v-col v-if="siteMarkers?.length > 0 || geojson" :xl="4">
        <map-detail
          rounded
          estonian-map
          estonian-bedrock-overlay
          :markers="siteMarkers"
          :geojson="geojson"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
