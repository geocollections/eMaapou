<script setup lang="ts">
import {
  mdiFileDownloadOutline,
  mdiFileMusicOutline,
  mdiFileVideoOutline,
} from "@mdi/js";
import type { File } from "../[id].vue";
import type { MapOverlay } from "~/components/map/MapDetail.client.vue";
import BaseLinkExternal from "~/components/base/BaseLinkExternal.vue";

const props = defineProps<{
  file: File;
}>();

const { $translate, $geoloogiaFetch } = useNuxtApp();
const img = useImage();
const localePath = useLocalePath();
const route = useRoute();

const { data } = await useAsyncData("general", async () => {
  const attachmentKeywordsResponse = await $geoloogiaFetch<GeoloogiaListResponse>("/attachment_keyword/", {
    query: {
      attachment: route.params.id,
      nest: 1,
    },
  });

  if (props.file.specimen) {
    const specimenIdentificationPromise = $geoloogiaFetch<GeoloogiaListResponse>(
      "/specimen_identification/",
      {
        query: {
          current: true,
          specimen: props.file.specimen.id,
          nest: 1,
        },
      },
    );
    const specimenIdentificationGeologyPromise = $geoloogiaFetch<GeoloogiaListResponse>(
      "/specimen_identification_geology/",
      {
        query: {
          current: true,
          specimen: props.file.specimen.id,
          nest: 1,
        },
      },
    );
    const [
      specimenIdentificationResponse,
      specimenIdentificationGeologyResponse,
    ] = await Promise.all([
      specimenIdentificationPromise,
      specimenIdentificationGeologyPromise,
    ]);
    return {
      attachmentKeywords: attachmentKeywordsResponse.results,
      specimenIdentification: specimenIdentificationResponse.results,
      specimenIdentificationGeology:
        specimenIdentificationGeologyResponse.results,
    };
  }
  return {
    attachmentKeywords: attachmentKeywordsResponse.results,
    specimenIdentification: [],
    specimenIdentificationGeology: [],
  };
}, {
  default: () => ({
    attachmentKeywords: [],
    specimenIdentification: [],
    specimenIdentificationGeology: [],
  }),
});
const imageSize = computed(() => {
  return props.file.image_width && props.file.image_height
    ? `${props.file.image_width} × ${props.file.image_height} px`
    : undefined;
});
const isImage = computed(() => props.file.mime_type?.content_type.includes("image"));
const isAudio = computed(() => props.file.mime_type?.content_type.includes("audio"));
const isVideo = computed(() => props.file.mime_type?.content_type.includes("video"));

const imageSizes = computed(() => {
  if (!isImage.value)
    return ["original"];
  return ["small", "medium", "large", "original"];
});

const showMap = computed(() => {
  return (
    (props.file.locality?.latitude && props.file.locality?.longitude)
    || (props.file.specimen?.locality?.latitude
    && props.file.specimen?.locality?.longitude)
    || (props.file.image_latitude && props.file.image_longitude)
  );
});

const _mapIsEstonian = computed(() => {
  return (
    props.file.locality?.country?.iso_3166_1_alpha_2 === "EE"
    || props.file.specimen?.locality?.country?.iso_3166_1_alpha_2 === "EE"
  );
});

const mapLatitude = computed(() => {
  return (
    props.file.locality?.latitude
    || props.file.specimen?.locality?.latitude
    || props.file.image_latitude
  );
});
const mapLongitude = computed(() => {
  return (
    props.file.locality?.longitude
    || props.file.specimen?.locality?.longitude
    || props.file.image_longitude
  );
});

const mapLocalityText = computed(() => {
  return $translate({
    et:
      props.file.locality?.name
      || props.file.specimen?.locality?.name
      || props.file.image_place
      || props.file.description || "Lokaliteet",
    en:
      props.file.locality?.name_en
      || props.file.specimen?.locality?.name_en
      || props.file.image_place
      || props.file.description_en || "Locality",
  });
});

const specimen = computed(() => props.file.specimen);
const imageset = computed(() => props.file.imageset);
const locality = computed(
  () => props.file.locality ?? props.file.specimen?.locality,
);
const type = computed(() => props.file.type);
const agentDigitised = computed(() => props.file.digitised_by);
const database = computed(() => props.file.database);
const licence = computed(() => props.file.licence);

const attachmentKeywords = computed(() => data.value?.attachmentKeywords ?? []);
const specimenIdentification = computed(
  () => data.value?.specimenIdentification ?? [],
);
const specimenIdentificationGeology = computed(
  () => data.value?.specimenIdentificationGeology ?? [],
);
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
    <VRow>
      <VCol>
        <div
          v-if="isImage"
          style="width: 100%; max-height: 700px; margin-left: auto; margin-right: auto;"
          class="d-flex justify-center rounded bg-grey-lighten-4"
        >
          <NuxtImg
            :src="file.filename"
            provider="geocollections"
            :modifiers="{ size: 'large' }"
            fit="inside"
            style="max-height: 700px; max-width: 100%; margin-left: auto; margin-right: auto;"
          />
        </div>

        <!-- Audio -->
        <audio v-else-if="isAudio" controls>
          <source
            :src="`https://files.geocollections.info/${file.filename}`"
          >
          Your browser does not support the audio element.
          <VIcon>{{ mdiFileMusicOutline }}</VIcon>
        </audio>

        <!-- Video -->
        <video v-else-if="isVideo" controls>
          <source
            :src="`https://files.geocollections.info/${file.filename}`"
          >
          Your browser does not support the video element.
          <VIcon>{{ mdiFileVideoOutline }}</VIcon>
        </video>

        <!-- File -->
        <div
          v-else
          class="rounded file-download text-primary"
          @click="
            $openWindow(
              `https://files.geocollections.info/${file.filename}`,
            )
          "
        >
          <VIcon size="large" color="primary-darken-2">
            {{ mdiFileDownloadOutline }}
          </VIcon>
          {{ $t("file.download") }}
        </div>

        <div
          v-if="isImage"
          class="justify-center d-flex flex-column justify-md-space-between flex-md-row"
          :class="{ 'mt-4': !isImage }"
        >
          <div class="text-center text-md-left">
            <div v-if="file.author || file.author_text">
              <span class="font-weight-bold">{{ $t("file.author") }}: </span>
              <span v-if="file.author">{{ file.author.name }}</span>
              <span v-else>{{ file.author_text }}</span>
            </div>
            <div v-if="file.date_created || file.date_created_text">
              <span class="font-weight-bold">{{ $t("file.date") }}: </span>
              <span v-if="file.date_created">{{ file.date_created }}</span>
              <span v-else>{{ file.date_created }}</span>
            </div>
          </div>

          <div class="text-center">
            <span v-for="(size, index) in imageSizes" :key="index">
              <a
                class="text-link"
                @click="$openImage(file.filename, size)"
              >
                {{ $t(`common.${size}`) }}
                <VIcon
                  v-if="size === 'original'"
                  size="small"
                  color="primary-darken-2"
                >
                  {{ mdiFileDownloadOutline }}
                </VIcon>
              </a>
              <span v-if="index < imageSizes.length - 1">| </span>
            </span>
          </div>
        </div>
      </VCol>
      <VCol
        :cols="12"
        :sm="12"
        :md="6"
        :lg="5"
        :xl="5"
      >
        <BaseTable class="border rounded mb-2">
          <TableRow
            v-if="specimen?.collection"
            :title="$t('file.collectionNr')"
            :value="specimen.collection"
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
            v-if="specimen"
            :title="$t('file.specimenNr')"
            :value="specimen"
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
          <template v-for="(item, index) in specimenIdentification">
            <TableRow
              v-if="item.taxon"
              :key="index"
              :title="$t('file.name')"
              :value="item.taxon"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="`https://fossiilid.info/${value.id}`"
                >
                  {{ value.taxon }}
                </BaseLink>
                <template v-if="item.name">
                  | {{ item.name }}
                </template>
              </template>
            </TableRow>
          </template>
          <template v-for="(item, index) in specimenIdentificationGeology">
            <TableRow
              v-if="item.taxon"
              :key="index"
              :title="$t('file.name')"
              :value="item.taxon"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="`https://fossiilid.info/${value.id}`"
                >
                  {{ value.taxon }}
                </BaseLink>
                <template v-if="item.name">
                  | {{ item.name }}
                </template>
              </template>
            </TableRow>
          </template>
          <TableRow
            v-if="locality"
            :title="$t('file.locality')"
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
            v-if="specimen?.stratigraphy"
            :title="$t('file.stratigraphy')"
            :value="specimen.stratigraphy"
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
            v-if="file.image_scalebar"
            :title="$t('file.scalebar')"
            :value="file.image_scalebar"
          />
          <TableRow
            :title="$t('file.description')"
            :value="
              $translate({
                et: file.description,
                en: file.description_en,
              })
            "
          />
          <TableRow
            :title="$t('file.imageNumber')"
            :value="file.image_number"
          />
          <TableRow
            v-if="imageset"
            :title="$t('file.imagesetNumber')"
            :value="imageset.number"
          />
          <TableRow
            v-if="imageset"
            :title="$t('file.imagesetDescription')"
            :value="imageset.description"
          />
          <TableRow
            :title="$t('file.author')"
            :value="file.author?.name"
          />
          <TableRow
            :title="$t('file.author')"
            :value="file.author_text"
          />
          <TableRow
            :title="$t('file.imagePeople')"
            :value="file.image_people"
          />
          <TableRow
            :title="$t('file.date')"
            :value="file.date_created || file.date_created_text"
          />
          <TableRow
            :title="$t('file.imagePlace')"
            :value="file.image_place"
          />
          <TableRow
            :title="$t('file.imageLatitude')"
            :value="file.image_latitude"
          />
          <TableRow
            :title="$t('file.imageLongitude')"
            :value="file.image_longitude"
          />
          <TableRow
            v-if="type"
            :title="$t('file.type')"
            :value="
              $translate({
                et: type.value,
                en: type.value_en,
              })
            "
          />
          <TableRow
            :title="$t('file.format')"
            :value="file.mime_type?.content_type"
          />
          <TableRow
            v-if="attachmentKeywords.length > 0"
            :title="$t('file.keywords')"
            :value="attachmentKeywords"
          >
            <template #value="{ value }">
              <ul style="list-style-position: inside">
                <template v-for="(item, index) in value">
                  <li v-if="item.keyword" :key="index">
                    {{ item.keyword.keyword }}
                  </li>
                </template>
              </ul>
            </template>
          </TableRow>
          <TableRow
            v-if="agentDigitised"
            :title="$t('file.personDigitised')"
            :value="agentDigitised.name"
          />
          <TableRow
            :title="$t('file.dateDigitised')"
            :value="file.date_digitised || file.date_digitised_text"
          />
          <TableRow
            :title="$t('file.imageSize')"
            :value="imageSize"
          />
          <TableRow
            v-if="database"
            :title="$t('file.institution')"
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
            v-if="licence"
            :title="$t('file.licence')"
            :value="licence"
          >
            <template #value="{ value }">
              <BaseLinkExternal
                :to="value.url"
              >
                {{ value.name }}
              </BaseLinkExternal>
            </template>
          </TableRow>
          <TableRow
            :title="$t('file.remarks')"
            :value="file.remarks"
          />
          <TableRow
            v-if="file.date_added"
            :title="$t('file.dateAdded')"
            :value="$formatDate(file.date_added)"
          />
          <TableRow
            v-if="file.date_changed"
            :title="$t('file.dateChanged')"
            :value="$formatDate(file.date_changed)"
          />
        </BaseTable>

        <MapDetail
          v-if="showMap"
          :base-layer="mapBaseLayer"
          :overlays="mapOverlays"
          :center="{
            latitude: mapLatitude!,
            longitude: mapLongitude!,
          }"
          :markers="[
            {
              latitude: mapLatitude!,
              longitude: mapLongitude!,
              text: mapLocalityText,
            },
          ]"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
