<script setup lang="ts">
const props = defineProps<{ locality: any }>();

const route = useRoute();
const localePath = useLocalePath();
const { $geoloogiaFetch } = useNuxtApp();

const type = computed(() => props.locality.type);
const country = computed(() => props.locality.country);
const municipality = computed(() => props.locality.vald);
const settlementUnit = computed(() => props.locality.asustusyksus);
const coordinatePrecision = computed(() => props.locality.coord_det_precision);
const coordinateMethod = computed(() => props.locality.coord_det_method);
const coordinateAgent = computed(() => props.locality.coord_det_agent);
const stratigraphyTop = computed(() => props.locality.stratigraphy_top);
const stratigraphyBase = computed(() => props.locality.stratigraphy_base);

const showMap = computed(() => {
  return props.locality.latitude && props.locality.longitude;
});

const images = ref<any[]>([]);
const imagesHasNext = ref(true);

async function imageQuery({ rows, page }: { rows: number; page: number }) {
  if (!imagesHasNext.value)
    return;
  // TODO: this request is defined in fetch also. Find a way to unify them.
  const newImages = await $geoloogiaFetch("/locality_image", {
    query: {
      locality: route.params.id,
      nest: 2,
      limit: rows,
      offset: rows * page,
      ordering: "sort",
    },
  }).then((res) => {
    imagesHasNext.value = !!res.next;
    return res.results
      .filter((image: any) => !image.attachment.is_private)
      .map((image: any) => ({
        id: image.attachment.id,
        filename: image.attachment.filename,
        author: image.attachment.author?.agent ?? null,
        date: image.attachment.date_created,
        dateText: image.attachment.date_created_free,
      }));
  });
  images.value = [...images.value, ...newImages];
}

const _ = await useAsyncData("image", async () => {
  await imageQuery({ rows: 10, page: 0 });
});
</script>

<template>
  <v-container style="margin: initial">
    <v-row v-if="images.length > 0">
      <v-col>
        <image-bar
          v-if="images.length > 0"
          class="mt-4"
          :images="images"
          @update="imageQuery"
        />
      </v-col>
    </v-row>
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
              :title="$t('locality.name').toString()"
              :value="$translate({
                et: locality.locality,
                en: locality.locality_en,
              })
              "
            />
            <table-row :title="$t('locality.number').toString()" :value="locality.number" />
            <table-row
              v-if="type"
              :title="$t('locality.type').toString()"
              :value="$translate({
                et: type.value,
                en: type.value_en,
              })
              "
            />
            <table-row
              v-if="country"
              :title="$t('locality.country').toString()"
              :value="$translate({
                et: country.value,
                en: country.value_en,
              })
              "
            />
            <table-row
              v-if="municipality"
              :title="$t('locality.parish').toString()"
              :value="$translate({
                et: municipality.vald,
                en: municipality.vald_en,
              })
              "
            />
            <table-row
              v-if="settlementUnit"
              :title="$t('locality.settlement').toString()"
              :value="$translate({
                et: settlementUnit.asustusyksus,
                en: settlementUnit.asustusyksus_en,
              })
              "
            />
            <table-row :title="$t('locality.elevation').toString()" :value="locality.elevation" />
            <table-row
              :title="$t('locality.coordinates').toString()"
              :value="`${locality.latitude}, ${locality.longitude}`"
            />
            <table-row :title="$t('locality.coordinateSystem').toString()" :value="locality.coord_system" />
            <table-row :title="$t('locality.coordinateX').toString()" :value="locality.coordx" />
            <table-row :title="$t('locality.coordinateY').toString()" :value="locality.coordy" />
            <table-row
              v-if="coordinatePrecision"
              :title="$t('locality.coordinatePrecision').toString()"
              :value="coordinatePrecision.value"
            />
            <table-row
              v-if="coordinateMethod"
              :title="$t('locality.coordinateMethod').toString()"
              :value="$translate({
                et: coordinateMethod.value,
                en: coordinateMethod.value_en,
              })
              "
            />
            <table-row
              v-if="coordinateAgent"
              :title="$t('locality.coordinateAgent').toString()"
              :value="coordinateAgent.agent"
            />
            <table-row :title="$t('locality.locationRemarks').toString()" :value="locality.remarks_location" />
            <table-row-link
              v-if="stratigraphyTop"
              :title="$t('locality.stratigraphyTop').toString()"
              :value="$translate({
                et: stratigraphyTop.stratigraphy,
                en: stratigraphyTop.stratigraphy_en,
              })
              "
              nuxt
              :href="localePath({
                name: 'stratigraphy-id',
                params: { id: locality.stratigraphy_top.id },
              })
              "
            />
            <table-row-link
              v-if="stratigraphyBase"
              :title="$t('locality.stratigraphyBase').toString()"
              :value="$translate({
                et: stratigraphyBase.stratigraphy,
                en: stratigraphyBase.stratigraphy_en,
              })
              "
              nuxt
              :href="localePath({
                name: 'stratigraphy-id',
                params: { id: locality.stratigraphy_base.id },
              })
              "
            />
            <table-row :title="$t('locality.remarks').toString()" :value="locality.remarks" />
            <table-row-link
              v-if="locality.maaamet_pa_id"
              :title="$t('locality.linkLandBoard').toString()"
              :value="locality.maaamet_pa_id"
              :href="`https://geoportaal.maaamet.ee/index.php?lang_id=1&action=viewPA&pa_id=${locality.maaamet_pa_id}&fr=o&bk=1&page_id=382`"
            />
            <table-row
              v-if="locality.date_added"
              :title="$t('locality.dateAdded').toString()"
              :value="$formatDate(locality.date_added)"
            />
            <table-row
              v-if="locality.date_changed"
              :title="$t('locality.dateChanged').toString()"
              :value="$formatDate(locality.date_changed)"
            />
          </base-table>
        </v-card>
      </v-col>
      <v-col v-if="showMap" :xl="4">
        <map-detail
          v-if="showMap"
          rounded
          :estonian-map="country ? country.value === 'Eesti' : false"
          :estonian-bedrock-overlay="country ? country.value === 'Eesti' : false
          "
          height="300px"
          locality-overlay
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
