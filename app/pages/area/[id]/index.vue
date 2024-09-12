<script setup lang="ts">
import { mdiFileDownloadOutline } from "@mdi/js";
import isEmpty from "lodash/isEmpty";
import BaseLinkExternal from "~/components/base/BaseLinkExternal.vue";
import type { Area } from "../[id].vue";

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
      // NOTE: Remove trailing commas from JSON object string

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
          <TableRow
            v-if="area.type.id === 2"
            :title="$t('site.area')"
            :value="area"
          >
            <template #value>
              <BaseLinkExternal
                :to="`https://turba.geoloogia.info/turbaala/${area.id}`"
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
              <span v-for="(id, index) in egfArray" :key="index">
                <BaseLinkExternal
                  :to="`https://fond.egt.ee/fond/egf/${id}`"
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
                :to="`http://register.keskkonnainfo.ee/envreg/main?reg_kood=${value}`"
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
              <span v-for="(id, index) in eelisArray" :key="index">
                <BaseLinkExternal :to="`http://register.keskkonnainfo.ee/envreg/main?reg_kood=${id}`">
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
              <span v-for="(item, index) in planArray" :key="index">
                <a
                  class="text-link"
                  :download="item.trim()"
                  :href="`https://turba.geoloogia.info/plaanid/${item.trim()}`"
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
          v-if="!!$translate({ et: area.description!, en: area.description_en! })"
        >
          <div class="text-h6 py-2">
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
            <TableRow
              v-if="deposit"
              :title="$t('deposit.registrationNo')"
              :value="deposit.id"
            >
              <template #value="{ value }">
                <BaseLinkExternal
                  :to="`https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${value}`"
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
            <TableRow
              v-if="miningClaim.loa_number"
              :title="$t('miningClaim.number')"
              :value="miningClaim"
            >
              <template #value="{ value }">
                <BaseLinkExternal
                  :to="`https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7935&LOA_NUMBER=${value.loa_number}&hide=true`"
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
                  :to="`https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${value.reg_kaart}`"
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
                    `https://kotkas.envir.ee/permits/public_index?search=1&permit_nr=${value.loa_number}`
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
          </BaseTable>
        </template>
      </VCol>
      <VCol v-if="siteMarkers !== undefined && siteMarkers.length > 0 || geojson" :xl="4">
        <MapDetail
          base-layer="Estonian map"
          :overlays="['Estonian bedrock']"
          :markers="siteMarkers"
          :geojson="geojson"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
