<script setup lang="ts">
const props = defineProps<{
  drillcore: any;
}>();

const localePath = useLocalePath();

const drillcore = computed(() => props.drillcore);
const depository = computed(() => props.drillcore.depository);
const storage = computed(() => props.drillcore.storage);
const agent = computed(() => props.drillcore.agent);
const database = computed(() => props.drillcore.database);
const locality = computed(() => props.drillcore.locality);

const mapBaseLayer = computed(() => {
  if (locality.value?.country.value === "Eesti")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  const overlays = ["Puursüdamikud / Drillcores"];
  if (locality.value?.country.value === "Eesti")
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
                et: drillcore.drillcore,
                en: drillcore.drillcore_en,
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
            :value="storage.location"
          />
          <TableRow
            v-if="agent"
            :title="$t('drillcore.driller')"
            :value="agent.agent"
          />
          <TableRow :title="$t('drillcore.year')" :value="drillcore.year" />
          <TableRow
            :title="$t('drillcore.metersInBox')"
            :value="drillcore.number_meters"
          />

          <TableRowLink
            v-if="database"
            :title="$t('drillcore.database')"
            :value="
              $translate({
                et: database.name,
                en: database.name_en,
              })
            "
            :href="database.url"
            target="DatabaseWindow"
          />
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
          <TableRowLink
            :title="$t('locality.locality')"
            :value="
              $translate({
                et: locality.locality,
                en: locality.locality_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'locality-id',
                params: { id: drillcore.locality.id },
              })
            "
          />
          <TableRow
            v-if="locality.country"
            :title="$t('locality.country')"
            :value="
              $translate({
                et: locality.country.value,
                en: locality.country.value_en,
              })
            "
          />
          <TableRow
            :title="$t('locality.coordinates')"
            :value="`${locality.latitude}, ${locality.longitude}`"
          />
          <TableRow
            :title="$t('locality.elevation')"
            :value="locality.elevation"
          />
          <TableRow
            :title="$t('locality.depth')"
            :value="locality.depth"
          />
        </BaseTable>
        <MapDetail
          v-if="locality.latitude && locality.longitude"
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
                et: locality.locality,
                en: locality.locality_en,
              }),
            },
          ]"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
