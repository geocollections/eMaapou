<script setup lang="ts">
import type { Sample } from "../[id].vue";
import BaseLinkExternal from "~/components/base/BaseLinkExternal.vue";
import type { MapOverlay } from "~/components/map/MapDetail.client.vue";

const props = defineProps<{
  sample: Sample;
}>();

const localePath = useLocalePath();
const { $formatDate } = useNuxtApp();

const sampleImageFunc = useSampleImageFunction();
const { images, total, nextImages } = useImages(sampleImageFunc);

async function getMoreImages() {
  await nextImages(props.sample);
}

await getMoreImages();

const parentSpecimen = computed(() => props.sample.specimen);
const parent = computed(() => props.sample.parent);
const project = computed(() => props.sample.project);
const database = computed(() => props.sample.database);
const owner = computed(() => props.sample.owner);
const classificationRock = computed(() => props.sample.classification_rock);
const samplePurpose = computed(() => props.sample.purpose);
const collector = computed(() => props.sample.collector);
const lithostratigraphy = computed(() => props.sample.lithostratigraphy);
const stratigraphy = computed(() => props.sample.stratigraphy);
const site = computed(() => props.sample.site);
const series = computed(() => props.sample.sample_series);
const locality = computed(() => props.sample.locality);

const showMap = computed(() => {
  return (
    (locality.value && locality.value.latitude && locality.value.longitude)
    || (site.value && site.value.latitude && site.value.longitude)
  );
});

const mapCenter = computed(() => {
  if (locality.value?.latitude && locality.value?.longitude) {
    return {
      latitude: locality.value.latitude,
      longitude: locality.value.longitude,
    };
  }
  if (site.value?.latitude && site.value?.longitude) {
    return {
      latitude: site.value.latitude,
      longitude: site.value.longitude,
    };
  }
  return undefined;
});
const { $translate } = useNuxtApp();

const mapMarkers = computed(() => {
  if (locality.value?.latitude && locality.value?.longitude) {
    return [
      {
        latitude: locality.value.latitude,
        longitude: locality.value.longitude,
        text: $translate({
          et: locality.value.name,
          en: locality.value.name_en,
        }),
        route: localePath({
          name: "locality-id",
          params: { id: locality.value.id },
        }),
      },
    ];
  }
  if (site.value?.latitude && site.value?.longitude) {
    return [
      {
        latitude: site.value.latitude,
        longitude: site.value.longitude,
        text: site.value.name,
        route: localePath({
          name: "site-id",
          params: { id: site.value.id },
        }),
      },
    ];
  }
  return [];
});

const mapBaseLayer = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  const overlays: MapOverlay[] = [];
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
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
            :title="$t('sample.number')"
            :value="sample.number"
          />
          <TableRow
            v-if="parent"
            :title="$t('sample.parent')"
            :value="parent"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'sample-id',
                    params: { id: value.id },
                  })
                "
              >
                {{
                  value.number
                }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            v-if="parentSpecimen"
            :title="$t('sample.parentSpecimen')"
            :value="parentSpecimen"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'specimen-id',
                    params: { id: value.id },
                  })
                "
              >
                {{
                  value.number
                }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            :title="$t('sample.parentSpecimen')"
            :value="sample.igsn"
          >
            <template #value="{ value }">
              <BaseLinkExternal
                :to="`http://igsn.org/${value}`"
              >
                {{ value }}
              </BaseLinkExternal>
            </template>
          </TableRow>
          <TableRow
            :title="$t('sample.numberAdditional')"
            :value="sample.number_additional"
          />
          <TableRow
            :title="$t('sample.numberField')"
            :value="sample.number_field"
          />
          <template v-if="locality">
            <TableRow
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
              :title="$t('sample.localityFree')"
              :value="sample.locality_text"
            />
            <TableRow
              v-if="locality.country"
              :title="$t('locality.country')"
              :value="
                $translate({
                  et: locality.country.name,
                  en: locality.country.name_en,
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
          </template>
          <template v-if="site">
            <TableRow
              :title="$t('sample.site')"
              :value="site"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="
                    localePath({
                      name: 'site-id',
                      params: { id: value.id },
                    })
                  "
                >
                  {{
                    value.name
                  }}
                </BaseLink>
              </template>
            </TableRow>
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
          <TableRow
            v-if="stratigraphy"
            :title="$t('sample.stratigraphy')"
            :value="stratigraphy"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'stratigraphy-id',
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
            v-if="lithostratigraphy"
            :title="$t('sample.lithostratigraphy')"
            :value="lithostratigraphy"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'stratigraphy-id',
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
            :title="$t('sample.stratigraphyFree')"
            :value="sample.stratigraphy_text"
          />
          <TableRow
            :title="$t('sample.stratigraphyBed')"
            :value="sample.stratigraphy_bed"
          />
          <TableRow
            :title="$t('sample.dateCollected')"
            :value="sample.date_collected || sample.date_collected_text"
          />
          <TableRow
            v-if="collector || sample.collector_text"
            :title="$t('sample.agentCollected')"
            :value="collector?.name || sample.collector_text"
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
                et: sample.rock_text,
                en: sample.rock_text_en,
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
            v-if="sample.is_palaeontology"
            :title="$t('sample.palaeontology')"
            :value="sample.is_palaeontology"
          >
            <template #value="{ value }">
              <BaseBoolean :model-value="value" />
            </template>
          </TableRow>
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
            :value="owner.name"
          />
          <TableRow
            v-if="database"
            :title="$t('sample.database')"
            :value="database"
          >
            <template #value="{ value }">
              <BaseLink
                :to="value.url"
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
            v-if="project"
            :title="$t('sample.project')"
            :value="
              $translate({
                et: project.name,
                en: project.name_en,
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
      <VCol v-if="showMap" :xl="4">
        <MapDetail
          v-if="showMap"
          class="mb-4"
          :base-layer="mapBaseLayer"
          :overlays="mapOverlays"
          :center="mapCenter"
          :markers="mapMarkers"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
