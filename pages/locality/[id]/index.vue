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
  const newImages = await $geoloogiaFetch("/locality_image/", {
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

const mapBaseLayer = computed(() => {
  if (country.value?.value === "Eesti")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  const overlays = ["Lokaliteedid / Localities"];
  if (country.value?.value === "Eesti")
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
          @update="imageQuery"
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
          <TableRow
            :title="$t('locality.name')"
            :value="$translate({
              et: locality.locality,
              en: locality.locality_en,
            })
            "
          />
          <TableRow :title="$t('locality.number')" :value="locality.number" />
          <TableRow
            v-if="type"
            :title="$t('locality.type')"
            :value="$translate({
              et: type.value,
              en: type.value_en,
            })
            "
          />
          <TableRow
            v-if="country"
            :title="$t('locality.country')"
            :value="$translate({
              et: country.value,
              en: country.value_en,
            })
            "
          />
          <TableRow
            v-if="municipality"
            :title="$t('locality.parish')"
            :value="$translate({
              et: municipality.vald,
              en: municipality.vald_en,
            })
            "
          />
          <TableRow
            v-if="settlementUnit"
            :title="$t('locality.settlement')"
            :value="$translate({
              et: settlementUnit.asustusyksus,
              en: settlementUnit.asustusyksus_en,
            })
            "
          />
          <TableRow :title="$t('locality.elevation')" :value="locality.elevation" />
          <TableRow
            :title="$t('locality.coordinates')"
            :value="`${locality.latitude}, ${locality.longitude}`"
          />
          <TableRow :title="$t('locality.coordinateSystem')" :value="locality.coord_system" />
          <TableRow :title="$t('locality.coordinateX')" :value="locality.coordx" />
          <TableRow :title="$t('locality.coordinateY')" :value="locality.coordy" />
          <TableRow
            v-if="coordinatePrecision"
            :title="$t('locality.coordinatePrecision')"
            :value="coordinatePrecision.value"
          />
          <TableRow
            v-if="coordinateMethod"
            :title="$t('locality.coordinateMethod')"
            :value="$translate({
              et: coordinateMethod.value,
              en: coordinateMethod.value_en,
            })
            "
          />
          <TableRow
            v-if="coordinateAgent"
            :title="$t('locality.coordinateAgent')"
            :value="coordinateAgent.agent"
          />
          <TableRow :title="$t('locality.locationRemarks')" :value="locality.remarks_location" />
          <TableRowLink
            v-if="stratigraphyTop"
            :title="$t('locality.stratigraphyTop')"
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
          <TableRowLink
            v-if="stratigraphyBase"
            :title="$t('locality.stratigraphyBase')"
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
          <TableRow :title="$t('locality.remarks')" :value="locality.remarks" />
          <TableRowLink
            v-if="locality.maaamet_pa_id"
            :title="$t('locality.linkLandBoard')"
            :value="locality.maaamet_pa_id"
            :href="`https://geoportaal.maaamet.ee/index.php?lang_id=1&action=viewPA&pa_id=${locality.maaamet_pa_id}&fr=o&bk=1&page_id=382`"
          />
          <TableRow
            v-if="locality.date_added"
            :title="$t('locality.dateAdded')"
            :value="$formatDate(locality.date_added)"
          />
          <TableRow
            v-if="locality.date_changed"
            :title="$t('locality.dateChanged')"
            :value="$formatDate(locality.date_changed)"
          />
        </BaseTable>
      </VCol>
      <VCol v-if="showMap" :xl="4">
        <MapDetail
          v-if="showMap"
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
