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
            :title="$t('file.collectionNr')"
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
            :title="$t('file.specimenNr')"
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
              :title="$t('file.name')"
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
              :title="$t('file.name')"
              :value="item.taxon.taxon"
              :suffix="item.name ? `| ${item.name}` : ''"
              @link-click="
                $openWindow(`https://fossiilid.info/${item.taxon.id}`)
              "
            />
          </template>
          <table-row-link
            v-if="specimen && specimen.locality"
            :title="$t('file.locality')"
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
            :title="$t('file.stratigraphy')"
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
            :title="$t('file.scalebar')"
            :value="file.image_scalebar"
          />
          <table-row
            :title="$t('file.description')"
            :value="
              $translate({
                et: file.description,
                en: file.description_en,
              })
            "
          />
          <table-row
            :title="$t('file.imageNumber')"
            :value="file.image_number"
          />
          <table-row
            v-if="imageset"
            :title="$t('file.imagesetNumber')"
            :value="imageset.imageset_number"
          />
          <table-row
            v-if="imageset"
            :title="$t('file.imagesetDescription')"
            :value="imageset.description"
          />
          <table-row :title="$t('file.author')" :value="file.author" />
          <table-row :title="$t('file.author')" :value="file.author_free" />
          <table-row
            :title="$t('file.imagePeople')"
            :value="file.image_people"
          />
          <table-row
            :title="$t('file.date')"
            :value="file.date_created || file.date_created_free"
          />
          <table-row :title="$t('file.imagePlace')" :value="file.image_place" />
          <table-row-link
            v-if="locality"
            :title="$t('file.locality')"
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
            :title="$t('file.imageLatitude')"
            :value="file.image_latitude"
          />
          <table-row
            :title="$t('file.imageLongitude')"
            :value="file.image_longitude"
          />
          <table-row
            v-if="type"
            :title="$t('file.type')"
            :value="
              $translate({
                et: type.value,
                en: type.value_en,
              })
            "
          />
          <table-row
            :title="$t('file.format')"
            :value="file.attachment_format"
          />
          <table-row
            v-if="attachmentKeywords.length > 0"
            :title="$t('file.keywords')"
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
            :title="$t('file.personDigitised')"
            :value="agentDigitised.agent"
          />
          <table-row
            :title="$t('file.dateDigitised')"
            :value="file.date_digitised || file.date_digitised_free"
          />
          <table-row :title="$t('file.imageSize')" :value="imageSize" />
          <table-row-link
            v-if="database"
            :title="$t('file.institution')"
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
            :title="$t('file.licence')"
            :value="licence.licence_en"
            @link-click="$openWindow(licence.licence_url_en)"
          />
          <table-row :title="$t('file.remarks')" :value="file.remarks" />
          <table-row
            v-if="file.date_added"
            :title="$t('file.dateAdded')"
            :value="$formatDate(file.date_added)"
          />
          <table-row
            v-if="file.date_changed"
            :title="$t('file.dateChanged')"
            :value="$formatDate(file.date_changed)"
          />
        </base-table>

        <v-card v-if="showMap" id="map-wrap" elevation="0">
          <v-card-title class="pl-0 subsection-title"
            >{{ $t('locality.map') }}
          </v-card-title>
          <leaflet-map
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
                text: $translate({
                  et: mapLocality,
                  en: mapLocalityEn,
                }),
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-row v-if="tabs.length > 0" class="mt-2">
        <transition-group
          appear
          class="d-flex flex-wrap flex-grow-1"
          name="fade"
        >
          <v-col
            v-for="(item, index) in tabs"
            :key="`${item.title}-${index}`"
            cols="12"
            md="6"
          >
            <v-card>
              <v-card-title class="subsection-title"
                >{{ $t(item.title) }}
              </v-card-title>

              <v-card-text>
                <v-simple-table>
                  <template #default>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{{ $t(`${item.id}.${item.id}`) }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, key) in item.items" :key="key">
                        <td>
                          <template v-if="item.isLink">
                            <nuxt-link
                              v-if="item.isNuxtLink"
                              class="text-link"
                              :to="
                                localePath({
                                  name: `${
                                    item.route ? item.route : item.id
                                  }-id`,
                                  params: { id: row[item.id].id },
                                })
                              "
                              >{{ row[item.id].id }}
                            </nuxt-link>
                            <a
                              v-else
                              class="text-link"
                              @click="
                                $openWindow(
                                  `${item.href}${
                                    item.id === 'doi'
                                      ? row.doi.identifier
                                      : row[item.id].id
                                  }`
                                )
                              "
                              >{{
                                item.id === 'doi'
                                  ? row.doi.identifier
                                  : row[item.id].id
                              }}
                              <v-icon small color="primary darken-2">
                                {{ icons.mdiOpenInNew }}
                              </v-icon>
                            </a>
                          </template>
                          <template v-else>
                            {{ row[item.id].id }}
                          </template>
                        </td>
                        <td>{{ buildData(item.id, row) }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </transition-group>
      </v-row>

      <v-row v-if="fileContent" class="mt-2">
        <v-col cols="12">
          <v-card>
            <v-card-title class="subsection-title">{{
              $t('file.fileContents')
            }}</v-card-title>

            <v-card-text>
              <v-expansion-panels v-model="expansionPanel" multiple>
                <v-expansion-panel
                  v-if="rawFileContent && file.uuid_filename.endsWith('.las')"
                >
                  <v-expansion-panel-header>{{
                    $t('file.lasGraph')
                  }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <las-chart
                      :chart-title="pageTitle"
                      :file-data="rawFileContent"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel
                  v-else-if="
                    rawFileContent && file.uuid_filename.endsWith('.txt')
                  "
                >
                  <v-expansion-panel-header>{{
                    $t('file.textTable')
                  }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-data-table
                      :headers="rawFileContent.headers"
                      :items="rawFileContent.items"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header>
                    {{ $t('file.lasText') }}</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <pre>
                {{ fileContent }}
              </pre
                    >
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </detail>
</template>

<script lang="ts">
import {
  mdiFileMusicOutline,
  mdiFileVideoOutline,
  mdiFileDownloadOutline,
  mdiOpenInNew,
} from '@mdi/js'
import isNil from 'lodash/isNil'
import isNull from 'lodash/isNull'
import {
  computed,
  defineComponent,
  reactive,
  toRef,
  toRefs,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import HeaderDetail from '~/components/HeaderDetail.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import Detail from '~/templates/Detail.vue'
import LasChart from '~/components/chart/types/LasChart.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: {
    LasChart,
    HeaderDetail,
    LeafletMap,
    TableRow,
    TableRowLink,
    Detail,
    BaseTable,
  },
  setup() {
    const { $services, $translate, i18n } = useContext()
    const route = useRoute()
    const state = reactive({
      expansionPanel: [1] as number[],
      nameFields: {
        collection: {
          et: 'collection_name',
          en: 'collection_name_en',
        },
        specimen: {
          et: 'number',
          en: 'number',
        },
        sample: {
          et: 'number',
          en: 'number',
        },
        sample_series: {
          et: 'name',
          en: 'name',
        },
        analysis: {
          et: 'number',
          en: 'number',
        },
        dataset: {
          et: 'name',
          en: 'name_en',
        },
        doi: {
          et: 'identifier',
          en: 'identifier',
        },
        locality: {
          et: 'locality',
          en: 'locality_en',
        },
        drillcore: {
          et: 'drillcore',
          en: 'drillcore_en',
        },
        drillcore_box: {
          et: 'number',
          en: 'number',
        },
        preparation: {
          et: 'preparation_number',
          en: 'preparation_number',
        },
        reference: {
          et: 'reference',
          en: 'reference',
        },
        storage: {
          et: 'location',
          en: 'location',
        },
        project: {
          et: 'name',
          en: 'name_en',
        },
        site: {
          et: 'name',
          en: 'name_en',
        },
        locality_description: {
          et: 'description',
          en: 'description',
        },
        taxon: {
          et: 'taxon',
          en: 'taxon',
        },
      } as any,
      specimenIdentification: [] as any[],
      specimenIdentificationGeology: [] as any[],
      attachmentKeywords: [] as any[],
      fileContent: '',
      rawFileContent: '',
      file: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as any[],
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
        (state.file?.image_latitude && state?.file.image_longitude) ||
        (state.file?.specimen?.locality?.latitude &&
          state.file?.specimen?.locality?.longitude)
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
    const locality = computed(() => state.file?.locality)
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
      const tabs = [
        {
          id: 'collection',
          title: 'related.collection',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'specimen',
          title: 'related.specimen',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'sample',
          title: 'related.sample',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'sample_series',
          title: 'related.sample_series',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'analysis',
          title: 'related.analysis',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'dataset',
          title: 'related.dataset',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'doi',
          title: 'related.doi',
          count: 0,
          items: [],
          isLink: true,
          href: 'https://doi.geocollections.info/',
        },
        {
          id: 'locality',
          title: 'related.locality',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'drillcore',
          title: 'related.drillcore',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'drillcore_box',
          route: 'drillcore-box',
          title: 'related.drillcore_box',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'preparation',
          title: 'related.preparation',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'reference',
          title: 'related.reference',
          count: 0,
          items: [],
          isLink: true,
          href: 'https://kirjandus.geoloogia.info/reference/',
        },
        {
          id: 'storage',
          title: 'related.storage',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'project',
          title: 'related.project',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'site',
          title: 'related.site',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'locality_description',
          title: 'related.locality_description',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'taxon',
          title: 'related.taxon',
          count: 0,
          items: [],
          isLink: true,
          href: 'https://fossiilid.info/',
        },
      ]
      const hydratedTabsPromise = Promise.all(
        tabs.map((tab) => {
          return $services.sarvREST
            .getResourceList('attachment_link', {
              defaultParams: {
                [`${tab.id}__isnull`]: false,
                attachment: route.value.params.id,
                nest: ['specimen', 'analysis'].includes(tab.id) ? 2 : 1,
              },
            })
            .then((res) => {
              return { ...tab, count: res.count, items: res.items }
            })
        })
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

      const [fileResponse, attachmentKeywordsResponse, hydratedTabs] =
        await Promise.all([
          filePromise,
          attachmentKeywordsPromise,
          hydratedTabsPromise,
        ])

      state.ids = fileResponse?.ids
      state.file = fileResponse
      state.tabs = hydratedTabs.filter((item) => item.count > 0)
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

      if (
        state.file?.uuid_filename?.endsWith('.txt') ||
        state.file?.uuid_filename?.endsWith('.las')
      ) {
        // File content (e.g., .las in json format)
        const fileContentPromise = $services.sarvREST.getResource(
          'file',
          parseInt(route.value.params.id)
        )
        // Raw file content in text format
        const rawFileContentPromise = $services.sarvREST.getResource(
          'file',
          parseInt(route.value.params.id),
          {
            params: {
              raw_content: 'true',
            },
          }
        )
        const [fileContentResponse, rawFileContentResponse] = await Promise.all(
          [fileContentPromise, rawFileContentPromise]
        )

        state.fileContent = fileContentResponse
        if (fileContentResponse.startsWith('Error: ')) state.fileContent = ''
        state.rawFileContent = rawFileContentResponse
        if (
          typeof rawFileContentResponse === 'string' &&
          rawFileContentResponse.startsWith('Error: ')
        )
          state.rawFileContent = ''
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
    useSlugRoute({
      slug: title,
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

    const buildData = (type: string, data: any) => {
      if (type === 'specimen') {
        return `${data[type].coll.number.split(' ')[0]} ${
          data[type].specimen_id
        }`
      }
      if (type === 'analysis') {
        return data[type].sample.number
      } else {
        return $translate({
          et: data[type][state.nameFields[type].et],
          en: data[type][state.nameFields[type].en],
        })
      }
    }
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
      imageSize,
      pageTitle,
      buildData,
    }
  },
  // @ts-ignore
  head() {
    return {
      title: this.pageTitle as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.pageTitle as string,
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
        ...[
          {
            property: 'og:image',
            hid: 'og:image',
            content: this.isImage
              ? this.$img(
                  // @ts-ignore
                  `${this.file.filename}`,
                  { size: 'small' },
                  {
                    provider: 'geocollections',
                  }
                )
              : undefined,
          },
          {
            property: 'og:video',
            hid: 'og:video',
            content: this.isVideo
              ? // @ts-ignore
                `https://files.geocollections.info/${this.file.uuid_filename}`
              : undefined,
          },
          {
            property: 'og:audio',
            hid: 'og:audio',
            content: this.isAudio
              ? // @ts-ignore
                `https://files.geocollections.info/${this.file.uuid_filename}`
              : undefined,
          },
        ],
      ],
    }
  },
  computed: {
    icons() {
      return {
        mdiFileMusicOutline,
        mdiFileVideoOutline,
        mdiFileDownloadOutline,
        mdiOpenInNew,
      }
    },
  },
  methods: {
    isNull,
    isNil,
  },
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
