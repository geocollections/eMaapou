<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
    <template #title>
      <header-detail :ids="ids" :title="pageTitle" />
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
            $img(
              `${file.filename}`,
              { size: 'small' },
              {
                provider: 'geocollections',
              }
            )
          "
          :src="
            $img(
              `${file.filename}`,
              { size: 'medium' },
              {
                provider: 'geocollections',
              }
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
          <v-icon>{{ icons.mdiFileMusicOutline }}</v-icon>
        </audio>

        <!-- Video -->
        <video v-else-if="isVideo" controls>
          <source
            :src="`https://files.geocollections.info/${file.uuid_filename}`"
          />
          Your browser does not support the video element.
          <v-icon>{{ icons.mdiFileVideoOutline }}</v-icon>
        </video>

        <!-- File -->
        <div
          v-else
          class="rounded file-download primary--text"
          @click="
            $openWindow(
              `https://files.geocollections.info/${file.uuid_filename}`
            )
          "
        >
          <v-icon large color="primary darken-2">
            {{ icons.mdiFileDownloadOutline }}
          </v-icon>
          {{ $t('file.download') }}
        </div>

        <div
          v-if="isImage"
          class="justify-center d-flex flex-column justify-md-space-between flex-md-row"
          :class="{ 'mt-4': !isImage }"
        >
          <div class="text-center text-md-left">
            <div v-if="file.author || file.author_free">
              <span class="font-weight-bold">{{ $t('file.author') }}: </span>
              <span v-if="file.author">{{ file.author }}</span>
              <span v-else>{{ file.author_free }}</span>
            </div>
            <div v-if="file.date_created || file.date_created_free">
              <span class="font-weight-bold">{{ $t('file.date') }}: </span>
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
                  {{ icons.mdiFileDownloadOutline }}
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
          <table-row
            v-if="file.image_scalebar"
            :title="$t('file.scalebar').toString()"
            :value="file.image_scalebar"
          />
          <table-row
            :title="$t('file.description').toString()"
            :value="
              $translate({
                et: file.description,
                en: file.description_en,
              })
            "
          />
          <table-row
            :title="$t('file.imageNumber').toString()"
            :value="file.image_number"
          />
          <table-row
            v-if="imageset"
            :title="$t('file.imagesetNumber').toString()"
            :value="imageset.imageset_number"
          />
          <table-row
            v-if="imageset"
            :title="$t('file.imagesetDescription').toString()"
            :value="imageset.description"
          />
          <table-row
            :title="$t('file.author').toString()"
            :value="file.author"
          />
          <table-row
            :title="$t('file.author').toString()"
            :value="file.author_free"
          />
          <table-row
            :title="$t('file.imagePeople').toString()"
            :value="file.image_people"
          />
          <table-row
            :title="$t('file.date').toString()"
            :value="file.date_created || file.date_created_free"
          />
          <table-row
            :title="$t('file.imagePlace').toString()"
            :value="file.image_place"
          />
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
          <table-row
            :title="$t('file.imageLatitude').toString()"
            :value="file.image_latitude"
          />
          <table-row
            :title="$t('file.imageLongitude').toString()"
            :value="file.image_longitude"
          />
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
          <table-row
            :title="$t('file.format').toString()"
            :value="file.attachment_format"
          />
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
          <table-row
            :title="$t('file.dateDigitised').toString()"
            :value="file.date_digitised || file.date_digitised_free"
          />
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
          <table-row
            :title="$t('file.remarks').toString()"
            :value="file.remarks"
          />
          <table-row
            v-if="file.date_added"
            :title="$t('file.dateAdded').toString()"
            :value="$formatDate(file.date_added)"
          />
          <table-row
            v-if="file.date_changed"
            :title="$t('file.dateChanged').toString()"
            :value="$formatDate(file.date_changed)"
          />
        </base-table>

        <v-card v-if="showMap" id="map-wrap" elevation="0">
          <v-card-title class="pl-0 subsection-title"
            >{{ $t('locality.map') }}
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
      <nuxt-child />
    </template>
  </detail>
</template>

<script lang="ts">
// NOTE: For some incomprehensible reason, using any echart based chart
// and `v-data-table` together in this components results in the production build containing copies of echarts.
import {
  mdiFileMusicOutline,
  mdiFileVideoOutline,
  mdiFileDownloadOutline,
  mdiOpenInNew,
} from '@mdi/js'
import isNil from 'lodash/isNil'
import isNull from 'lodash/isNull'
import isEmpty from 'lodash/isEmpty'
import {
  computed,
  defineComponent,
  reactive,
  toRef,
  toRefs,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import HeaderDetail from '~/components/HeaderDetail.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import MapDetail from '~/components/map/MapDetail.vue'
import Detail from '~/templates/Detail.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import { useRedirectInvalidTabRoute } from '~/composables/useRedirectInvalidTabRoute'

export default defineComponent({
  components: {
    HeaderDetail,
    MapDetail,
    TableRow,
    TableRowLink,
    Detail,
    BaseTable,
  },
  setup() {
    const { $services, $translate, i18n, $img } = useContext()
    const route = useRoute()
    const state = reactive({
      expansionPanel: [1] as number[],
      specimenIdentification: [] as any[],
      specimenIdentificationGeology: [] as any[],
      attachmentKeywords: [] as any[],
      file: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as any[],
    })
    const icons = computed(() => {
      return {
        mdiFileMusicOutline,
        mdiFileVideoOutline,
        mdiFileDownloadOutline,
        mdiOpenInNew,
      }
    })
    const imageSize = computed(() => {
      return state.file?.image_width && state.file?.image_height
        ? `${state.file.image_width} × ${state.file.image_height} px`
        : null
    })
    const isImage = computed(() =>
      state.file?.attachment_format.includes('image')
    )
    const isAudio = computed(() =>
      state.file?.attachment_format.includes('audio')
    )
    const isVideo = computed(() =>
      state.file?.attachment_format.includes('video')
    )
    const imageSizes = computed(() => {
      if (!isImage) return ['original']
      return ['small', 'medium', 'large', 'original']
    })
    const showMap = computed(() => {
      return (
        (state.file?.locality?.latitude && state.file?.locality?.longitude) ||
        (state.file?.specimen?.locality?.latitude &&
          state.file?.specimen?.locality?.longitude) ||
        (state.file?.image_latitude && state?.file.image_longitude)
      )
    })

    const mapIsEstonian = computed(() => {
      return (
        state.file?.locality?.country?.value === 'Eesti' ||
        state.file?.specimen?.locality?.country?.value === 'Eesti'
      )
    })

    const mapLatitude = computed(() => {
      return (
        state.file?.locality?.latitude ||
        state.file?.specimen?.locality?.latitude ||
        state.file?.image_latitude
      )
    })
    const mapLongitude = computed(() => {
      return (
        state.file?.locality?.longitude ||
        state.file?.specimen?.locality?.longitude ||
        state.file?.image_longitude
      )
    })

    const mapLocalityText = computed(() => {
      return $translate({
        et:
          state.file?.locality?.locality ||
          state.file?.specimen?.locality?.locality ||
          state.file?.image_place ||
          state.file?.description,
        en:
          state.file?.locality?.locality_en ||
          state.file?.specimen?.locality?.locality_en ||
          state.file?.image_place ||
          state.file?.description_en,
      })
    })

    const specimen = computed(() => state.file?.specimen)
    const imageset = computed(() => state.file?.imageset)
    const locality = computed(
      () => state.file?.locality ?? state.file?.specimen?.locality
    )
    const type = computed(() => state.file?.type)
    const agentDigitised = computed(() => state.file?.agent_digitised)
    const database = computed(() => state.file?.database)
    const licence = computed(() => state.file?.licence)

    const { fetchState } = useFetch(async () => {
      const filePromise = $services.sarvREST.getResource(
        'attachment',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 2,
            only_photo_ids: route.value.name?.startsWith('photo'),
          },
        }
      )
      const attachmentKeywordsPromise = $services.sarvREST.getResourceList(
        'attachment_keyword',
        {
          defaultParams: {
            attachment: route.value.params.id,
            nest: 1,
          },
        }
      )

      const [fileResponse, attachmentKeywordsResponse] = await Promise.all([
        filePromise,
        attachmentKeywordsPromise,
      ])

      state.ids = fileResponse?.ids
      state.file = fileResponse
      state.attachmentKeywords = attachmentKeywordsResponse.items

      if (state.file?.specimen) {
        const specimenIdentificationPromise =
          $services.sarvREST.getResourceList('specimen_identification', {
            defaultParams: {
              current: true,
              specimen: state.file.specimen?.id,
              nest: 1,
            },
          })
        const specimenIdentificationGeologyPromise =
          $services.sarvREST.getResourceList(
            'specimen_identification_geology',
            {
              defaultParams: {
                current: true,
                specimen: state.file.specimen?.id,
                nest: 1,
              },
            }
          )
        const [
          specimenIdentificationResponse,
          specimenIdentificationGeologyResponse,
        ] = await Promise.all([
          specimenIdentificationPromise,
          specimenIdentificationGeologyPromise,
        ])
        state.specimenIdentification = specimenIdentificationResponse.items
        state.specimenIdentificationGeology =
          specimenIdentificationGeologyResponse.items
      }
    })

    const title = computed(() => {
      if (!state.file) return ''
      switch (state.file.specimen_image_attachment) {
        case 1:
          return `${state.file?.specimen?.coll?.number?.split(' ')?.[0]} ${
            state.file?.specimen?.specimen_id
          } (ID: ${state.file?.specimen.id})`
        case 2:
          return state.file?.image_number
        case 4:
          return state.file?.reference?.reference
        default:
          return `${
            $translate({
              et: state.file?.description,
              en: state.file?.description_en,
            }) ?? state.file?.id
          }`
      }
    })
    useRedirectInvalidTabRoute({
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'file'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })
    const pageType = computed(() => {
      if (!state.file) return ''
      switch (state.file.specimen_image_attachment) {
        case 1:
          return i18n.t('file.specimenTitle')
        case 2:
          return i18n.t('file.imageTitle')
        case 4:
          return i18n.t('file.referenceTitle')
        default:
          return i18n.t('file.fileTitle')
      }
    })
    const pageTitle = computed(() => `${title.value} | ${pageType.value}`)

    useMeta(() => {
      return {
        title: pageTitle.value,
        meta: [
          {
            property: 'og:title',
            hid: 'og:title',
            content: pageTitle.value,
          },
          {
            property: 'og:url',
            hid: 'og:url',
            content: route.value.path,
          },
          ...[
            {
              property: 'og:image',
              hid: 'og:image',
              content: isImage.value
                ? $img(
                    `${state.file.filename}`,
                    { size: 'small' },
                    {
                      provider: 'geocollections',
                    }
                  )
                : '',
            },
            {
              property: 'og:video',
              hid: 'og:video',
              content: isVideo.value
                ? `https://files.geocollections.info/${state.file.uuid_filename}`
                : '',
            },
            {
              property: 'og:audio',
              hid: 'og:audio',
              content: isAudio.value
                ? `https://files.geocollections.info/${state.file.uuid_filename}`
                : '',
            },
          ],
        ],
      }
    })
    return {
      ...toRefs(state),
      licence,
      database,
      agentDigitised,
      type,
      locality,
      imageset,
      specimen,
      mapLocalityText,
      mapLongitude,
      mapLatitude,
      mapIsEstonian,
      showMap,
      imageSizes,
      isVideo,
      isAudio,
      isImage,
      icons,
      imageSize,
      pageTitle,
      isNull,
      isNil,
      isEmpty,
    }
  },
  head: {},
})
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
