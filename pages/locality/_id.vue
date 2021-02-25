<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ $translate({ et: locality.locality, en: locality.locality_en }) }}
      </h1>
      <v-card flat tile>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
              style="max-width: 100%"
              class="pt-0 px-0 flex-grow-1 flex-shrink-0"
            >
              <v-card-title class="pl-md-0 pr-md-4 px-0">{{
                $t('common.general')
              }}</v-card-title>
              <v-card-text class="pl-md-0 pr-md-4 px-0">
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
                        @link-click="
                          $openWindow(
                            `https://geocollections.info/stratigraphy/${locality.stratigraphy_top_id}`
                          )
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
                        @link-click="
                          $openWindow(
                            `https://geocollections.info/stratigraphy/${locality.stratigraphy_base_id}`
                          )
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
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-col>
            <v-col
              v-if="locality.latitude && locality.longitude"
              cols="12"
              md="6"
              class="pt-0 px-0"
            >
              <v-card-title class="pr-md-0 pl-md-4 px-0">{{
                $t('locality.map')
              }}</v-card-title>
              <v-card-text class="pr-md-0 pl-md-4 px-0">
                <v-card id="map-wrap" elevation="0" height="300">
                  <leaflet-map
                    :is-estonian="locality.country__value === 'Eesti'"
                    :height="400"
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
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card class="mt-2 pb-2">
        <tabs :tabs="tabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil, isEmpty } from 'lodash'
import LinkDataRow from '~/components/LinkDataRow'
import DataRow from '~/components/DataRow'
import LeafletMap from '~/components/LeafletMap'
import Tabs from '~/components/Tabs'

export default {
  components: { DataRow, LinkDataRow, LeafletMap, Tabs },
  async asyncData({ params, route, app, error }) {
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

      const solrParams = { fq: `locality_id:${params.id}` }
      const apiParams = { locality_id: locality.id }
      // Hack: fix count in API!!!
      const apiAttachmentLinkParams = {
        locality: locality.id,
      }

      const forLoop = async () => {
        const filteredTabs = tabs.filter((item) => !!item.id)
        for (const item of filteredTabs) {
          let countResponse
          if (item?.isSolr)
            countResponse = await app.$services.sarvSolr.getResourceCount(
              item.id,
              solrParams
            )
          else {
            countResponse = await app.$services.sarvREST.getResourceCount(
              item.id,
              item.id === 'attachment_link'
                ? apiAttachmentLinkParams
                : apiParams
            )
          }
          item.count = countResponse?.count ?? 0
          item.props = {
            ...item.props,
            locality: locality.id,
          }
        }
      }
      await forLoop()
      return {
        locality,
        tabs,
        drillcore,
        initActiveTab: route.path,
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
  methods: {
    isNil,
    isEmpty,
  },
}
</script>
