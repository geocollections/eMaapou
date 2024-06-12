<script setup lang="ts">
import type { Specimen } from "../[id].vue";

const props = defineProps<{
  specimen: Specimen;
  specimenAlt: any;
}>();

const localePath = useLocalePath();

const dateCollected = computed(() => {
  if (!props.specimen)
    return "";
  return props.specimen.date_collected ?? props.specimen.date_collected_text;
});
const collection = computed(() => props.specimen.collection);
const type = computed(() => props.specimen.type);
const classification = computed(() => props.specimen.classification);
const locality = computed(() => props.specimen.locality);
const stratigraphy = computed(() => props.specimen.stratigraphy);
const lithostratigraphy = computed(() => props.specimen.lithostratigraphy);
const agentCollected = computed(() => props.specimen.collector);
const database = computed(() => props.specimen.database);
const sample = computed(() => props.specimen.sample);
const parent = computed(() => props.specimen.parent);

const specimenImageFunc = useSpecimenImageFunction();
const { images, total, nextImages } = useImages(specimenImageFunc);

async function getMoreImages() {
  await nextImages(props.specimen);
}

await getMoreImages();

const mapBaseLayer = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return ["Estonian bedrock" as const];
  return undefined;
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
            <div v-if="item.info.date">
              <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
              <span>
                {{ $formatDate(item.info.date) }}
              </span>
            </div>
          </template>
          <template #overlayInfo="{ item }">
            <div v-if="item.info.author">
              <span class="font-weight-bold">{{ $t("photo.author") }}: </span>
              <span>{{ item.info.author }}</span>
            </div>
            <div v-if="item.info.date">
              <span class="font-weight-bold">{{ $t("photo.date") }}: </span>
              <span>
                {{ $formatDate(item.info.date) }}
              </span>
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
            v-if="collection"
            :title="$t('specimen.collectionNr')"
            :value="collection"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'collection-id',
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
            :title="$t('specimen.number')"
            :value="`${specimen.number}`"
          />
          <TableRow
            v-if="parent"
            :title="$t('specimen.parent')"
            :value="parent"
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
            v-if="specimen.old_number"
            :title="$t('specimen.oldNumber')"
            :value="`${specimen.old_number}`"
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
                et: classification.name,
                en: classification.name_en,
              })
            "
          />
          <TableRow
            :title="$t('specimen.part')"
            :value="specimen.part"
          />
          <TableRow
            v-if="locality"
            :title="$t('specimen.locality')"
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
            :title="$t('specimen.depth')"
            :value="specimen.depth"
          />
          <TableRow
            v-if="stratigraphy"
            :title="$t('specimen.stratigraphy')"
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
            :title="$t('specimen.lithostratigraphy')"
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
            :title="$t('specimen.stratigraphyRemarks')"
            :value="specimen.stratigraphy_text"
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
            :value="agentCollected.name"
          />
          <TableRow
            v-if="sample"
            :title="$t('specimen.sample')"
            :value="sample"
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
            v-if="database"
            :title="$t('specimen.institution')"
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
