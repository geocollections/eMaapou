<script setup lang="ts">
import type { Site } from "../[id].vue";
import { mdiFileDownloadOutline } from "@mdi/js";
import type { Image } from "~/components/ImageBar.vue";
import type { MapOverlay } from "~/components/map/MapDetail.client.vue";
import type { ImageAttachment } from "~/composables/useImages";

const props = defineProps<{ site: Site }>();

const localePath = useLocalePath();
const { $formatDate, $apiFetch } = useNuxtApp();

const locality = computed(() => props.site.locality);
const area = computed(() => props.site.area);
const planArray = computed(() => {
  return props.site.area?.plans ? props.site.area?.plans.split(",") : [];
});
const elevation = computed(() => {
  return props.site.elevation_accuracy
    ? `${props.site.elevation} (± ${props.site.elevation_accuracy})`
    : props.site?.elevation;
});
const studied = computed(() => {
  return props.site.date_start
    ? $formatDate(props.site.date_start)
    : props.site?.date_text;
});

type SiteImage = Image<{
  author: string | null;
  date: string | null;
  dateText: string | null;
}>;

async function imageQuery({ item, rows, page }: { item: Site; rows: number; page: number }) {
  const res = await $apiFetch<GeoloogiaListResponse<ImageAttachment>>(`/sites/${item.id}/attachments/`, {
    query: {
      mime_type__content_type__istartswith: "image",
      fields: "id,filename,author.name,date_created,date_created_text",
      limit: rows,
      offset: page * rows,
    },
  });

  const newImages = res.results.map(image => ({
    id: image.id,
    filename: image.filename,
    info: {
      author: image.author?.name ?? null,
      date: image.date_created,
      dateText: image.date_created_text,
    },
  })) as SiteImage[];
  return { images: newImages, total: res.count, hasNext: res.next !== null };
}

const { images, total, nextImages } = useImages(imageQuery);

async function getMoreImages() {
  await nextImages(props.site);
}

await getMoreImages();

const mapBaseLayer = computed(() => {
  if (locality.value?.country.iso_3166_1_alpha_2 === "EE")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  const overlays: MapOverlay[] = [];
  if (locality.value?.country.iso_3166_1_alpha_2 === "EE")
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
          :total="total"
          @update="getMoreImages"
        >
          <template #tooltipInfo="{ item }">
            <div v-if="item.info.author">
              <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
              <span>{{ item.info.author }}</span>
            </div>
            <div v-if="item.info.date || item.info.dateText">
              <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
              <span v-if="item.info.date">
                {{ $formatDate(item.info.date) }}
              </span>
              <span v-else>{{ item.info.dateText }}</span>
            </div>
          </template>
          <template #overlayInfo="{ item }">
            <div v-if="item.info.author">
              <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
              <span>{{ item.info.author }}</span>
            </div>
            <div v-if="item.info.date || item.info.dateText">
              <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
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
            :title="$t('site.name')"
            :value="$translate({
              et: site.name,
              en: site.name_en ?? site.name,
            })
            "
          />
          <TableRow
            v-if="area"
            :title="$t('site.area')"
            :value="area"
          >
            <template #value>
              <BaseLinkExternal
                v-if="area.type === 2"
                :to="`https://turba.geoloogia.info/turbaala/${area.id}`"
              >
                {{
                  $translate({
                    et: area.name,
                    en: area.name_en,
                  })
                }}
              </BaseLinkExternal>
              <BaseLink
                v-else
                :to="localePath({
                  name: 'area-id',
                  params: { id: area.id },
                })
                "
              >
                {{
                  $translate({
                    et: area.name,
                    en: area.name_en,
                  })
                }}
              </BaseLink>
            </template>
          </TableRow>

          <TableRow
            v-if="area && area.type === 2"
            :title="$t('site.areaText1')"
            :value="planArray"
          >
            <template #value>
              <span v-for="(item, index) in planArray" :key="index">
                <a
                  class="text-link"
                  :download="item.trim()"
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
            v-if="site.project"
            :title="$t('site.project')"
            :value="$translate({
              et: site.project.name,
              en: site.project.name_en,
            })
            "
          />
          <TableRow :title="$t('site.coordx')" :value="site.coordx" />
          <TableRow :title="$t('site.coordy')" :value="site.coordy" />
          <TableRow :title="$t('site.extent')" :value="site.extent" />
          <TableRow :title="$t('site.depth')" :value="site.depth" />

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
            :value="$translate({
              et: locality.country.name,
              en: locality.country.name_en,
            })
            "
          >
            <template #value>
              {{
                $t("locality.countryFormat", {
                  name: $translate({
                    et: locality.country.name,
                    en: locality.country.name_en,
                  }),
                  iso: locality.country.iso_3166_1_alpha_2,
                })
              }}
            </template>
          </TableRow>
          <TableRow :title="$t('locality.coordinates')" :value="`${site.latitude}, ${site.longitude}`" />
          <TableRow
            v-if="elevation"
            :title="$t('site.elevation')"
            :value="elevation"
          />
          <TableRow
            v-if="locality"
            :title="$t('locality.depth')"
            :value="locality.depth"
          />
          <TableRow
            v-if="site.accuracy"
            :title="$t('site.locationAccuracy')"
            :value="site.accuracy"
          />
          <TableRow
            v-if="site.coordinate_method"
            :title="$t('site.coordDetMethod')"
            :value="$translate({
              et: site.coordinate_method.value,
              en: site.coordinate_method.value_en,
            })
            "
          />
          <TableRow :title="$t('site.description')" :value="site.description" />
          <TableRow
            v-if="site.remarks"
            :title="$t('site.remarks')"
            :value="site.remarks"
          />
          <TableRow
            v-if="site.remarks_location"
            :title="$t('site.remarksLocation')"
            :value="site.remarks_location"
          />
          <TableRow
            v-if="studied"
            :title="$t('site.studied')"
            :value="studied"
          />
          <TableRow
            v-if="site.date_added"
            :title="$t('site.dateAdded')"
            :value="$formatDate(site.date_added)"
          />
          <TableRow
            v-if="site.date_changed"
            :title="$t('site.dateChanged')"
            :value="$formatDate(site.date_changed)"
          />
        </BaseTable>
      </VCol>
      <VCol v-if="(site.latitude && site.longitude) || site.locality" :xl="4">
        <MapDetail
          v-if="site.latitude && site.longitude"
          :base-layer="mapBaseLayer"
          :overlays="mapOverlays"
          :center="{
            latitude: site.latitude,
            longitude: site.longitude,
          }"
          :markers="[
            {
              latitude: site.latitude,
              longitude: site.longitude,
              text: $translate({
                et: site.name,
                en: site.name_en ?? site.name,
              })!,
              route: localePath({
                name: 'site-id',
                params: { id: site.id },
              }),
            },
          ]"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
