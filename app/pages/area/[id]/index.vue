<script setup lang="ts">
import type { Area } from "../[id].vue";
import { mdiFileDownloadOutline } from "@mdi/js";
import isEmpty from "lodash/isEmpty";

const props = defineProps<{ area: Area }>();

const area = computed(() => props.area);
const deposit = computed(() => props.area.land_board_deposit);
const miningClaim = computed(() => props.area.land_board_claim);
const eelisArray = computed(() => props.area.eelis?.split(";").map(id => id.trim()) ?? []);
const egfArray = computed(() => props.area.egf?.split(";").map(id => id.trim()) ?? []);
const planArray = computed(() => props.area.plans?.split(";").map(file => file.trim()) ?? []);
const geojson = computed(() => {
  if (isEmpty(props.area))
    return null;
  if (isEmpty(props.area.polygon))
    return null;
  const parsedPolygon
    = JSON.parse(

      props.area.polygon!.replace(/,(?!\s*[{["'\w])/g, ""),
    ) ?? null;
  if (parsedPolygon === null)
    return null;
  if (!(Array.isArray(parsedPolygon))) {
    return parsedPolygon;
  }
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
  return sites.response.docs.reduce((filtered: any[], item: any): MapMarker[] => {
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
      route: localePath({
        name: "site-id",
        params: { id: item.id },
      }),
    } as MapMarker;

    return [...filtered, newItem];
  }, [] as MapMarker[]);
});
</script>

<template>
  <div class="portal-content-margin portal-content">
    <div class="portal-row">
      <div
        class="portal-record-primary"
      >
        <table class="portal-bordered-table">
          <tbody>
            <TableRow
              :title="$t('area.name')"
              :value="$translate({ et: area.name, en: area.name_en })"
            />
            <TableRow
              v-if="area.type.id === 2"
              :title="$t('site.area')"
              :value="area"
            >
              <template #value>
                <BaseLinkExternal
                  :to="externalUrl(`turba.geoloogia.info/turbaala/${area.id}`)"
                >
                  {{
                    $translate({
                      et: area.name,
                      en: area.name_en,
                    })
                  }}
                </BaseLinkExternal>
              </template>
            </TableRow>
            <TableRow
              v-else
              :title="$t('area.areaType')"
              :value="
                $translate({
                  et: area.type.name,
                  en: area.type.name_en,
                })
              "
            />
            <TableRow
              v-if="area.parent"
              :title="$t('area.parentArea')"
              :value="area.parent"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="
                    localePath({
                      name: 'area-id',
                      params: { id: value.id },
                    })
                  "
                >
                  {{
                    $translate({
                      et: value.name,
                      en: value.name_en,
                    })
                  }}
                </BaseLink>
              </template>
            </TableRow>
            <TableRow
              v-if="area.county"
              :title="$t('area.county')"
              :value="
                $translate({
                  et: area.county.name,
                  en: area.county.name_en,
                })
              "
            />
            <TableRow :title="$t('area.areaHa')" :value="area.area_ha" />
            <TableRow
              :title="$t('area.depositAreaHa')"
              :value="area.deposit_area_ha"
            />
            <TableRow
              v-if="egfArray.length > 0"
              :title="$t('area.egf')"
              :value="egfArray"
            >
              <template #value>
                <span v-for="(id, index) in egfArray" :key="`egf-${index}`">
                  <BaseLinkExternal
                    :to="externalUrl(`fond.egt.ee/fond/egf/${id}`)"
                  >
                    {{ id }}
                  </BaseLinkExternal>
                  <span v-if="index !== egfArray.length - 1" class="mx-1">|</span>
                </span>
              </template>
            </TableRow>
            <TableRow
              v-if="area.deposit"
              :title="$t('area.maardla')"
              :value="area.deposit"
            >
              <template #value="{ value }">
                <BaseLinkExternal
                  :to="externalUrl(`register.keskkonnainfo.ee/envreg/main?reg_kood=${value}`, 'http:')"
                >
                  {{ value }}
                </BaseLinkExternal>
              </template>
            </TableRow>
            <TableRow
              v-if="eelisArray.length > 0"
              :title="$t('area.eelis')"
              :value="eelisArray"
            >
              <template #value>
                <span v-for="(id, index) in eelisArray" :key="`eelis-${index}`">
                  <BaseLinkExternal :to="externalUrl(`register.keskkonnainfo.ee/envreg/main?reg_kood=${id}`, 'http:')">
                    {{ id }}
                  </BaseLinkExternal>
                  <span v-if="index !== eelisArray.length - 1" class="mx-1">|</span>
                </span>
              </template>
            </TableRow>

            <TableRow
              v-if="area.type.id === 2 && planArray.length > 0"
              :title="$t('area.text1')"
              :value="planArray"
            >
              <template #value>
                <span v-for="(item, index) in planArray" :key="`plan-${index}`">
                  <a
                    class="portal-record-link"
                    :download="item.trim()"
                    :href="externalUrl(`turba.geoloogia.info/plaanid/${item.trim()}`)"
                  >
                    {{ item }}
                    <PortalIcon
                      size="small"
                      color="primary-darken-2"
                      :path="mdiFileDownloadOutline"
                    />
                  </a>
                  <span v-if="index !== planArray.length - 1" class="mr-1">|</span>
                </span>
              </template>
            </TableRow>
            <TableRow
              v-if="area.date_added"
              :title="$t('area.dateAdded')"
              :value="$formatDate(area.date_added)"
            />
            <TableRow
              v-if="area.date_changed"
              :title="$t('area.dateChanged')"
              :value="$formatDate(area.date_changed)"
            />
          </tbody>
        </table>
        <template
          v-if="!!$translate({ et: area.description!, en: area.description_en! })"
        >
          <div class="portal-section-title">
            {{ $t("area.description") }}
          </div>
          <div
            v-html="
              $translate({
                et: area.description!,
                en: area.description_en!,
              })
            "
          />
        </template>

        <template v-if="deposit">
          <div class="portal-section-title">
            {{ $t("area.deposit") }}
          </div>
          <UAlert color="neutral" class="portal-notice">
            <template #description>
              {{ $t("alert.estonianLandBoardDatabase") }}
            </template>
          </UAlert>
          <table class="portal-bordered-table">
            <tbody>
              <TableRow
                v-if="deposit"
                :title="$t('deposit.registrationNo')"
                :value="deposit.id"
              >
                <template #value="{ value }">
                  <BaseLinkExternal
                    :to="externalUrl(`xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${value}`)"
                  >
                    {{
                      value
                    }}
                  </BaseLinkExternal>
                </template>
              </TableRow>
              <TableRow
                :title="$t('deposit.name')"
                :value="`${deposit.nimetus} ${
                  deposit.maardla_os ? `(${deposit.maardla_os})` : ''
                }`"
              />
              <TableRow
                :title="$t('deposit.name')"
                :value="deposit.maardla_os"
              />
              <TableRow :title="$t('deposit.area')" :value="deposit.pindala" />
              <TableRow :title="$t('deposit.isBedrock')" :value="deposit.aluspohja">
                <template #value>
                  <BaseBoolean :model-value="deposit.aluspohja" />
                </template>
              </TableRow>
              <TableRow
                :title="$t('deposit.commodity')"
                :value="deposit.maavara"
              />
              <TableRow
                :title="$t('deposit.usage')"
                :value="deposit.pohimaavar"
              />
              <TableRow
                :title="$t('deposit.additionalCommodity')"
                :value="deposit.kaasmaavar"
              />

              <TableRow
                :title="$t('deposit.miningConditions')"
                :value="deposit.maeteh_ti"
              />
              <TableRow
                :title="$t('deposit.enviromentalRestrictions')"
                :value="deposit.geookol_ti"
              />
              <TableRow
                :title="$t('deposit.dataExportDate')"
                :value="deposit.eksporditi"
              />
            </tbody>
          </table>
        </template>
        <template v-if="miningClaim">
          <div class="portal-section-title">
            {{ $t("area.miningClaim") }}
          </div>
          <UAlert color="neutral" class="portal-notice">
            <template #description>
              {{ $t("alert.estonianLandBoardDatabase") }}
            </template>
          </UAlert>
          <table class="portal-bordered-table">
            <tbody>
              <TableRow
                v-if="miningClaim.loa_number"
                :title="$t('miningClaim.number')"
                :value="miningClaim"
              >
                <template #value="{ value }">
                  <BaseLinkExternal
                    :to="externalUrl(`xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7935&LOA_NUMBER=${value.loa_number}&hide=true`)"
                  >
                    {{ value.id }}
                  </BaseLinkExternal>
                  (Maaamet XGIS2)
                </template>
              </TableRow>
              <TableRow
                v-if="miningClaim.reg_kaart"
                :title="$t('miningClaim.registrationNo')"
                :value="miningClaim"
              >
                <template #value="{ value }">
                  <BaseLinkExternal
                    :to="externalUrl(`xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${value.reg_kaart}`)"
                  >
                    {{ value.reg_kaart }}
                  </BaseLinkExternal>
                  (Maaamet XGIS2)
                </template>
              </TableRow>
              <TableRow
                :title="$t('miningClaim.name')"
                :value="miningClaim.nimetus"
              />
              <TableRow
                :title="$t('miningClaim.area')"
                :value="miningClaim.pindala"
              />
              <TableRow
                :title="$t('miningClaim.reserve')"
                :value="miningClaim.erald_varu"
              />
              <TableRow
                :title="$t('miningClaim.usage')"
                :value="miningClaim.kas_eesm"
              />
              <TableRow
                :title="$t('miningClaim.reclamation')"
                :value="miningClaim.rekult"
              />

              <TableRow
                :title="$t('miningClaim.status')"
                :value="miningClaim.me_olek"
              />

              <TableRow
                v-if="miningClaim.loa_number"
                :title="$t('miningClaim.extractionPermit')"
                :value="miningClaim"
              >
                <template #value="{ value }">
                  <BaseLinkExternal
                    :to="
                      externalUrl(`kotkas.envir.ee/permits/public_index?search=1&permit_nr=${value.loa_number}`)
                    "
                  >
                    {{ value.loa_number }}
                  </BaseLinkExternal>
                  (Kotkas)
                </template>
              </TableRow>
              <TableRow
                :title="$t('miningClaim.period')"
                :value="`${miningClaim.loa_algus} - ${miningClaim.loa_lopp}`"
              />
              <TableRow
                :title="$t('miningClaim.permitOwner')"
                :value="miningClaim.loa_omanik"
              />
              <TableRow
                :title="$t('miningClaim.miningCompany')"
                :value="miningClaim.kaevandaja"
              />

              <TableRow
                :title="$t('miningClaim.dataExportDate')"
                :value="miningClaim.eksporditi"
              />
            </tbody>
          </table>
        </template>
      </div>
      <div
        v-if="siteMarkers !== undefined && siteMarkers.length > 0 || geojson"
        class="portal-column-third portal-column"
      >
        <MapDetail
          base-layer="Estonian map"
          :overlays="['Estonian bedrock']"
          :markers="siteMarkers"
          :geojson="geojson"
        />
      </div>
    </div>
  </div>
</template>
