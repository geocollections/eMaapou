<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="
          $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
        "
        class="title-drillcore"
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
                :title="$t('drillcore.name')"
                :value="
                  $translate({
                    et: drillcore.drillcore,
                    en: drillcore.drillcore_en,
                  })
                "
              />
              <data-row
                :title="$t('drillcore.boxes')"
                :value="drillcore.boxes"
              />
              <data-row
                :title="$t('drillcore.boxNumbers')"
                :value="drillcore.box_numbers"
              />
              <data-row
                v-if="depository"
                :title="$t('drillcore.repository')"
                :value="
                  $translate({
                    et: depository.value,
                    en: depository.value_en,
                  })
                "
              />
              <data-row
                v-if="storage"
                :title="$t('drillcore.storage')"
                :value="storage.location"
              />
              <data-row
                v-if="agent"
                :title="$t('drillcore.driller')"
                :value="agent.agent"
              />
              <data-row :title="$t('drillcore.year')" :value="drillcore.year" />
              <data-row
                :title="$t('drillcore.metersInBox')"
                :value="drillcore.number_meters"
              />

              <link-data-row
                v-if="database"
                :title="$t('drillcore.database')"
                :value="
                  $translate({
                    et: database.name,
                    en: database.name_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: `institution-${database.acronym.toLowerCase()}`,
                  })
                "
              />
              <data-row
                v-if="drillcore.date_added"
                :title="$t('drillcore.dateAdded')"
                :value="$formatDate(drillcore.date_added)"
              />
              <data-row
                v-if="drillcore.date_changed"
                :title="$t('drillcore.dateChanged')"
                :value="$formatDate(drillcore.date_changed)"
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <div v-if="drillcore.remarks">
        <v-card-title class="subsection-title">{{
          $t('drillcore.remarks')
        }}</v-card-title>
        <v-card-text>{{ drillcore.remarks }}</v-card-text>
      </div>
    </template>

    <template v-if="drillcore.locality" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.locality')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="mb-4 custom-table">
          <template #default>
            <tbody>
              <link-data-row
                :title="$t('locality.locality')"
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
                    params: { id: drillcore.locality.id },
                  })
                "
              />
              <data-row
                v-if="locality.country"
                :title="$t('locality.country')"
                :value="
                  $translate({
                    et: locality.country.value,
                    en: locality.country.value_en,
                  })
                "
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
                :title="$t('locality.elevation')"
                :value="locality.elevation"
              />
              <data-row :title="$t('locality.depth')" :value="locality.depth" />
            </tbody>
          </template>
        </v-simple-table>
        <v-card
          v-if="locality.latitude && locality.longitude"
          id="map-wrap"
          elevation="0"
        >
          <leaflet-map
            :estonian-map="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            :estonian-bedrock-overlay="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            rounded
            borehole-overlay
            height="300px"
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
      <v-card v-if="filteredTabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>

      <v-card v-if="rawLasFileContent">
        <v-card-title></v-card-title>

        <v-card-text>
          <las-chart
            :chart-title="
              $translate({
                et: locality.locality,
                en: locality.locality_en,
              })
            "
            :file-data="rawLasFileContent"
          />
        </v-card-text>
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isEmpty, isNull } from 'lodash'
import LeafletMap from '~/components/map/LeafletMap.vue'
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Detail from '~/components/templates/Detail.vue'
import LasChart from '~/components/chart/LasChart'
import { TABS_DRILLCORE } from '~/constants'

export default {
  components: {
    LasChart,
    TitleCardDetail,
    Tabs,
    LeafletMap,
    DataRow,
    LinkDataRow,
    Detail,
  },
  async asyncData({
    params,
    route,
    error,
    redirect,
    $validateTabRoute,
    $services,
    $hydrateTab,
    $translate,
    $createSlugRoute,
  }) {
    try {
      const drillcoreResponse = await $services.sarvREST.getResource(
        'drillcore',
        params.id,
        {
          params: {
            nest: 2,
          },
        }
      )
      const ids = drillcoreResponse?.ids
      const drillcore = drillcoreResponse

      // START of getting .las file data
      // At first checking if any related .las files
      let rawLasFileContent
      if (drillcore?.locality) {
        const lasFileResponse = await $services.sarvREST.getResourceList(
          'attachment_link',
          {
            defaultParams: {
              attachment__uuid_filename__iendswith: '.las',
              locality: drillcore.locality.id,
              fields: 'attachment',
            },
          }
        )

        if (
          lasFileResponse?.count > 0 &&
          lasFileResponse?.items?.[0]?.attachment
        ) {
          const rawLasfileContentResponse =
            await $services.sarvREST.getResource(
              'file',
              lasFileResponse?.items?.[0]?.attachment,
              {
                params: {
                  raw_content: 'true',
                },
              }
            )

          rawLasFileContent = rawLasfileContentResponse
          if (
            typeof rawLasfileContentResponse === 'string' &&
            rawLasFileContent.startsWith('Error: ')
          )
            rawLasFileContent = ''
        }
      }
      // END of getting .las file data

      const tabsObject = TABS_DRILLCORE

      tabsObject.byIds.boxes.count = drillcore?.boxes || 0
      tabsObject.byIds.analysis_results.props = drillcore

      const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

      const hydratedTabs = drillcore?.locality?.id
        ? await Promise.all(
            tabs.map(
              async (tab) =>
                await $hydrateTab(tab, {
                  props: { locality: drillcore?.locality?.id },
                  countParams: {
                    solr: {
                      default: {
                        fq: `locality_id :${drillcore?.locality?.id}`,
                      },
                    },
                    api: {
                      default: { locality: drillcore?.locality?.id },
                      attachment_link: {
                        or_search: `drillcore:${drillcore.id} OR locality:${drillcore.locality.id}`,
                      },
                    },
                  },
                })
            )
          )
        : tabs

      const slugRoute = $createSlugRoute(
        route,
        $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
      )

      const validPath = $validateTabRoute(slugRoute, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)

      return {
        drillcore,
        ids,
        initActiveTab: validPath,
        tabs: hydratedTabs,
        rawLasFileContent,
      }
    } catch (err) {
      error({
        message: `Could not find drillcore ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          property: 'og:title',
          content: this.title,
          hid: 'og:title',
        },
      ],
    }
  },
  computed: {
    title() {
      return this.$translate({
        et: this.drillcore.drillcore,
        en: this.drillcore.drillcore_en,
      })
    },
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    depository() {
      return this.drillcore?.depository
    },
    storage() {
      return this.drillcore?.storage
    },
    agent() {
      return this.drillcore?.agent
    },
    database() {
      return this.drillcore?.database
    },
    locality() {
      return this.drillcore?.locality
    },
  },
  methods: {
    isEmpty,
    isNull,
  },
}
</script>
