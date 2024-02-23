<script setup lang="ts">
const props = defineProps<{
  sample: any;
}>();

const localePath = useLocalePath();
const route = useRoute();

const { data: images } = await useGeoloogiaApiFetch("/attachment_link/", {
  query: {
    limit: 8,
    sample: route.params.id,
    nest: 1,
  },
});

const parentSpecimen = computed(() => props.sample.parent_specimen);
const parent = computed(() => props.sample.parent_sample);
const project = computed(() => props.sample.project);
const database = computed(() => props.sample.database);
const owner = computed(() => props.sample.owner);
const classificationRock = computed(() => props.sample.classification_rock);
const samplePurpose = computed(() => props.sample.sample_purpose);
const agentCollected = computed(() => props.sample.agent_collected);
const lithostratigraphy = computed(() => props.sample.lithostratigraphy);
const stratigraphy = computed(() => props.sample.stratigraphy);
const site = computed(() => props.sample.site);
const series = computed(() => props.sample.series);
const locality = computed(() => props.sample.locality);

const showMap = computed(() => {
  return (
    (locality.value && locality.value.latitude && locality.value.longitude)
    || (site.value && site.value.latitude && site.value.longitude)
  );
});

const mapCenter = computed(() => {
  if (locality.value) {
    return {
      latitude: locality.value.latitude,
      longitude: locality.value.longitude,
    };
  }
  if (site.value) {
    return {
      latitude: site.value.latitude,
      longitude: site.value.longitude,
    };
  }
  return null;
});
const { $translate } = useNuxtApp();

const mapMarkers = computed(() => {
  if (locality.value) {
    return [
      {
        latitude: locality.value.latitude,
        longitude: locality.value.longitude,
        text: $translate({
          et: props.sample.drillcore,
          en: props.sample.drillcore_en,
        }),
      },
    ];
  }
  if (site.value) {
    return [
      {
        latitude: site.value.latitude,
        longitude: site.value.longitude,
        text: site.value.name,
      },
    ];
  }
  return [];
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
              :title="$t('sample.number').toString()"
              :value="sample.number"
            />
            <table-row-link
              v-if="parent"
              :title="$t('sample.parent').toString()"
              nuxt
              :href="
                localePath({ name: 'sample-id', params: { id: parent.id } })
              "
              :value="parent.number"
            />
            <table-row-link
              v-if="parentSpecimen"
              :title="$t('sample.parentSpecimen').toString()"
              nuxt
              :href="
                localePath({
                  name: 'specimen-id',
                  params: { id: parentSpecimen.id },
                })
              "
              :value="parentSpecimen.specimen_id"
            />
            <table-row-link
              :title="$t('sample.igsn').toString()"
              :value="sample.igsn"
              :href="`http://igsn.org/${sample.igsn}`"
            />
            <table-row
              :title="$t('sample.numberAdditional').toString()"
              :value="sample.number_additional"
            />
            <table-row
              :title="$t('sample.numberField').toString()"
              :value="sample.number_field"
            />
            <template v-if="locality">
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
                    params: { id: sample.locality.id },
                  })
                "
              />
              <table-row
                :title="$t('sample.localityFree').toString()"
                :value="sample.locality_free"
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
            </template>
            <template v-if="site">
              <table-row-link
                :title="$t('sample.site').toString()"
                :value="site.name"
                nuxt
                :href="
                  localePath({
                    name: 'site-id',
                    params: { id: site.id },
                  })
                "
              />
              <table-row
                :title="$t('locality.coordinates').toString()"
                :value="`${site.latitude}, ${site.longitude}`"
              />
            </template>
            <table-row
              :title="$t('sample.depth').toString()"
              :value="sample.depth"
            />
            <table-row
              :title="$t('sample.depthInterval').toString()"
              :value="sample.depth_interval"
            />
            <table-row-link
              v-if="stratigraphy"
              :title="$t('sample.stratigraphy').toString()"
              :value="
                $translate({
                  et: stratigraphy.stratigraphy,
                  en: stratigraphy.stratigraphy_en,
                })
              "
              nuxt
              :href="
                localePath({
                  name: 'stratigraphy-id',
                  params: { id: sample.stratigraphy.id },
                })
              "
            />
            <table-row-link
              v-if="lithostratigraphy"
              :title="$t('sample.lithostratigraphy').toString()"
              :value="
                $translate({
                  et: lithostratigraphy.stratigraphy,
                  en: lithostratigraphy.stratigraphy_en,
                })
              "
              nuxt
              :href="
                localePath({
                  name: 'stratigraphy-id',
                  params: { id: sample.lithostratigraphy.id },
                })
              "
            />
            <table-row
              :title="$t('sample.stratigraphyFree').toString()"
              :value="sample.stratigraphy_free"
            />
            <table-row
              :title="$t('sample.stratigraphyBed').toString()"
              :value="sample.stratigraphy_bed"
            />
            <table-row
              :title="$t('sample.dateCollected').toString()"
              :value="sample.date_collected || sample.date_collected_free"
            />
            <table-row
              v-if="agentCollected || sample.agent_collected_txt"
              :title="$t('sample.agentCollected').toString()"
              :value="agentCollected.agent || sample.agent_collected_txt"
            />
            <table-row
              :title="$t('sample.mass').toString()"
              :value="sample.mass"
            />
            <table-row
              v-if="series"
              :title="$t('sample.series').toString()"
              :value="series.name"
            />
            <table-row
              v-if="samplePurpose"
              :title="$t('sample.samplePurpose').toString()"
              :value="
                $translate({
                  et: samplePurpose.value,
                  en: samplePurpose.value_en,
                })
              "
            />
            <table-row
              :title="$t('sample.rock').toString()"
              :value="
                $translate({
                  et: sample.rock,
                  en: sample.rock_en,
                })
              "
            />
            <table-row
              v-if="classificationRock"
              :title="$t('sample.classificationRock').toString()"
              :value="
                $translate({
                  et: classificationRock.name,
                  en: classificationRock.name_en,
                })
              "
            />
            <table-row
              :title="$t('sample.palaeontology').toString()"
              :value="sample.palaeontology"
            />
            <table-row
              :title="$t('sample.fossils').toString()"
              :value="sample.fossils"
            />
            <table-row
              :title="$t('sample.remarks').toString()"
              :value="sample.remarks"
            />
            <table-row
              v-if="owner"
              :title="$t('sample.owner').toString()"
              :value="owner.agent"
            />
            <table-row-link
              v-if="database"
              :title="$t('sample.database').toString()"
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
              v-if="project"
              :title="$t('sample.project').toString()"
              :value="
                $translate({
                  et: sample.project.name,
                  en: sample.project.name_en,
                })
              "
            />
            <table-row
              v-if="sample.date_added"
              :title="$t('sample.dateAdded').toString()"
              :value="$formatDate(sample.date_added)"
            />
            <table-row
              v-if="
                sample.date_changed && sample.date_changed !== sample.date_added
              "
              :title="$t('sample.dateChanged').toString()"
              :value="$formatDate(sample.date_changed)"
            />
          </base-table>
        </v-card>
      </v-col>
      <v-col v-if="showMap || images.results.length > 0" :xl="4">
        <map-detail
          v-if="showMap"
          class="mb-4"
          rounded
          :estonian-map="
            locality?.country ? locality.country.value === 'Eesti' : false
          "
          :estonian-bedrock-overlay="
            locality?.country ? locality.country.value === 'Eesti' : false
          "
          height="300px"
          :center="mapCenter"
          :markers="mapMarkers"
        />
        <v-carousel
          v-if="images.results.length > 0"
          class="rounded elevation-2"
          continuous
          height="auto"
          :show-arrows="false"
        >
          <v-carousel-item
            v-for="(item, i) in images.results"
            :key="i"
            :src="`https://files.geocollections.info/medium/${item.attachment.filename}`"
          />
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>
