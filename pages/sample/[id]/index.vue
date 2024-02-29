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
            :title="$t('sample.number')"
            :value="sample.number"
          />
          <TableRowLink
            v-if="parent"
            :title="$t('sample.parent')"
            nuxt
            :href="
              localePath({ name: 'sample-id', params: { id: parent.id } })
            "
            :value="parent.number"
          />
          <TableRowLink
            v-if="parentSpecimen"
            :title="$t('sample.parentSpecimen')"
            nuxt
            :href="
              localePath({
                name: 'specimen-id',
                params: { id: parentSpecimen.id },
              })
            "
            :value="parentSpecimen.specimen_id"
          />
          <TableRowLink
            :title="$t('sample.igsn')"
            :value="sample.igsn"
            :href="`http://igsn.org/${sample.igsn}`"
          />
          <TableRow
            :title="$t('sample.numberAdditional')"
            :value="sample.number_additional"
          />
          <TableRow
            :title="$t('sample.numberField')"
            :value="sample.number_field"
          />
          <template v-if="locality">
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
                  params: { id: sample.locality.id },
                })
              "
            />
            <TableRow
              :title="$t('sample.localityFree')"
              :value="sample.locality_free"
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
          </template>
          <template v-if="site">
            <TableRowLink
              :title="$t('sample.site')"
              :value="site.name"
              nuxt
              :href="
                localePath({
                  name: 'site-id',
                  params: { id: site.id },
                })
              "
            />
            <TableRow
              :title="$t('locality.coordinates')"
              :value="`${site.latitude}, ${site.longitude}`"
            />
          </template>
          <TableRow
            :title="$t('sample.depth')"
            :value="sample.depth"
          />
          <TableRow
            :title="$t('sample.depthInterval')"
            :value="sample.depth_interval"
          />
          <TableRowLink
            v-if="stratigraphy"
            :title="$t('sample.stratigraphy')"
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
          <TableRowLink
            v-if="lithostratigraphy"
            :title="$t('sample.lithostratigraphy')"
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
          <TableRow
            :title="$t('sample.stratigraphyFree')"
            :value="sample.stratigraphy_free"
          />
          <TableRow
            :title="$t('sample.stratigraphyBed')"
            :value="sample.stratigraphy_bed"
          />
          <TableRow
            :title="$t('sample.dateCollected')"
            :value="sample.date_collected || sample.date_collected_free"
          />
          <TableRow
            v-if="agentCollected || sample.agent_collected_txt"
            :title="$t('sample.agentCollected')"
            :value="agentCollected.agent || sample.agent_collected_txt"
          />
          <TableRow
            :title="$t('sample.mass')"
            :value="sample.mass"
          />
          <TableRow
            v-if="series"
            :title="$t('sample.series')"
            :value="series.name"
          />
          <TableRow
            v-if="samplePurpose"
            :title="$t('sample.samplePurpose')"
            :value="
              $translate({
                et: samplePurpose.value,
                en: samplePurpose.value_en,
              })
            "
          />
          <TableRow
            :title="$t('sample.rock')"
            :value="
              $translate({
                et: sample.rock,
                en: sample.rock_en,
              })
            "
          />
          <TableRow
            v-if="classificationRock"
            :title="$t('sample.classificationRock')"
            :value="
              $translate({
                et: classificationRock.name,
                en: classificationRock.name_en,
              })
            "
          />
          <TableRow
            :title="$t('sample.palaeontology')"
            :value="sample.palaeontology"
          />
          <TableRow
            :title="$t('sample.fossils')"
            :value="sample.fossils"
          />
          <TableRow
            :title="$t('sample.remarks')"
            :value="sample.remarks"
          />
          <TableRow
            v-if="owner"
            :title="$t('sample.owner')"
            :value="owner.agent"
          />
          <TableRowLink
            v-if="database"
            :title="$t('sample.database')"
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
            v-if="project"
            :title="$t('sample.project')"
            :value="
              $translate({
                et: sample.project.name,
                en: sample.project.name_en,
              })
            "
          />
          <TableRow
            v-if="sample.date_added"
            :title="$t('sample.dateAdded')"
            :value="$formatDate(sample.date_added)"
          />
          <TableRow
            v-if="
              sample.date_changed && sample.date_changed !== sample.date_added
            "
            :title="$t('sample.dateChanged')"
            :value="$formatDate(sample.date_changed)"
          />
        </BaseTable>
      </VCol>
      <VCol v-if="showMap || images.results.length > 0" :xl="4">
        <MapDetail
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
        <VCarousel
          v-if="images.results.length > 0"
          class="rounded elevation-2"
          continuous
          height="auto"
          :show-arrows="false"
        >
          <VCarouselItem
            v-for="(item, i) in images.results"
            :key="i"
            :src="`https://files.geocollections.info/medium/${item.attachment.filename}`"
          />
        </VCarousel>
      </VCol>
    </VRow>
  </VContainer>
</template>
