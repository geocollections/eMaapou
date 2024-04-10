<script setup lang="ts">
const props = defineProps<{
  specimen: any;
  specimenAlt: any;
}>();

const route = useRoute();
const localePath = useLocalePath();
const { $solrFetch } = useNuxtApp();

const dateCollected = computed(() => {
  if (!props.specimen)
    return "";
  return props.specimen.date_collected ?? props.specimen.date_collected_free;
});
const coll = computed(() => props.specimen.coll);
const type = computed(() => props.specimen.type);
const classification = computed(() => props.specimen.classification);
const locality = computed(() => props.specimen.locality);
const stratigraphy = computed(() => props.specimen.stratigraphy);
const lithostratigraphy = computed(() => props.specimen.lithostratigraphy);
const agentCollected = computed(() => props.specimen.agent_collected);
const database = computed(() => props.specimen.database);
const sample = computed(() => props.specimen.sample);
const parent = computed(() => props.specimen.parent);

const { data: images } = await useAsyncData("images", async () => {
  const res = await $solrFetch<SolrResponse>("/attachment", {
    query: {
      q: "*",
      fq: `specimen_id:${route.params.id} AND specimen_image_attachment:1`,
      sort: "date_created_dt desc,date_created_free desc,stars desc,id desc",
      rows: 25,
    },
  });
  return res.response.docs;
}, {
  default: () => [],
});

const mapBaseLayer = computed(() => {
  if (locality.value?.country.value === "Eesti")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  const overlays = [];
  if (locality.value?.country.value === "Eesti")
    overlays.push("Estonian bedrock");

  return overlays;
});
</script>

<template>
  <VContainer style="margin: initial">
    <VRow v-if="images.length > 0">
      <VCol>
        <ImageBar
          :images="images"
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol
        :sm="12"
        :md="6"
        :lg="7"
        :xl="5"
      >
        <BaseTable class="border rounded">
          <TableRowLink
            v-if="coll"
            :title="$t('specimen.collectionNr')"
            :value="coll.number"
            nuxt
            :href="
              localePath({
                name: 'collection-id',
                params: { id: coll.id },
              })
            "
          />

          <TableRow
            :title="$t('specimen.number')"
            :value="`${specimen.specimen_id}`"
          />
          <TableRowLink
            v-if="parent"
            :title="$t('specimen.parent')"
            nuxt
            :href="
              localePath({ name: 'specimen-id', params: { id: parent.id } })
            "
            :value="parent.specimen_id"
          />
          <TableRow
            v-if="specimen.specimen_nr"
            :title="$t('specimen.oldNumber')"
            :value="`${specimen.specimen_nr}`"
          />
          <TableRow
            v-if="specimen.original_status"
            :title="$t('specimen.originalStatus')"
            :value="
              $translate({
                et: specimen.original_status.value,
                en: specimen.original_status.value_en,
              })
            "
          />
          <TableRow
            v-if="type"
            :title="$t('specimen.type')"
            :value="
              $translate({
                et: type.value,
                en: type.value_en,
              })
            "
          />
          <TableRow
            v-if="classification"
            :title="$t('specimen.group')"
            :value="
              $translate({
                et: classification.class_field,
                en: classification.class_en,
              })
            "
          />
          <TableRow
            :title="$t('specimen.part')"
            :value="specimen.part"
          />
          <TableRowLink
            v-if="locality"
            :title="$t('specimen.locality')"
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
                params: { id: locality.id },
              })
            "
          />
          <TableRow
            :title="$t('specimen.depth')"
            :value="specimen.depth"
          />
          <TableRowLink
            v-if="stratigraphy"
            :title="$t('specimen.stratigraphy')"
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
                params: { id: stratigraphy.id },
              })
            "
          />
          <TableRowLink
            v-if="lithostratigraphy"
            :title="$t('specimen.lithostratigraphy')"
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
                params: { id: lithostratigraphy.id },
              })
            "
          />
          <TableRow
            :title="$t('specimen.stratigraphyRemarks')"
            :value="specimen.stratigraphy_free"
          />

          <TableRow
            :title="$t('specimen.remarks')"
            :value="specimen.remarks"
          />
          <TableRow
            :title="$t('specimen.dateCollected')"
            :value="dateCollected"
          />
          <TableRow
            v-if="agentCollected"
            :title="$t('specimen.collector')"
            :value="agentCollected.agent"
          />
          <TableRowLink
            v-if="sample"
            :title="$t('specimen.sample')"
            :value="
              $translate({
                et: sample.number,
                en: sample.number,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'sample-id',
                params: { id: sample.id },
              })
            "
          />
          <TableRowLink
            v-if="database"
            :title="$t('specimen.institution')"
            :value="
              $translate({
                et: database.name,
                en: database.name_en,
              })
            "
            :href="database.url"
            target="DatabaseWindow"
          />
        </BaseTable>
      </VCol>
      <VCol
        v-if="locality && locality.latitude && locality.longitude"
      >
        <MapDetail
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
