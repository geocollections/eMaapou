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
              :title="$t('drillcore.name')"
              :value="
                $translate({
                  et: drillcore.drillcore,
                  en: drillcore.drillcore_en,
                })
              "
            />
            <table-row
              :title="$t('drillcore.boxes')"
              :value="drillcore.boxes"
            />
            <table-row
              :title="$t('drillcore.boxNumbers')"
              :value="drillcore.box_numbers"
            />
            <table-row
              v-if="depository"
              :title="$t('drillcore.repository')"
              :value="
                $translate({
                  et: depository.value,
                  en: depository.value_en,
                })
              "
            />
            <table-row
              v-if="storage"
              :title="$t('drillcore.storage')"
              :value="storage.location"
            />
            <table-row
              v-if="agent"
              :title="$t('drillcore.driller')"
              :value="agent.agent"
            />
            <table-row :title="$t('drillcore.year')" :value="drillcore.year" />
            <table-row
              :title="$t('drillcore.metersInBox')"
              :value="drillcore.number_meters"
            />

            <table-row-link
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
            <table-row
              v-if="drillcore.date_added"
              :title="$t('drillcore.dateAdded')"
              :value="$formatDate(drillcore.date_added)"
            />
            <table-row
              v-if="drillcore.date_changed"
              :title="$t('drillcore.dateChanged')"
              :value="$formatDate(drillcore.date_changed)"
            />
          </base-table>
        </v-card>
        <div v-if="drillcore.remarks">
          <div class="text-h6 py-2">
            {{ $t("drillcore.remarks") }}
          </div>
          <div>{{ drillcore.remarks }}</div>
        </div>
      </v-col>
      <v-col :xl="4">
        <v-card class="mb-4">
          <base-table>
            <table-row-link
              :title="$t('locality.locality').toString()"
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
            <table-row
              v-if="locality.country"
              :title="$t('locality.country').toString()"
              :value="
                $translate({
                  et: locality.country.value,
                  en: locality.country.value_en,
                })
              "
            />
            <table-row
              :title="$t('locality.coordinates').toString()"
              :value="`${locality.latitude}, ${locality.longitude}`"
            />
            <table-row
              :title="$t('locality.elevation').toString()"
              :value="locality.elevation"
            />
            <table-row
              :title="$t('locality.depth').toString()"
              :value="locality.depth"
            />
          </base-table>
        </v-card>
        <map-detail
          v-if="locality.latitude && locality.longitude"
          :estonian-map="
            locality.country ? locality.country.value === 'Eesti' : false
          "
          :estonian-bedrock-overlay="
            locality.country ? locality.country.value === 'Eesti' : false
          "
          rounded
          borehole-overlay
          height="300px"
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
      </v-col>
    </v-row>
  </v-container>
</template>
