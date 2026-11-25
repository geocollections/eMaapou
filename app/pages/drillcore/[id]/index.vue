<script setup lang="ts">
import type { Drillcore } from "../[id].vue";
import type { MapOverlay } from "~/components/map/MapDetail.client.vue";

const props = defineProps<{
  drillcore: Drillcore;
}>();

const localePath = useLocalePath();

const drillcore = computed(() => props.drillcore);
const depository = computed(() => props.drillcore.depository);
const storage = computed(() => props.drillcore.storage);
const agent = computed(() => props.drillcore.agent);
const database = computed(() => props.drillcore.database);
const locality = computed(() => props.drillcore.locality);

const mapBaseLayer = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  const overlays: MapOverlay[] = [];
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    overlays.push("Estonian bedrock");

  return overlays;
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
            :title="$t('drillcore.name')"
            :value="
              $translate({
                et: drillcore.name,
                en: drillcore.name_en,
              })
            "
          />
          <TableRow
            :title="$t('drillcore.boxes')"
            :value="drillcore.boxes"
          />
          <TableRow
            :title="$t('drillcore.boxNumbers')"
            :value="drillcore.box_numbers"
          />
          <TableRow
            v-if="depository"
            :title="$t('drillcore.repository')"
            :value="
              $translate({
                et: depository.value,
                en: depository.value_en,
              })
            "
          />
          <TableRow
            v-if="storage"
            :title="$t('drillcore.storage')"
            :value="storage.name"
          />
          <TableRow
            v-if="agent"
            :title="$t('drillcore.driller')"
            :value="agent.name"
          />
          <TableRow :title="$t('drillcore.year')" :value="drillcore.year" />
          <TableRow
            :title="$t('drillcore.metersInBox')"
            :value="drillcore.meters_in_box"
          />

          <TableRow
            v-if="database"
            :title="$t('drillcore.database')"
            :value="database"
          >
            <template #value="{ value }">
              <BaseLink
                :to="value.url"
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
            v-if="drillcore.date_added"
            :title="$t('drillcore.dateAdded')"
            :value="$formatDate(drillcore.date_added)"
          />
          <TableRow
            v-if="drillcore.date_changed"
            :title="$t('drillcore.dateChanged')"
            :value="$formatDate(drillcore.date_changed)"
          />
        </BaseTable>
        <div v-if="drillcore.remarks">
          <div class="text-h6 py-2">
            {{ $t("drillcore.remarks") }}
          </div>
          <div>{{ drillcore.remarks }}</div>
        </div>
      </VCol>
      <VCol :xl="4">
        <BaseTable class="border rounded mb-4">
          <TableRow
            v-if="locality"
            :title="$t('locality.locality')"
            :value="locality"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'locality-id',
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
            v-if="locality?.country"
            :title="$t('locality.country')"
            :value="
              $translate({
                et: locality.country.name,
                en: locality.country.name_en,
              })
            "
          />
          <TableRow
            :title="$t('locality.coordinates')"
            :value="`${locality?.latitude}, ${locality?.longitude}`"
          />
          <TableRow
            :title="$t('locality.elevation')"
            :value="locality?.elevation"
          />
          <TableRow
            :title="$t('locality.depth')"
            :value="locality?.depth"
          />
        </BaseTable>
        <MapDetail
          v-if="locality?.latitude && locality?.longitude"
          :base-layer="mapBaseLayer"
          :overlays="mapOverlays"
          :center="{
            latitude: locality.latitude,
            longitude: locality.longitude,
          }"
          :markers="[
            {
              latitude: locality.latitude,
              longitude: locality.longitude,
              text: $translate({
                et: locality.name,
                en: locality.name_en,
              })!,
              route: localePath({
                name: 'locality-id',
                params: { id: locality.id },
              }),
            },
          ]"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
