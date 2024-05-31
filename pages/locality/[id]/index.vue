<script setup lang="ts">
import type { Locality } from "../[id].vue";
import type { Image } from "~/components/ImageBar.vue";
import type { MapOverlay } from "~/components/map/MapDetail.client.vue";

const props = defineProps<{ locality: Locality }>();

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

type LocalityImage = Image<{
  author: string | null;
  date: string | null;
  dateText: string | null;
}>;

const images = ref<LocalityImage[]>([]);
const imagesHasNext = ref(true);
const totalImages = ref(0);

async function imageQuery({ rows, page }: { rows: number; page: number }) {
  if (!imagesHasNext.value)
    return;
  const newImages = await $geoloogiaFetch<GeoloogiaListResponse>("/locality_image/", {
    query: {
      locality: route.params.id,
      nest: 2,
      limit: rows,
      offset: rows * page,
      ordering: "sort",
    },
  }).then((res) => {
    imagesHasNext.value = !!res.next;
    if (totalImages.value === 0)
      totalImages.value = res.count;

    return res.results
      .map((image: any) => ({
        id: image.attachment.id,
        filename: image.attachment.filename,
        info: {
          author: image.attachment.author?.agent,
          date: image.attachment.date_created,
          dateText: image.attachment.date_created_free,
        },
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
  const overlays: MapOverlay[] = ["Lokaliteedid / Localities"];
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
          :total="totalImages"
          @update="imageQuery"
        >
          <template #tooltipInfo="{ item }">
            <div v-if="item.info.author">
              <span class="font-weight-bold">{{ $t("locality.author") }}: </span>
              <span>{{ item.info.author }}</span>
            </div>
            <div v-if="item.info.date || item.info.dateText">
              <span class="font-weight-bold">{{ $t("locality.date") }}: </span>
              <span v-if="item.info.date">
                {{ $formatDate(item.info.date) }}
              </span>
              <span v-else>{{ item.info.dateText }}</span>
            </div>
          </template>
          <template #overlayInfo="{ item }">
            <div v-if="item.info.author">
              <span class="font-weight-bold">{{ $t("locality.author") }}: </span>
              <span>{{ item.info.author }}</span>
            </div>
            <div v-if="item.info.date || item.info.dateText">
              <span class="font-weight-bold">{{ $t("locality.date") }}: </span>
              <span v-if="item.info.date">
                {{ $formatDate(item.info.date) }}
              </span>
              <span v-else>{{ item.info.dateText }}</span>
            </div>
          </template>
        </ImageBar>
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
              et: locality.name,
              en: locality.name_en,
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
              et: country.name,
              en: country.name_en,
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
          <TableRow :title="$t('locality.coordinates')" :value="`${locality.latitude}, ${locality.longitude}`" />
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
              et: stratigraphyTop.name,
              en: stratigraphyTop.name_en,
            })
            "
            nuxt
            :href="localePath({
              name: 'stratigraphy-id',
              params: { id: stratigraphyTop.id },
            })
            "
          />
          <TableRowLink
            v-if="stratigraphyBase"
            :title="$t('locality.stratigraphyBase')"
            :value="$translate({
              et: stratigraphyBase.name,
              en: stratigraphyBase.name,
            })
            "
            nuxt
            :href="localePath({
              name: 'stratigraphy-id',
              params: { id: stratigraphyBase.id },
            })
            "
          />
          <TableRow :title="$t('locality.remarks')" :value="locality.remarks" />
          <TableRowLink
            v-if="locality.land_board_id"
            :title="$t('locality.linkLandBoard')"
            :value="locality.land_board_id"
            :href="`https://geoportaal.maaamet.ee/index.php?lang_id=1&action=viewPA&pa_id=${locality.land_board_id}&fr=o&bk=1&page_id=382`"
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
          :base-layer="mapBaseLayer"
          :overlays="mapOverlays"
          :center="{
            latitude: locality.latitude!,
            longitude: locality.longitude!,
          }"
          :markers="[
            {
              latitude: locality.latitude!,
              longitude: locality.longitude!,
              text: $translate({
                et: locality.name,
                en: locality.name_en,
              }),
            },
          ]"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
