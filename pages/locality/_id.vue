<template>
  <detail>
    <template #title>
      <prev-next-nav-title
        :ids="ids"
        :title="$translate({ et: locality.locality, en: locality.locality_en })"
      />
    </template>

    <template #column-left>
      <v-card-title>{{ $t('common.general') }}</v-card-title>
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
                :title="$t('locality.type')"
                :value="
                  $translate({
                    et: locality.type__value,
                    en: locality.type__value_en,
                  })
                "
              />
              <data-row
                :title="$t('locality.country')"
                :value="
                  $translate({
                    et: locality.country__value,
                    en: locality.country__value_en,
                  })
                "
              />
              <data-row
                :title="$t('locality.parish')"
                :value="
                  $translate({
                    et: locality.vald__vald,
                    en: locality.vald__vald_en,
                  })
                "
              />
              <data-row
                :title="$t('locality.settlement')"
                :value="
                  $translate({
                    et: locality.asustusyksus__asustusyksus,
                    en: locality.asustusyksus__asustusyksus_en,
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
                :title="$t('locality.coordinatePrecision')"
                :value="locality.coord_det_precision__value"
              />
              <data-row
                :title="$t('locality.coordinateMethod')"
                :value="
                  $translate({
                    et: locality.coord_det_method__value,
                    en: locality.coord_det_method__value_en,
                  })
                "
              />
              <data-row
                :title="$t('locality.coordinateAgent')"
                :value="locality.coord_det_agent__agent"
              />
              <data-row
                :title="$t('locality.locationRemarks')"
                :value="locality.remarks_location"
              />
              <link-data-row
                :title="$t('locality.stratigraphyTop')"
                :value="
                  $translate({
                    et: locality.stratigraphy_top__stratigraphy,
                    en: locality.stratigraphy_top__stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: locality.stratigraphy_top_id },
                  })
                "
              />
              <link-data-row
                :title="$t('locality.stratigraphyBase')"
                :value="
                  $translate({
                    et: locality.stratigraphy_base__stratigraphy,
                    en: locality.stratigraphy_base__stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: locality.stratigraphy_base_id },
                  })
                "
              />
              <link-data-row
                v-if="drillcore"
                nuxt
                :title="$t('locality.drillcore')"
                :value="
                  $translate({
                    et: drillcore.drillcore,
                    en: drillcore.drillcore_en,
                  })
                "
                :href="
                  localePath({
                    name: 'drillcore-id',
                    params: { id: drillcore.id },
                  })
                "
              />
              <data-row
                :title="$t('locality.remarks')"
                :value="locality.remarks"
              />
              <data-row :title="$t('locality.id')" :value="locality.id" />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
    <template v-if="locality.latitude && locality.longitude" #column-right>
      <v-card-title>{{ $t('locality.map') }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0" height="600">
          <leaflet-map
            :is-estonian="locality.country__value === 'Eesti'"
            :height="600"
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
      <v-card
        v-if="images.length > 0"
        class="mt-6 mx-4 d-flex align-center"
        style="overflow-x: auto"
        flat
      >
        <div v-for="(item, index) in images" :key="index" class="mx-3 mb-3">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-hover v-slot="{ hover }">
                <v-img
                  v-bind="attrs"
                  :src="`https://files.geocollections.info/small/${item.uuid_filename}`"
                  :lazy-src="`https://files.geocollections.info/small/${item.uuid_filename}`"
                  max-width="200"
                  max-height="200"
                  width="200"
                  height="200"
                  :class="{
                    'elevation-4': hover,
                    'elevation-2': !hover,
                  }"
                  class="grey lighten-2 rounded transition-swing cursor-pointer"
                  v-on="on"
                  @click="
                    $router.push(
                      localePath({
                        name: 'file-id',
                        params: { id: item.attachment_id },
                      })
                    )
                  "
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-hover>
            </template>

            <div
              v-if="item.agent || item.date_created || item.date_created_free"
            >
              <div v-if="item.agent">
                <span class="font-weight-bold"
                  >{{ $t('locality.author') }}:
                </span>
                <span>{{ item.agent }}</span>
              </div>
              <div v-if="item.date_created || item.date_created_free">
                <span class="font-weight-bold"
                  >{{ $t('locality.date') }}:
                </span>
                <span v-if="item.date_created">
                  {{ new Date(item.date_created).toISOString().split('T')[0] }}
                </span>
                <span v-else>{{ item.date_created_free }}</span>
              </div>
            </div>
            <div v-else>Click to open</div>
          </v-tooltip>
        </div>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-6 mx-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNil, isEmpty } from 'lodash'
import LinkDataRow from '~/components/LinkDataRow'
import DataRow from '~/components/DataRow'
import LeafletMap from '~/components/map/LeafletMap'
import Tabs from '~/components/Tabs'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import Detail from '~/components/templates/Detail.vue'

export default {
  components: {
    PrevNextNavTitle,
    DataRow,
    LinkDataRow,
    LeafletMap,
    Tabs,
    Detail,
  },
  async asyncData({ params, route, app, error, redirect }) {
    try {
      const localityResponse = await app.$services.sarvREST.getResource(
        'locality',
        params.id,
        {
          params: {
            fields:
              'asustusyksus__asustusyksus,asustusyksus__asustusyksus_en,coord_det_agent__agent,coord_det_method__value,coord_det_method__value_en,coord_det_precision__value,coord_system,coordx,coordy,country__iso_code,country__value,country__value_en,date_added,date_changed,depth,eelis,elevation,id,latitude,locality,locality_en,longitude,maaamet_pa_id,maakond__maakond,maakond__maakond_en,number,parent__locality,remarks,remarks_location,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en,stratigraphy_base_free,stratigraphy_base_id,stratigraphy_top__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top_free,stratigraphy_top_id,type__value,type__value_en,user_added,vald__vald,vald__vald_en',
          },
        }
      )
      const ids = localityResponse?.ids
      const locality = localityResponse.results[0]

      const drillcoreResponse = await app.$services.sarvREST.getResourceList(
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

      // const attachmentOutcropResponse = await app.$services.sarvSolr.getResourceList(
      //   'attachment',
      //   {
      //     defaultParams: {
      //       fq: `locality_id:${locality.id} AND locality_type:[3 TO 5] AND specimen_image_attachment:2`,
      //       sort: 'date_created desc,date_created_free desc,stars desc,id desc',
      //     },
      //   }
      // )
      //
      // const attachmentsOutcrop = attachmentOutcropResponse.items ?? []

      const attachmentResponse = await app.$services.sarvSolr.getResourceList(
        'attachment',
        {
          defaultParams: {
            fq: `locality_id:${locality.id} AND specimen_image_attachment:2`,
            sort: 'date_created desc,date_created_free desc,stars desc,id desc',
          },
        }
      )

      const attachments = attachmentResponse.items ?? []

      const tabs = [
        {
          id: 'locality_reference',
          routeName: 'locality-id',
          title: 'locality.references',
          count: 0,
          props: {},
        },
        {
          id: 'locality_description',
          routeName: 'locality-id-descriptions',
          title: 'locality.descriptions',
          count: 0,
          props: {},
        },
        {
          id: 'attachment_link',
          routeName: 'locality-id-attachments',
          title: 'locality.attachments',
          count: 0,
          props: {},
        },
        {
          id: 'sample',
          routeName: 'locality-id-samples',
          title: 'locality.samples',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'specimen',
          routeName: 'locality-id-specimens',
          title: 'locality.specimens',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'locality_synonym',
          routeName: 'locality-id-synonyms',
          title: 'locality.synonyms',
          count: 0,
          props: {},
        },
        {
          id: 'stratigraphy_stratotype',
          routeName: 'locality-id-stratotypes',
          title: 'locality.stratotypes',
          count: 0,
          props: {},
        },
      ]

      if (drillcore) {
        tabs.splice(3, 0, {
          routeName: 'locality-id-drillcore_boxes',
          title: 'locality.drillcoreBoxes',
          count: drillcore.boxes,
          props: { drillcore: drillcore.id },
        })
        tabs.join()
      }

      const hydratedTabs = (
        await Promise.all(
          tabs.map(
            async (tab) =>
              await app.$hydrateCount(tab, {
                solr: {
                  default: {
                    fq: `locality_id:${params.id}`,
                  },
                },
                api: { default: { locality_id: locality.id } },
              })
          )
        )
      ).map((tab) =>
        app.$populateProps(tab, {
          ...tab.props,
          locality: locality.id,
        })
      )
      // Find tab that has items
      const initTab = hydratedTabs.find((tab) => tab.count > 0)

      // Constuct route
      const path = initTab
        ? app.localePath({
            name: initTab.routeName,
            params: { id: locality.id },
          })
        : route.path

      if (initTab && path !== route.path) redirect(path)
      return {
        locality,
        ids,
        tabs: hydratedTabs,
        drillcore,
        initActiveTab: path,
        // attachmentsOutcrop,
        attachments,
      }
    } catch (err) {
      error({
        message: `Could not find locality ${params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.locality.locality,
        en: this.locality.locality_en,
      }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },

    images() {
      // return this.attachmentsOutcrop.concat(this.attachments)
      return this.attachments
    },
  },
  methods: {
    isNil,
    isEmpty,
  },
}
</script>
