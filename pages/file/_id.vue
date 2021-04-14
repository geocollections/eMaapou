<template>
  <detail>
    <template #title>
      <prev-next-nav-title :ids="ids" :title="fileTitle" />
    </template>
    <template #column-left>
      <v-card-text class="text-center">
        <!-- Image -->
        <v-img
          v-if="isImage"
          content-class="image-content"
          max-height="700"
          contain
          :lazy-src="`https://files.geocollections.info/small/${file.filename}`"
          :src="`https://files.geocollections.info/medium/${file.filename}`"
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
          class="file-download rounded deep-orange--text"
          @click="
            $openWindow(
              `https://files.geocollections.info/${file.uuid_filename}`
            )
          "
        >
          <v-icon large color="deep-orange darken-2"
            >mdi-file-download-outline</v-icon
          >
          {{ $t('file.download') }}
        </div>

        <div
          class="d-flex justify-center flex-column justify-md-space-between flex-md-row"
          :class="{ 'mt-4': !isImage }"
        >
          <div class="text-center text-md-left">
            <div v-if="file.author__agent || file.author_free">
              <span class="font-weight-bold">{{ $t('file.author') }}: </span>
              <span v-if="file.author__agent">{{ file.author__agent }}</span>
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
                  color="deep-orange darken-2"
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
                :title="$t('file.collectionNr')"
                :value="file.specimen__coll__number"
                nuxt
                :href="
                  localePath({
                    name: 'specimen-id',
                    params: { id: file.specimen },
                  })
                "
              />
              <link-data-row
                :title="$t('file.specimenNr')"
                :value="file.specimen__specimen_id"
                nuxt
                :href="
                  localePath({
                    name: 'specimen-id',
                    params: { id: file.specimen },
                  })
                "
              />
              <template v-for="(item, index) in specimenIdentification">
                <link-data-row
                  :key="index"
                  :title="$t('file.name')"
                  :value="item.taxon__taxon"
                  :suffix="item.name ? `| ${item.name}` : ''"
                  @link-click="
                    $openWindow(`https://fossiilid.info/${item.taxon_id}`)
                  "
                />
              </template>
              <template v-for="(item, index) in specimenIdentificationGeology">
                <link-data-row
                  :key="index"
                  :title="$t('file.name')"
                  :value="item.taxon__taxon"
                  :suffix="item.name ? `| ${item.name}` : ''"
                  @link-click="
                    $openWindow(`https://fossiilid.info/${item.taxon_id}`)
                  "
                />
              </template>
              <link-data-row
                :title="$t('file.locality')"
                :value="
                  $translate({
                    et: file.specimen__locality__locality,
                    en: file.specimen__locality__locality_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'locality-id',
                    params: { id: file.specimen__locality },
                  })
                "
              />
              <link-data-row
                :title="$t('file.stratigraphy')"
                :value="
                  $translate({
                    et: file.specimen__stratigraphy__stratigraphy,
                    en: file.specimen__stratigraphy__stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: file.specimen__stratigraphy },
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
                :title="$t('file.imagesetNumber')"
                :value="file.imageset__imageset_number"
              />
              <data-row
                :title="$t('file.type')"
                :value="
                  $translate({
                    et: file.type__value,
                    en: file.type__value_en,
                  })
                "
              />
              <data-row
                :title="$t('file.format')"
                :value="file.attachment_format__value"
              />
              <data-row
                :title="$t('file.author')"
                :value="file.author__agent"
              />
              <data-row
                :title="$t('file.date')"
                :value="file.date_created || file.date_created_free"
              />
              <data-row
                :title="$t('file.keywords')"
                :value="attachmentKeywords"
              >
                <template #value>
                  <ul v-for="(item, index) in attachmentKeywords" :key="index">
                    <li>{{ item.keyword__keyword }}</li>
                  </ul>
                </template>
              </data-row>
              <data-row
                :title="$t('file.imagePlace')"
                :value="file.image_place"
              />
              <link-data-row
                :title="$t('file.locality')"
                :value="
                  $translate({
                    et: file.locality__locality,
                    en: file.locality__locality_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'locality-id',
                    params: { id: file.locality },
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
                :title="$t('file.personDigitised')"
                :value="file.agent_digitised__agent"
              />
              <data-row
                :title="$t('file.dateDigitised')"
                :value="file.date_digitised || file.date_digitised_free"
              />
              <data-row :title="$t('file.imageSize')" :value="imageSize" />
              <link-data-row
                :title="$t('file.institution')"
                :value="
                  $translate({
                    et: file.database__name,
                    en: file.database__name_en,
                  })
                "
                @link-click="
                  $openWindow(
                    `https://geocollections.info/${file.database__acronym.toLowerCase()}`
                  )
                "
              />
              <link-data-row
                :title="$t('file.licence')"
                :value="file.licence__licence_en"
                @link-click="$openWindow(file.licence__licence_url_en)"
              />
              <data-row
                :title="$t('file.dateAdded')"
                :value="new Date(file.date_added).toISOString().split('T')[0]"
              />
              <data-row
                :title="$t('file.dateChanged')"
                :value="new Date(file.date_changed).toISOString().split('T')[0]"
              />
            </tbody>
          </template>
        </v-simple-table>

        <v-card v-if="showMap" id="map-wrap" elevation="0">
          <v-card-title class="pl-0">{{ $t('locality.map') }}</v-card-title>
          <leaflet-map
            :is-estonian="mapIsEstonian"
            :height="300"
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
      <v-card v-if="filteredTabs.length > 0" flat class="mt-2 mx-4">
        <v-row>
          <v-col
            v-for="(item, index) in filteredTabs"
            :key="index"
            cols="12"
            md="6"
          >
            <v-card>
              <v-card-title>{{ $t(item.title) }}</v-card-title>

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
                                  name: `${item.id}-id`,
                                  params: { id: row[item.id] },
                                })
                              "
                              >{{ row[item.id] }}</nuxt-link
                            >
                            <a
                              v-else-if="item.isGeoLink"
                              class="text-link"
                              @click="$openGeoDetail(item.id, row[item.id])"
                              >{{ row[item.id] }}
                              <v-icon small color="deep-orange darken-2"
                                >mdi-open-in-new</v-icon
                              >
                            </a>
                            <a
                              v-else
                              class="text-link"
                              @click="
                                $openWindow(
                                  `${item.href}${
                                    item.id === 'doi'
                                      ? row.doi__identifier
                                      : row[item.id]
                                  }`
                                )
                              "
                              >{{ row[item.id] }}
                              <v-icon small color="deep-orange darken-2"
                                >mdi-open-in-new</v-icon
                              ></a
                            >
                          </template>
                          <template v-else>
                            {{ row[item.id] }}
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
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNull, isNil } from 'lodash'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import LeafletMap from '~/components/map/LeafletMap'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import Detail from '~/components/templates/Detail'
export default {
  components: {
    PrevNextNavTitle,
    LeafletMap,
    DataRow,
    LinkDataRow,
    Detail,
  },
  async asyncData({ params, route, error, app }) {
    try {
      const fileResponse = await app.$services.sarvREST.getResource(
        'attachment',
        params.id
      )
      const ids = fileResponse?.ids
      const file = fileResponse.results[0]
      let specimenIdentification
      let specimenIdentificationGeology
      if (file.specimen) {
        const specimenIdentificationResponse = await app.$services.sarvREST.getResourceList(
          'specimen_identification',
          {
            isValid: isNil(file.id),
            defaultParams: {
              current: true,
              specimen_id: file.specimen,
            },
          }
        )
        specimenIdentification = specimenIdentificationResponse.items
        const specimenIdentificationGeologyResponse = await app.$services.sarvREST.getResourceList(
          'specimen_identification_geology',
          {
            isValid: isNil(file.id),
            defaultParams: {
              current: true,
              specimen_id: file.specimen,
            },
          }
        )
        specimenIdentificationGeology =
          specimenIdentificationGeologyResponse.items
      }
      const attachmentKeywordsResponse = await app.$services.sarvREST.getResourceList(
        'attachment_keyword',
        {
          isValid: isNil(file.id),
          defaultParams: {
            attachment: file.id,
          },
        }
      )
      const attachmentKeywords = attachmentKeywordsResponse.items

      const tabs = [
        {
          id: 'collection',
          fields: 'collection,collection__name,collection__name_en',
          title: 'related.collection',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'specimen',
          fields: 'specimen,specimen__coll__number,specimen__specimen_id',
          title: 'related.specimen',
          count: 0,
          items: [],
          isLink: true,
          isGeoLink: true,
        },
        {
          id: 'sample',
          fields: 'sample,sample__number',
          title: 'related.sample',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'sample_series',
          fields: 'sample_series,sample_series__name',
          title: 'related.sample_series',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'analysis',
          fields: 'analysis,analysis__sample__number',
          title: 'related.analysis',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'dataset',
          fields: 'dataset,dataset__name,dataset__name_en',
          title: 'related.dataset',
          count: 0,
          items: [],
          isLink: true,
          isGeoLink: true,
        },
        {
          id: 'doi',
          fields: 'doi,doi__identifier',
          title: 'related.doi',
          count: 0,
          items: [],
          isLink: true,
          href: 'https://doi.geocollections.info/',
        },
        {
          id: 'locality',
          fields: 'locality,locality__locality,locality__locality_en',
          title: 'related.locality',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'drillcore',
          fields: 'drillcore,drillcore__drillcore,drillcore__drillcore_en',
          title: 'related.drillcore',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'drillcore_box',
          fields: 'drillcore_box,drillcore_box__number',
          title: 'related.drillcore_box',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'preparation',
          fields: 'preparation,preparation__preparation_number',
          title: 'related.preparation',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'reference',
          fields: 'reference,reference__reference',
          title: 'related.reference',
          count: 0,
          items: [],
          isLink: true,
          href: 'https://kirjandus.geoloogia.info/reference/',
        },
        {
          id: 'storage',
          fields: 'storage,storage__location',
          title: 'related.storage',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'project',
          fields: 'project,project__name,project__name_en',
          title: 'related.project',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'site',
          fields: 'site,site__name,site__name_en',
          title: 'related.site',
          count: 0,
          items: [],
          isLink: true,
          isNuxtLink: true,
        },
        {
          id: 'locality_description',
          fields: 'locality_description,locality_description__description',
          title: 'related.locality_description',
          count: 0,
          items: [],
          isLink: false,
        },
        {
          id: 'taxon',
          fields: 'taxon,taxon__taxon',
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
                fields: tab.fields,
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
  head() {
    return {
      title: this.fileTitle,
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },

    fileTitle() {
      switch (this?.file?.specimen_image_attachment) {
        case 1:
          return `${this.$t('file.specimenTitle')}: ${
            this.file?.specimen__coll__number
          }-${this.file?.specimen__specimen_id?.split('-')?.[1]} (ID: ${
            this.file.specimen
          })`
        case 2:
          return `${this.$t('file.imageTitle')}: ${this.file.image_number}`
        case 4:
          return `${this.$t('file.referenceTitle')}: ${
            this.file.reference__reference
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
      return this.file.attachment_format__value.includes('image')
    },

    isAudio() {
      return this.file.attachment_format__value.includes('audio')
    },

    isVideo() {
      return this.file.attachment_format__value.includes('video')
    },

    imageSizes() {
      let sizes = ['small', 'medium', 'large', 'original']
      if (!this.isImage) sizes = ['original']
      return sizes
    },

    showMap() {
      return (
        (this.file.locality__latitude && this.file.locality__longitude) ||
        (this.file.image_latitude && this.file.image_longitude) ||
        (this.file.specimen__locality__latitude &&
          this.file.specimen__locality__longitude)
      )
    },

    mapIsEstonian() {
      return (
        this.file.locality__country__value === 'Eesti' ||
        this.file.specimen__locality__country__value === 'Eesti'
      )
    },

    mapLatitude() {
      return (
        this.file.locality__latitude ||
        this.file.specimen__locality__latitude ||
        this.file.image_latitude
      )
    },

    mapLongitude() {
      return (
        this.file.locality__longitude ||
        this.file.specimen__locality__longitude ||
        this.file.image_longitude
      )
    },

    mapLocality() {
      return (
        this.file.locality__locality ||
        this.file.specimen__locality__locality ||
        this.file.image_place ||
        this.file.description
      )
    },

    mapLocalityEn() {
      return (
        this.file.locality__locality_en ||
        this.file.specimen__locality__locality_en ||
        this.file.image_place ||
        this.file.description_en
      )
    },
  },
  methods: {
    isNull,
    isNil,
    buildData(type, data) {
      const listOfIds = Object.keys(data)
      listOfIds.splice(listOfIds.indexOf(type), 1)

      if (listOfIds.length === 1) return data[listOfIds[0]]
      else if (listOfIds.length === 2) {
        if (type === 'specimen')
          return `${data[listOfIds[0]].split(' ')[0]} ${data[listOfIds[1]]}`
        else {
          return this.$translate({
            et: data[listOfIds[0]],
            en: data[listOfIds[1]],
          })
        }
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
