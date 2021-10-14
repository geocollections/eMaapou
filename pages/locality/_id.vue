<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="$translate({ et: locality.locality, en: locality.locality_en })"
        class="title-locality"
      />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row
                :title="$t('locality.name')"
                :value="
                  $translate({
                    et: locality.locality,
                    en: locality.locality_en,
                  })
                "
              />
              <data-row
                v-if="type"
                :title="$t('locality.type')"
                :value="
                  $translate({
                    et: type.value,
                    en: type.value_en,
                  })
                "
              />
              <data-row
                v-if="country"
                :title="$t('locality.country')"
                :value="
                  $translate({
                    et: country.value,
                    en: country.value_en,
                  })
                "
              />
              <data-row
                v-if="vald"
                :title="$t('locality.parish')"
                :value="
                  $translate({
                    et: vald.vald,
                    en: vald.vald_en,
                  })
                "
              />
              <data-row
                v-if="asustusyksus"
                :title="$t('locality.settlement')"
                :value="
                  $translate({
                    et: asustusyksus.asustusyksus,
                    en: asustusyksus.asustusyksus_en,
                  })
                "
              />
              <data-row
                :title="$t('locality.elevation')"
                :value="locality.elevation"
              />
              <data-row
                :title="$t('locality.latitude')"
                :value="locality.latitude"
              />
              <data-row
                :title="$t('locality.longitude')"
                :value="locality.longitude"
              />
              <data-row
                :title="$t('locality.coordinateSystem')"
                :value="locality.coord_system"
              />
              <data-row
                :title="$t('locality.coordinateX')"
                :value="locality.coordx"
              />
              <data-row
                :title="$t('locality.coordinateY')"
                :value="locality.coordy"
              />
              <data-row
                v-if="coord_det_precision"
                :title="$t('locality.coordinatePrecision')"
                :value="coord_det_precision.value"
              />
              <data-row
                v-if="coord_det_method"
                :title="$t('locality.coordinateMethod')"
                :value="
                  $translate({
                    et: coord_det_method.value,
                    en: coord_det_method.value_en,
                  })
                "
              />
              <data-row
                v-if="coord_det_agent"
                :title="$t('locality.coordinateAgent')"
                :value="coord_det_agent.agent"
              />
              <data-row
                :title="$t('locality.locationRemarks')"
                :value="locality.remarks_location"
              />
              <link-data-row
                v-if="stratigraphy_top"
                :title="$t('locality.stratigraphyTop')"
                :value="
                  $translate({
                    et: stratigraphy_top.stratigraphy,
                    en: stratigraphy_top.stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: locality.stratigraphy_top.id },
                  })
                "
              />
              <link-data-row
                v-if="stratigraphy_base"
                :title="$t('locality.stratigraphyBase')"
                :value="
                  $translate({
                    et: stratigraphy_base.stratigraphy,
                    en: stratigraphy_base.stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: locality.stratigraphy_base.id },
                  })
                "
              />

              <!-- NOTE: #466 added same link as a button -->
              <!--              <link-data-row-->
              <!--                v-if="drillcore"-->
              <!--                nuxt-->
              <!--                :title="$t('locality.drillcore')"-->
              <!--                :value="-->
              <!--                  $translate({-->
              <!--                    et: drillcore.drillcore,-->
              <!--                    en: drillcore.drillcore_en,-->
              <!--                  })-->
              <!--                "-->
              <!--                :href="-->
              <!--                  localePath({-->
              <!--                    name: 'drillcore-id',-->
              <!--                    params: { id: drillcore.id },-->
              <!--                  })-->
              <!--                "-->
              <!--              />-->

              <data-row
                v-if="locality.date_added"
                :title="$t('locality.dateAdded')"
                :value="$formatDate(locality.date_added)"
              />
              <data-row
                v-if="locality.date_changed"
                :title="$t('locality.dateChanged')"
                :value="$formatDate(locality.date_changed)"
              />
              <data-row
                :title="$t('locality.remarks')"
                :value="locality.remarks"
              />
            </tbody>
          </template>
        </v-simple-table>

        <v-btn
          v-if="analysisResultsCount > 0"
          small
          color="emp-analysis montserrat"
          class="mt-2 white--text"
          @click="goToAnalyticalData"
          >{{ $t('locality.linkToAnalyticalData') }}
          <v-icon right>mdi-chart-scatter-plot</v-icon>
        </v-btn>

        <v-btn
          v-if="drillcore"
          small
          color="emp-drillcore  montserrat"
          class="mt-2 white--text"
          @click="
            $router.push(
              localePath({
                name: 'drillcore-id',
                params: { id: drillcore.id },
              })
            )
          "
          >{{
            $translate({
              et: drillcore.drillcore,
              en: drillcore.drillcore_en,
            })
          }}
          <v-icon right>mdi-screw-machine-flat-top</v-icon>
        </v-btn>
      </v-card-text>
    </template>
    <template v-if="locality.latitude && locality.longitude" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <leaflet-map
            rounded
            :estonian-map="country ? country.value === 'Eesti' : false"
            :estonian-bedrock-overlay="
              country ? country.value === 'Eesti' : false
            "
            locality-overlay
            :center="{
              latitude: locality.latitude,
              longitude: locality.longitude,
            }"
            :markers="[
              {
                latitude: locality.latitude,
                longitude: locality.longitude,
                text: $translate({
                  et: locality.locality,
                  en: locality.locality_en,
                }),
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <image-bar v-if="images.length > 0" class="mt-4" :images="images" />
      <v-card
        v-if="filteredTabs.length > 0 && !$fetchState.pending"
        class="mt-4 mb-4"
      >
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNil, isEmpty } from 'lodash'
import { mapFields } from 'vuex-map-fields'
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import DataRow from '~/components/DataRow.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import Tabs from '~/components/Tabs.vue'
import Detail from '~/components/templates/Detail.vue'
import ImageBar from '~/components/ImageBar.vue'
import { TABS_LOCALITY } from '~/constants'

export default {
  components: {
    TitleCardDetail,
    DataRow,
    LinkDataRow,
    LeafletMap,
    Tabs,
    Detail,
    ImageBar,
  },
  async asyncData({ params, route, error, $services }) {
    try {
      const localityResponse = await $services.sarvREST.getResource(
        'locality',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = localityResponse?.ids
      const locality = localityResponse

      const drillcoreResponse = await $services.sarvREST.getResourceList(
        'drillcore',
        {
          defaultParams: {
            locality: locality.id,
          },
        }
      )

      const drillcore = drillcoreResponse.items
        ? drillcoreResponse.items[0]
        : null

      return {
        locality,
        ids,
        drillcore,
      }
    } catch (err) {
      error({
        message: `Could not find locality ${params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      tabs: [],
      initActiveTab: '',
      attachments: [],
    }
  },
  async fetch() {
    const attachmentResponse = await this.$services.sarvSolr.getResourceList(
      'attachment',
      {
        defaultParams: {
          fq: `locality_id:${this.locality?.id} AND specimen_image_attachment:2`,
          sort: 'date_created_dt desc,date_created_free desc,stars desc,id desc',
        },
      }
    )

    this.attachments = attachmentResponse?.items ?? []

    // Checking if locality has a related .las file to show in graph tab
    const lasFileResponse = await this.$services.sarvREST.getResourceList(
      'attachment_link',
      {
        defaultParams: {
          attachment__uuid_filename__iendswith: '.las',
          locality: this.locality?.id,
          fields: 'attachment',
        },
      }
    )

    // Todo: Add taxa tab?
    const tabsObject = TABS_LOCALITY

    tabsObject.byIds.boxes.count = this.drillcore?.boxes || 0
    tabsObject.byIds.boxes.props.drillcore = this.drillcore
      ? this.drillcore.id
      : null

    tabsObject.byIds.analysis_results.props = {
      localityObject: this.locality,
      attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
    }

    const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

    let hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            props: {
              locality: this.locality.id,
            },
            countParams: {
              solr: {
                default: {
                  fq:
                    tab.id === 'graphs'
                      ? `locality_id:${this.$route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`
                      : `locality_id:${this.$route.params.id}`,
                },
              },
              api: { default: { locality: this.locality.id } },
            },
          })
      )
    )
    // Hack for graphs to show tab if related .las file exists (otherwise tab is shown but is disabled)
    hydratedTabs = hydratedTabs.map((item) => {
      if (item.id === 'graphs') {
        // Todo: Also add taxa check
        const localityDescriptionCount = hydratedTabs.find(
          (item) => item.id === 'locality_description'
        ).count
        const sampleCount = hydratedTabs.find(
          (item) => item.id === 'sample'
        ).count

        const combinedCount =
          item.count + localityDescriptionCount + sampleCount

        const count = lasFileResponse?.items?.[0]?.attachment
          ? combinedCount + 1
          : combinedCount

        return {
          ...item,
          count,
          props: {
            ...item.props,
            analysisResultsCount: item.count,
            localityDescriptionCount,
            sampleCount,
          },
        }
      } else return item
    })

    const slugRoute = this.$createSlugRoute(
      this.$route,
      this.$translate({
        et: this.locality.locality,
        en: this.locality.locality_en,
      })
    )

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: this.$translate({
        et: this.locality.locality,
        en: this.locality.locality_en,
      }),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$translate({
            et: this.locality.locality,
            en: this.locality.locality_en,
          }),
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
        {
          property: 'og:image',
          hid: 'og:image',
          content: this.images[0]?.filename
            ? this.$img(
                `${this.images[0]?.filename}`,
                { size: 'small' },
                {
                  provider: 'geocollections',
                }
              )
            : undefined,
        },
      ],
    }
  },
  computed: {
    ...mapFields('analyticalData', {
      analyticalDataLocality: 'filters.byIds.locality.value',
    }),
    filteredTabs() {
      return this.tabs.filter((item) => {
        if (item.id === 'graphs') {
          // Todo: also add taxa check
          return (
            item.props.attachment ||
            item.props.analysisResultsCount > 0 ||
            item.props.sampleCount > 0 ||
            item.props.localityDescriptionCount > 0
          )
        } else return item.count > 0
      })
    },

    images() {
      // return this.attachmentsOutcrop.concat(this.attachments)
      return this.attachments
    },

    analysisResultsCount() {
      return this.tabs?.find((tab) => tab.id === 'graphs')?.count
    },
    type() {
      return this.locality?.type
    },
    country() {
      return this.locality?.country
    },
    vald() {
      return this.locality?.vald
    },
    asustusyksus() {
      return this.locality?.asustusyksus
    },
    coord_det_precision() {
      return this.locality?.coord_det_precision
    },
    coord_det_method() {
      return this.locality?.coord_det_method
    },
    coord_det_agent() {
      return this.locality?.coord_det_agent
    },
    stratigraphy_top() {
      return this.locality?.stratigraphy_top
    },
    stratigraphy_base() {
      return this.locality?.stratigraphy_base
    },
  },
  methods: {
    isNil,
    isEmpty,

    goToAnalyticalData() {
      this.analyticalDataLocality = this.$translate({
        et: this.locality.locality,
        en: this.locality.locality_en,
      })
      this.$router.push(this.localePath({ name: 'analytical-data' }))
    },
  },
}
</script>
