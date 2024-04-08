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
  <VContainer style="margin: initial">
    <VRow>
      <VCol
        :sm="12"
        :md="6"
        :lg="7"
        :xl="5"
      >
        <BaseTable class="border rounded">
          <TableRow
            :title="$t('area.name')"
            :value="$translate({ et: area.name, en: area.name_en })"
          />
          <TableRowLink
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
          <TableRow
            v-else
            :title="$t('area.areaType')"
            :value="
              $translate({
                et: area.area_type.name,
                en: area.area_type.name_en,
              })
            "
          />
          <TableRowLink
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
          <TableRow
            :title="$t('area.county')"
            :value="
              $translate({
                et: area.maakond__maakond,
                en: area.maakond__maakond_en,
              })
            "
          />
          <TableRow :title="$t('area.areaHa')" :value="area.area_ha" />
          <TableRow
            :title="$t('area.depositAreaHa')"
            :value="area.deposit_area_ha"
          />
          <TableRow v-if="egfArray.length > 0" :title="$t('area.egf')">
            <template #value>
              <span v-for="(item, index) in egfArray" :key="index">
                <a class="text-link" @click="$openEgf(item)">
                  {{ item }}
                </a>
                <span v-if="index !== egfArray.length - 1" class="mr-1">|</span>
              </span>
            </template>
          </TableRow>
          <TableRowLink
            :title="$t('area.maardla')"
            @link-click="$openEelis(area.maardla)"
          >
            <template #value>
              {{ $t("area.maardlaLink") }} ({{ area.maardla }})
            </template>
          </TableRowLink>
          <TableRow v-if="eelisArray.length > 0" :title="$t('area.eelis')">
            <template #value>
              <span v-for="(item, index) in eelisArray" :key="index">
                <a class="text-link" @click="$openEelis(item)">
                  {{ item }}
                </a>
                <span v-if="index !== eelisArray.length - 1" class="mr-1">|</span>
              </span>
            </template>
          </TableRow>

          <TableRow
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
                  <VIcon size="small" color="primary-darken-2">
                    {{ mdiFileDownloadOutline }}
                  </VIcon>
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
        </BaseTable>
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
          <VAlert
            density="compact"
            type="info"
            color="accent"
            variant="outlined"
            class="text-body-2 mb-2"
          >
            {{ $t("alert.estonianLandBoardDatabase") }}
          </VAlert>
          <BaseTable class="border rounded">
            <TableRowLink
              :title="$t('deposit.registrationNo')"
              :value="deposit.id"
              @link-click="
                $openWindow(
                  `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${deposit.id}`,
                )
              "
            />
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
            <TableRow :title="$t('deposit.isBedrock')">
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
          </BaseTable>
        </template>
        <template v-if="miningClaim">
          <div class="text-h6 py-2">
            {{ $t("area.miningClaim") }}
          </div>
          <VAlert
            density="compact"
            type="info"
            color="accent"
            variant="outlined"
            class="text-body-2 mb-2"
          >
            {{ $t("alert.estonianLandBoardDatabase") }}
          </VAlert>
          <BaseTable class="border rounded">
            <TableRow :title="$t('miningClaim.number')">
              <template #value>
                <BaseLinkExternal
                  @click.native="
                    $openWindow(
                      `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7935&LOA_NUMBER=${miningClaim.loa_number}&hide=true`,
                    )
                  "
                >
                  {{ area.maaamet_maeeraldis.id }}
                </BaseLinkExternal>
                (Maaamet XGIS2)
              </template>
            </TableRow>
            <TableRow :title="$t('miningClaim.registrationNo')">
              <template #value>
                <BaseLinkExternal
                  @click.native="
                    $openWindow(
                      `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${miningClaim.reg_kaart}`,
                    )
                  "
                >
                  {{ miningClaim.reg_kaart }}
                </BaseLinkExternal>
                (Maaamet XGIS2)
              </template>
            </TableRow>
            <TableRow
              :title="$t('miningClaim.name')"
              :value="`${miningClaim.nimetus} ${
                miningClaim.maardla_os ? `(${miningClaim.maardla_os})` : ''
              }`"
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
            >
              <template #value>
                <BaseLinkExternal
                  @click.native="
                    $openWindow(
                      `https://kotkas.envir.ee/permits/public_index?search=1&permit_nr=${miningClaim.loa_number}`,
                    )
                  "
                >
                  {{ miningClaim.loa_number }}
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
          </BaseTable>
        </template>
      </VCol>
      <VCol v-if="siteMarkers?.length > 0 || geojson" :xl="4">
        <MapDetail
          rounded
          estonian-map
          estonian-bedrock-overlay
          :markers="siteMarkers"
          :geojson="geojson"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
