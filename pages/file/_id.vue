<template>
  <detail>
    <template #title>
      <title-card-detail :ids="ids" :title="fileTitle" class="title-main" />
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
              { size: 'small', height: 700 },
              {
                provider: 'geocollections',
              }
            )
          "
          :src="
            $img(
              `${file.filename}`,
              { size: 'medium', height: 700 },
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
          <v-icon>mdi-file-music-outline</v-icon>
        </audio>

        <!-- Video -->
        <video v-else-if="isVideo" controls>
          <source
            :src="`https://files.geocollections.info/${file.uuid_filename}`"
          />
          Your browser does not support the video element.
          <v-icon>mdi-file-video-outline</v-icon>
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
          <v-icon large color="primary darken-2"
            >mdi-file-download-outline</v-icon
          >
          {{ $t('file.download') }}
        </div>

        <div
          class="
            justify-center
            d-flex
            flex-column
            justify-md-space-between
            flex-md-row
          "
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
                  >mdi-file-download-outline</v-icon
                >
              </a>
              <span v-if="index < imageSizes.length - 1">| </span>
            </span>
          </div>
        </div>
      </v-card-text>
    </template>

    <template #column-right>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <link-data-row
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
              <link-data-row
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
                <link-data-row
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
                <link-data-row
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
              <link-data-row
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
              <link-data-row
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
              <data-row
                :title="$t('file.scalebar')"
                :value="file.image_scalebar"
              />
              <data-row
                :title="$t('file.description')"
                :value="
                  $translate({
                    et: file.description,
                    en: file.description_en,
                  })
                "
              />
              <data-row
                :title="$t('file.imageNumber')"
                :value="file.image_number"
              />
              <data-row
                v-if="imageset"
                :title="$t('file.imagesetNumber')"
                :value="imageset.imageset_number"
              />
              <data-row
                v-if="imageset"
                :title="$t('file.imagesetDescription')"
                :value="imageset.description"
              />
              <data-row :title="$t('file.author')" :value="file.author" />
              <data-row :title="$t('file.author')" :value="file.author_free" />
              <data-row
                :title="$t('file.imagePeople')"
                :value="file.image_people"
              />
              <data-row
                :title="$t('file.date')"
                :value="file.date_created || file.date_created_free"
              />
              <data-row
                :title="$t('file.imagePlace')"
                :value="file.image_place"
              />
              <link-data-row
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
              <data-row
                :title="$t('file.imageLatitude')"
                :value="file.image_latitude"
              />
              <data-row
                :title="$t('file.imageLongitude')"
                :value="file.image_longitude"
              />
              <data-row
                v-if="type"
                :title="$t('file.type')"
                :value="
                  $translate({
                    et: type.value,
                    en: type.value_en,
                  })
                "
              />
              <data-row
                :title="$t('file.format')"
                :value="file.attachment_format"
              />
              <data-row
                v-if="attachmentKeywords.length > 0"
                :title="$t('file.keywords')"
                :value="attachmentKeywords"
              >
                <template #value>
                  <ul v-for="(item, index) in attachmentKeywords" :key="index">
                    <li v-if="item.keyword">{{ item.keyword.keyword }}</li>
                  </ul>
                </template>
              </data-row>
              <data-row
                v-if="agent_digitised"
                :title="$t('file.personDigitised')"
                :value="agent_digitised.agent"
              />
              <data-row
                :title="$t('file.dateDigitised')"
                :value="file.date_digitised || file.date_digitised_free"
              />
              <data-row :title="$t('file.imageSize')" :value="imageSize" />
              <link-data-row
                v-if="database"
                :title="$t('file.institution')"
                :value="
                  $translate({
                    et: database.name,
                    en: database.name_en,
                  })
                "
                @link-click="
                  $openWindow(
                    `https://geocollections.info/${file.database.acronym.toLowerCase()}`
                  )
                "
              />
              <link-data-row
                v-if="licence"
                :title="$t('file.licence')"
                :value="licence.licence_en"
                @link-click="$openWindow(licence.licence_url_en)"
              />
              <data-row :title="$t('file.remarks')" :value="file.remarks" />
              <data-row
                v-if="file.date_added"
                :title="$t('file.dateAdded')"
                :value="$formatDate(file.date_added)"
              />
              <data-row
                v-if="file.date_changed"
                :title="$t('file.dateChanged')"
                :value="$formatDate(file.date_changed)"
              />
            </tbody>
          </template>
        </v-simple-table>

        <v-card v-if="showMap" id="map-wrap" elevation="0">
          <v-card-title class="pl-0 subsection-title">{{
            $t('locality.map')
          }}</v-card-title>
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
      <v-row v-if="filteredTabs.length > 0" class="mt-2">
        <v-col
          v-for="(item, index) in filteredTabs"
          :key="index"
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title class="subsection-title">{{
              $t(item.title)
            }}</v-card-title>

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
                                name: `${item.route ? item.route : item.id}-id`,
                                params: { id: row[item.id].id },
                              })
                            "
                            >{{ row[item.id].id }}</nuxt-link
                          >
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
                            <v-icon small color="primary darken-2"
                              >mdi-open-in-new</v-icon
                            ></a
                          >
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
      </v-row>
    </template>
  </detail>
</template>

<script>
import { isNull, isNil } from 'lodash'
import TitleCardDetail from '@/components/TitleCardDetail'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import LeafletMap from '~/components/map/LeafletMap'
import Detail from '~/components/templates/Detail'
export default {
  components: {
    TitleCardDetail,
    LeafletMap,
    DataRow,
    LinkDataRow,
    Detail,
  },
  async asyncData({ params, route, error, app }) {
    try {
      const fileResponse = await app.$services.sarvREST.getResource(
        'attachment',
        params.id,
        {
          params: {
            nest: 2,
            only_photo_ids: route.name.startsWith('photo'),
          },
        }
      )
      const ids = fileResponse?.ids
      const file = fileResponse
      let specimenIdentification
      let specimenIdentificationGeology
      if (file.specimen) {
        const specimenIdentificationResponse =
          await app.$services.sarvREST.getResourceList(
            'specimen_identification',
            {
              isValid: isNil(file.id),
              defaultParams: {
                current: true,
                specimen: file.specimen.id,
                nest: 1,
              },
            }
          )
        specimenIdentification = specimenIdentificationResponse.items
        const specimenIdentificationGeologyResponse =
          await app.$services.sarvREST.getResourceList(
            'specimen_identification_geology',
            {
              isValid: isNil(file.id),
              defaultParams: {
                current: true,
                specimen: file.specimen.id,
                nest: 1,
              },
            }
          )
        specimenIdentificationGeology =
          specimenIdentificationGeologyResponse.items
      }
      const attachmentKeywordsResponse =
        await app.$services.sarvREST.getResourceList('attachment_keyword', {
          isValid: isNil(file.id),
          defaultParams: {
            attachment: file.id,
            nest: 1,
          },
        })
      const attachmentKeywords = attachmentKeywordsResponse.items

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

      const forLoop = async () => {
        for (const tab of tabs) {
          const response = await app.$services.sarvREST.getResourceList(
            'attachment_link',
            {
              isValid: isNil(file.id),
              defaultParams: {
                [`${tab.id}__isnull`]: false,
                attachment: file.id,
                nest: ['specimen', 'analysis'].includes(tab.id) ? 2 : 1,
              },
            }
          )
          tab.count = response.count || 0
          tab.items = response.items || []
        }
      }
      await forLoop()

      return {
        file,
        specimenIdentification,
        specimenIdentificationGeology,
        attachmentKeywords,
        tabs,
        ids,
      }
    } catch (err) {
      error({
        message: `Cannot find file ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
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
      },
    }
  },
  head() {
    return {
      title: this.fileTitle,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.fileTitle,
        },
      ],
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },

    fileTitle() {
      switch (this.file?.specimen_image_attachment) {
        case 1:
          return `${this.$t('file.specimenTitle')}: ${
            this.file?.specimen?.coll?.number
          }-${this.file?.specimen?.specimen_id?.split('-')?.[1]} (ID: ${
            this.file.specimen.id
          })`
        case 2:
          return `${this.$t('file.imageTitle')}: ${this.file.image_number}`
        case 4:
          return `${this.$t('file.referenceTitle')}: ${
            this.file?.reference?.reference
          }`
        default:
          return `${this.$t('file.fileTitle')}: ${this.$translate({
            et: this?.file?.description,
            en: this?.file?.description_en,
          })}`
      }
    },

    imageSize() {
      if (this.file.image_width && this.file.image_height) {
        return `${this.file.image_width} × ${this.file.image_height} px`
      } else return null
    },

    isImage() {
      return this.file?.attachment_format.includes('image')
    },

    isAudio() {
      return this.file?.attachment_format?.includes('audio')
    },

    isVideo() {
      return this.file?.attachment_format?.includes('video')
    },

    imageSizes() {
      let sizes = ['small', 'medium', 'large', 'original']
      if (!this.isImage) sizes = ['original']
      return sizes
    },

    showMap() {
      return (
        (this.file?.locality?.latitude && this.file?.locality?.longitude) ||
        (this.file.image_latitude && this.file.image_longitude) ||
        (this.file?.specimen?.locality?.latitude &&
          this.file?.specimen?.locality?.longitude)
      )
    },

    mapIsEstonian() {
      return (
        this.file?.locality?.country?.value === 'Eesti' ||
        this.file?.specimen?.locality?.country?.value === 'Eesti'
      )
    },

    mapLatitude() {
      return (
        this.file?.locality?.latitude ||
        this.file?.specimen?.locality?.latitude ||
        this.file.image_latitude
      )
    },

    mapLongitude() {
      return (
        this.file?.locality?.longitude ||
        this.file?.specimen?.locality?.longitude ||
        this.file.image_longitude
      )
    },

    mapLocality() {
      return (
        this.file?.locality?.locality ||
        this.file?.specimen?.locality?.locality ||
        this.file.image_place ||
        this.file.description
      )
    },

    mapLocalityEn() {
      return (
        this.file?.locality?.locality_en ||
        this.file?.specimen?.locality?.locality_en ||
        this.file.image_place ||
        this.file.description_en
      )
    },

    specimen() {
      return this?.file?.specimen
    },

    imageset() {
      return this?.file?.imageset
    },

    locality() {
      return this?.file?.locality
    },

    type() {
      return this?.file?.type
    },

    agent_digitised() {
      return this?.file?.agent_digitised
    },

    database() {
      return this?.file?.database
    },

    licence() {
      return this?.file?.licence
    },
  },
  methods: {
    isNull,
    isNil,
    buildData(type, data) {
      if (type === 'specimen')
        return `${data[type].coll.number.split(' ')[0]} ${
          data[type].specimen_id
        }`
      if (type === 'analysis') return data[type].sample.number
      else {
        return this.$translate({
          et: data[type][this.nameFields[type].et],
          en: data[type][this.nameFields[type].en],
        })
      }
    },
  },
}
</script>

<style scoped>
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
