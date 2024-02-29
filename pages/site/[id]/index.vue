<script setup lang="ts">
import { mdiFileDownloadOutline, mdiOpenInNew } from "@mdi/js";

const props = defineProps<{ site: any }>();

const localePath = useLocalePath();
const { $formatDate, $geoloogiaFetch } = useNuxtApp();

const locality = computed(() => props.site.locality);
const area = computed(() => props.site.area);
const planArray = computed(() => {
  return props.site.area?.text1 ? props.site.area?.text1.split(",") : [];
});
const elevation = computed(() => {
  return props.site.elevation_accuracy
    ? `${props.site.elevation} (± ${props.site.elevation_accuracy})`
    : props.site?.elevation;
});
const studied = computed(() => {
  return props.site.date_start
    ? $formatDate(props.site.date_start)
    : props.site?.date_free;
});
const route = useRoute();
const images = ref<any[]>([]);
const imagesHasNext = ref(true);

async function imageQuery({ rows, page }: { rows: number; page: number }) {
  if (!imagesHasNext.value)
    return;
  const newImages = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_link/", {
    query: {
      site: route.params.id,
      attachment__attachment_format__value__istartswith: "image",
      nest: 2,
      limit: rows,
      offset: page * rows,
    },
  }).then((res) => {
    return res.results.map((image: any) => ({
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
  <VContainer style="margin: initial">
    <VRow v-if="images.length > 0">
      <VCol>
        <ImageBar
          v-if="images.length > 0"
          class="mt-4"
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
            :title="$t('site.name')"
            :value="$translate({
              et: site.name,
              en: site.name_en ?? site.name,
            })
            "
          />
          <TableRow
            v-if="area"
            :value="area"
            :title="$t('site.area')"
          >
            <template #value>
              <a
                v-if="area.area_type === 2"
                class="text-link"
                @click="$openTurba('turbaala', site.area)"
              >
                {{
                  $translate({
                    et: area.name,
                    en: area.name_en,
                  })
                }}
                <VIcon size="small" color="primary-darken-2">{{
                  mdiOpenInNew
                }}</VIcon>
              </a>
              <NuxtLink
                v-else
                class="text-link"
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
              </NuxtLink>
            </template>
          </TableRow>

          <TableRow
            v-if="area && area.area_type === 2"
            :value="area"
            :title="$t('site.areaText1')"
          >
            <template #value>
              <span v-for="(item, index) in planArray" :key="index">
                <a
                  class="text-link"
                  :download="item.trim()"
                  @click="$openTurba('plaanid', item.trim(), false)"
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

          <TableRowLink
            v-if="locality"
            :title="$t('locality.locality')"
            :value="$translate({
              et: locality.locality,
              en: locality.locality_en,
            })
            "
            nuxt
            :href="localePath({
              name: 'locality-id',
              params: { id: locality.id },
            })
            "
          />
          <TableRow
            v-if="locality && locality.country"
            :title="$t('locality.country')"
            :value="$translate({
              et: locality.country.value,
              en: locality.country.value_en,
            })

            "
          >
            <template #value>
              {{
                $t("locality.countryFormat", {
                  name: $translate({
                    et: locality.country.value,
                    en: locality.country.value_en,
                  }),
                  iso: locality.country.iso_code,
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
            v-if="site.location_accuracy"
            :title="$t('site.locationAccuracy')"
            :value="site.location_accuracy"
          />
          <TableRow
            v-if="site.coord_det_method"
            :title="$t('site.coordDetMethod')"
            :value="$translate({
              et: site.coord_det_method.value,
              en: site.coord_det_method.value_en,
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
      <VCol v-if="(site.latitude && site.longitude) || site.locality_id" :xl="4">
        <MapDetail
          v-if="site.latitude && site.longitude"
          height="300px"
          rounded
          :estonian-map="locality && locality.country
            ? locality.country.value === 'Eesti'
            : false
          "
          :estonian-bedrock-overlay="locality && locality.country
            ? locality.country.value === 'Eesti'
            : false
          "
          site-overlay
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
                en: site.name_en,
              }),
            },
          ]"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
