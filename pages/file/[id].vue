<template>
  <detail v-if="!pending" :loading="pending" :error="error">
    <template #title>
      <!-- <header-detail :ids="ids" :title="pageTitle" /> -->
      <header-detail
        :title="pageTitle"
        show-prev-next
        :search-to="localePath({ path: '/photo' })"
      />
    </template>
    <template #column-left>
      <v-card-text class="text-center">
        <!-- Image -->
        <v-img
          v-if="isImage"
          class="rounded"
          content-class="image-content"
          max-height="700"
          contain
          :lazy-src="
            img(
              file.filename,
              { size: 'small' },
              {
                provider: 'geocollections',
              },
            )
          "
          :src="
            img(
              file.filename,
              { size: 'medium' },
              {
                provider: 'geocollections',
              },
            )
          "
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <!-- Audio -->
        <audio v-else-if="isAudio" controls>
          <source
            :src="`https://files.geocollections.info/${file.uuid_filename}`"
          />
          Your browser does not support the audio element.
          <v-icon>{{ mdiFileMusicOutline }}</v-icon>
        </audio>

        <!-- Video -->
        <video v-else-if="isVideo" controls>
          <source
            :src="`https://files.geocollections.info/${file.uuid_filename}`"
          />
          Your browser does not support the video element.
          <v-icon>{{ mdiFileVideoOutline }}</v-icon>
        </video>

        <!-- File -->
        <div
          v-else
          class="rounded file-download primary--text"
          @click="
            $openWindow(
              `https://files.geocollections.info/${file.uuid_filename}`,
            )
          "
        >
          <v-icon large color="primary darken-2">
            {{ mdiFileDownloadOutline }}
          </v-icon>
          {{ $t("file.download") }}
        </div>

        <div
          v-if="isImage"
          class="justify-center d-flex flex-column justify-md-space-between flex-md-row"
          :class="{ 'mt-4': !isImage }"
        >
          <div class="text-center text-md-left">
            <div v-if="file.author || file.author_free">
              <span class="font-weight-bold">{{ $t("file.author") }}: </span>
              <span v-if="file.author">{{ file.author }}</span>
              <span v-else>{{ file.author_free }}</span>
            </div>
            <div v-if="file.date_created || file.date_created_free">
              <span class="font-weight-bold">{{ $t("file.date") }}: </span>
              <span v-if="file.date_created">{{ file.date_created }}</span>
              <span v-else>{{ file.date_created_free }}</span>
            </div>
          </div>

          <div class="text-center">
            <span v-for="(size, index) in imageSizes" :key="index">
              <a
                class="text-link"
                @click="$openImage(file.uuid_filename, size)"
              >
                {{ $t(`common.${size}`) }}
                <v-icon
                  v-if="size === 'original'"
                  small
                  color="primary darken-2"
                >
                  {{ mdiFileDownloadOutline }}
                </v-icon>
              </a>
              <span v-if="index < imageSizes.length - 1">| </span>
            </span>
          </div>
        </div>
      </v-card-text>
    </template>

    <template #column-right>
      <v-card-text>
        <base-table>
          <table-row-link
            v-if="specimen && specimen.coll"
            :title="$t('file.collectionNr').toString()"
            :value="specimen.coll.number"
            nuxt
            :href="
              localePath({
                name: 'specimen-id',
                params: { id: file.specimen.id },
              })
            "
          />
          <table-row-link
            v-if="specimen"
            :title="$t('file.specimenNr').toString()"
            :value="file.specimen.specimen_id"
            nuxt
            :href="
              localePath({
                name: 'specimen-id',
                params: { id: file.specimen.id },
              })
            "
          />
          <template v-for="(item, index) in specimenIdentification">
            <table-row-link
              v-if="item.taxon"
              :key="index"
              :title="$t('file.name').toString()"
              :value="item.taxon.taxon"
              :suffix="item.name ? `| ${item.name}` : ''"
              @link-click="
                $openWindow(`https://fossiilid.info/${item.taxon.id}`)
              "
            />
          </template>
          <template v-for="(item, index) in specimenIdentificationGeology">
            <table-row-link
              v-if="item.taxon"
              :key="index"
              :title="$t('file.name').toString()"
              :value="item.taxon.taxon"
              :suffix="item.name ? `| ${item.name}` : ''"
              @link-click="
                $openWindow(`https://fossiilid.info/${item.taxon.id}`)
              "
            />
          </template>
          <table-row-link
            v-if="specimen && specimen.locality"
            :title="$t('file.locality').toString()"
            :value="
              $translate({
                et: specimen.locality.locality,
                en: specimen.locality.locality_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'locality-id',
                params: { id: specimen.locality.id },
              })
            "
          />
          <table-row-link
            v-if="specimen && specimen.stratigraphy"
            :title="$t('file.stratigraphy').toString()"
            :value="
              $translate({
                et: specimen.stratigraphy.stratigraphy,
                en: specimen.stratigraphy.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: specimen.stratigraphy.id },
              })
            "
          />
          <!-- <table-row -->
          <!--   v-if="file.image_scalebar" -->
          <!--   :title="$t('file.scalebar').toString()" -->
          <!--   :value="file.image_scalebar" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.description').toString()" -->
          <!--   :value=" -->
          <!--     $translate({ -->
          <!--       et: file.description, -->
          <!--       en: file.description_en, -->
          <!--     }) -->
          <!--   " -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.imageNumber').toString()" -->
          <!--   :value="file.image_number" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   v-if="imageset" -->
          <!--   :title="$t('file.imagesetNumber').toString()" -->
          <!--   :value="imageset.imageset_number" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   v-if="imageset" -->
          <!--   :title="$t('file.imagesetDescription').toString()" -->
          <!--   :value="imageset.description" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.author').toString()" -->
          <!--   :value="file.author" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.author').toString()" -->
          <!--   :value="file.author_free" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.imagePeople').toString()" -->
          <!--   :value="file.image_people" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.date').toString()" -->
          <!--   :value="file.date_created || file.date_created_free" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.imagePlace').toString()" -->
          <!--   :value="file.image_place" -->
          <!-- /> -->
          <table-row-link
            v-if="locality"
            :title="$t('file.locality').toString()"
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
          <!-- <table-row -->
          <!--   :title="$t('file.imageLatitude').toString()" -->
          <!--   :value="file.image_latitude" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   :title="$t('file.imageLongitude').toString()" -->
          <!--   :value="file.image_longitude" -->
          <!-- /> -->
          <table-row
            v-if="type"
            :title="$t('file.type').toString()"
            :value="
              $translate({
                et: type.value,
                en: type.value_en,
              })
            "
          />
          <!-- <table-row -->
          <!--   :title="$t('file.format').toString()" -->
          <!--   :value="file.attachment_format" -->
          <!-- /> -->
          <table-row
            v-if="attachmentKeywords.length > 0"
            :title="$t('file.keywords').toString()"
            :value="attachmentKeywords"
          >
            <template #value>
              <ul v-for="(item, index) in attachmentKeywords" :key="index">
                <li v-if="item.keyword">{{ item.keyword.keyword }}</li>
              </ul>
            </template>
          </table-row>
          <table-row
            v-if="agentDigitised"
            :title="$t('file.personDigitised').toString()"
            :value="agentDigitised.agent"
          />
          <!-- <table-row -->
          <!--   :title="$t('file.dateDigitised').toString()" -->
          <!--   :value="file.date_digitised || file.date_digitised_free" -->
          <!-- /> -->
          <table-row
            :title="$t('file.imageSize').toString()"
            :value="imageSize"
          />
          <table-row-link
            v-if="database"
            :title="$t('file.institution').toString()"
            :value="
              $translate({
                et: database.name,
                en: database.name_en,
              })
            "
            :href="database.url"
            target="DatabaseWindow"
          />
          <table-row-link
            v-if="licence"
            :title="$t('file.licence').toString()"
            :value="licence.licence_en"
            @link-click="$openWindow(licence.licence_url_en)"
          />
          <!-- <table-row -->
          <!--   :title="$t('file.remarks').toString()" -->
          <!--   :value="file.remarks" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   v-if="file.date_added" -->
          <!--   :title="$t('file.dateAdded').toString()" -->
          <!--   :value="$formatDate(file.date_added)" -->
          <!-- /> -->
          <!-- <table-row -->
          <!--   v-if="file.date_changed" -->
          <!--   :title="$t('file.dateChanged').toString()" -->
          <!--   :value="$formatDate(file.date_changed)" -->
          <!-- /> -->
        </base-table>

        <v-card v-if="showMap" id="map-wrap" elevation="0">
          <v-card-title class="pl-0 subsection-title"
            >{{ $t("locality.map") }}
          </v-card-title>
          <map-detail
            rounded
            :estonian-map="mapIsEstonian"
            :estonian-bedrock-overlay="mapIsEstonian"
            height="300px"
            :center="{
              latitude: mapLatitude,
              longitude: mapLongitude,
            }"
            :markers="[
              {
                latitude: mapLatitude,
                longitude: mapLongitude,
                text: mapLocalityText,
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <nuxt-page />
    </template>
  </detail>
</template>

<script setup lang="ts">
// NOTE: For some incomprehensible reason, using any echart based chart
// and `v-data-table` together in this components results in the production build containing copies of echarts.
import {
  mdiFileMusicOutline,
  mdiFileVideoOutline,
  mdiFileDownloadOutline,
} from "@mdi/js";

const { $geoloogiaFetch, $translate } = useNuxtApp();
const { t } = useI18n();
const img = useImage();
const localePath = useLocalePath();
const route = useRoute();
const file = computed(() => data.value?.file);
const attachmentKeywords = computed(() => data.value?.attachmentKeywords ?? []);
const specimenIdentification = computed(
  () => data.value?.specimenIdentification ?? [],
);
const specimenIdentificationGeology = computed(
  () => data.value?.specimenIdentificationGeology ?? [],
);
const imageSize = computed(() => {
  return file.value?.image_width && file.value?.image_height
    ? `${file.value.image_width} × ${file.value.image_height} px`
    : null;
});
const isImage = computed(() => file.value?.attachment_format.includes("image"));
const isAudio = computed(() => file.value?.attachment_format.includes("audio"));
const isVideo = computed(() => file.value?.attachment_format.includes("video"));
const imageSizes = computed(() => {
  if (!isImage) return ["original"];
  return ["small", "medium", "large", "original"];
});
const showMap = computed(() => {
  return (
    (file.value?.locality?.latitude && file.value?.locality?.longitude) ||
    (file.value?.specimen?.locality?.latitude &&
      file.value?.specimen?.locality?.longitude) ||
    (file.value?.image_latitude && state?.file.image_longitude)
  );
});

const mapIsEstonian = computed(() => {
  return (
    file.value?.locality?.country?.value === "Eesti" ||
    file.value?.specimen?.locality?.country?.value === "Eesti"
  );
});

const mapLatitude = computed(() => {
  return (
    file.value?.locality?.latitude ||
    file.value?.specimen?.locality?.latitude ||
    file.value?.image_latitude
  );
});
const mapLongitude = computed(() => {
  return (
    file.value?.locality?.longitude ||
    file.value?.specimen?.locality?.longitude ||
    file.value?.image_longitude
  );
});

const mapLocalityText = computed(() => {
  return $translate({
    et:
      file.value?.locality?.locality ||
      file.value?.specimen?.locality?.locality ||
      file.value?.image_place ||
      file.value?.description,
    en:
      file.value?.locality?.locality_en ||
      file.value?.specimen?.locality?.locality_en ||
      file.value?.image_place ||
      file.value?.description_en,
  });
});

const specimen = computed(() => file.value?.specimen);
const imageset = computed(() => file.value?.imageset);
const locality = computed(
  () => file.value?.locality ?? file.value?.specimen?.locality,
);
const type = computed(() => file.value?.type);
const agentDigitised = computed(() => file.value?.agent_digitised);
const database = computed(() => file.value?.database);
const licence = computed(() => file.value?.licence);

const { data, pending, error } = useLazyAsyncData("data", async () => {
  const filePromise = $geoloogiaFetch(`/attachment/${route.params.id}/`, {
    query: {
      nest: 2,
    },
  });
  const attachmentKeywordsPromise = $geoloogiaFetch("/attachment_keyword/", {
    query: {
      attachment: route.params.id,
      nest: 1,
    },
  });

  const [fileResponse, attachmentKeywordsResponse] = await Promise.all([
    filePromise,
    attachmentKeywordsPromise,
  ]);

  const ids = fileResponse?.ids;
  const fileObj = fileResponse;
  //
  // if (fileObj?.specimen) {
  //   const specimenIdentificationPromise = $geoloogiaFetch(
  //     "/specimen_identification/",
  //     {
  //       query: {
  //         current: true,
  //         specimen: fileObj.specimen.id,
  //         nest: 1,
  //       },
  //     },
  //   );
  //   const specimenIdentificationGeologyPromise = $geoloogiaFetch(
  //     "/specimen_identification_geology/",
  //     {
  //       query: {
  //         current: true,
  //         specimen: fileObj.specimen.id,
  //         nest: 1,
  //       },
  //     },
  //   );
  //   const [
  //     specimenIdentificationResponse,
  //     specimenIdentificationGeologyResponse,
  //   ] = await Promise.all([
  //     specimenIdentificationPromise,
  //     specimenIdentificationGeologyPromise,
  //   ]);
  //   return {
  //     file: fileObj,
  //     ids,
  //     attachmentKeywords: attachmentKeywordsResponse.results,
  //     specimenIdentification: specimenIdentificationResponse.results,
  //     specimenIdentificationGeology:
  //       specimenIdentificationGeologyResponse.results,
  //   };
  // }
  // return {
  //   file: fileObj,
  //   ids,
  //   attachmentKeywords: attachmentKeywordsResponse.results,
  //   specimenIdentification: [],
  //   specimenIdentificationGeology: [],
  // };
  return {
    file: fileObj,
  };
});

const title = computed(() => {
  if (!file.value) return "";
  switch (file.value.specimen_image_attachment) {
    case 1:
      return `${file.value?.specimen?.coll?.number?.split(" ")?.[0]} ${
        file.value?.specimen?.specimen_id
      } (ID: ${file.value?.specimen.id})`;
    case 2:
      return file.value?.image_number;
    case 4:
      return file.value?.reference?.reference;
    default:
      return `${
        $translate({
          et: file.value?.description,
          en: file.value?.description_en,
        }) ?? file.value?.id
      }`;
  }
});
const pageType = computed(() => {
  if (!file.value) return "";
  switch (file.value.specimen_image_attachment) {
    case 1:
      return t("file.specimenTitle");
    case 2:
      return t("file.imageTitle");
    case 4:
      return t("file.referenceTitle");
    default:
      return t("file.fileTitle");
  }
});
const pageTitle = computed(() => `${title.value} | ${pageType.value}`);
// export default defineComponent({
//   setup() {
//     useMeta(() => {
//       return {
//         title: pageTitle.value,
//         meta: [
//           {
//             property: "og:title",
//             hid: "og:title",
//             content: pageTitle.value,
//           },
//           {
//             property: "og:url",
//             hid: "og:url",
//             content: route.value.path,
//           },
//           ...[
//             {
//               property: "og:image",
//               hid: "og:image",
//               content: isImage.value
//                 ? $img(
//                     `${file.value.filename}`,
//                     { size: "small" },
//                     {
//                       provider: "geocollections",
//                     },
//                   )
//                 : "",
//             },
//             {
//               property: "og:video",
//               hid: "og:video",
//               content: isVideo.value
//                 ? `https://files.geocollections.info/${file.value.uuid_filename}`
//                 : "",
//             },
//             {
//               property: "og:audio",
//               hid: "og:audio",
//               content: isAudio.value
//                 ? `https://files.geocollections.info/${file.value.uuid_filename}`
//                 : "",
//             },
//           ],
//         ],
//       };
//     });
//     return {
//       ...toRefs(state),
//       licence,
//       database,
//       agentDigitised,
//       type,
//       locality,
//       imageset,
//       specimen,
//       mapLocalityText,
//       mapLongitude,
//       mapLatitude,
//       mapIsEstonian,
//       showMap,
//       imageSizes,
//       isVideo,
//       isAudio,
//       isImage,
//       icons,
//       imageSize,
//       pageTitle,
//       isNull,
//       isNil,
//       isEmpty,
//     };
//   },
//   head: {},
// });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

video {
  max-width: 100%;
  vertical-align: middle;
}

.file-download {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-style: dashed;
  background-color: #eee;
  border-color: #5c6598;
  transition: opacity 200ms ease;
}

.file-download:hover {
  opacity: 0.8;
  cursor: pointer;
}
</style>
