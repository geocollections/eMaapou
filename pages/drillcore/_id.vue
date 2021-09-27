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
import { TABS_DRILLCORE } from '~/constants'

export default {
  components: {
    TitleCardDetail,
    Tabs,
    LeafletMap,
    DataRow,
    LinkDataRow,
    Detail,
  },
  async asyncData({ params, route, error, $services }) {
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

      return {
        drillcore,
        ids,
      }
    } catch (err) {
      error({
        message: `Could not find drillcore ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      tabs: [],
      initActiveTab: '',
    }
  },
  async fetch() {
    // Checking if drillcore has a related .las file to show in graph tab (through locality)
    let lasFileResponse
    if (this.drillcore?.locality) {
      lasFileResponse = await this.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          defaultParams: {
            attachment__uuid_filename__iendswith: '.las',
            locality: this.drillcore.locality.id,
            fields: 'attachment',
          },
        }
      )
    }

    const tabsObject = TABS_DRILLCORE

    tabsObject.byIds.boxes.count = this.drillcore?.boxes || 0
    tabsObject.byIds.analysis_results.props = {
      drillcoreObject: this.drillcore,
      locality: this.drillcore?.locality?.id,
      attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
    }

    const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

    let hydratedTabs = this.drillcore?.locality?.id
      ? await Promise.all(
          tabs.map(
            async (tab) =>
              await this.$hydrateTab(tab, {
                props: { locality: this.drillcore?.locality?.id },
                countParams: {
                  solr: {
                    default: {
                      fq: `locality_id :${this.drillcore?.locality?.id}`,
                    },
                  },
                  api: {
                    default: { locality: this.drillcore?.locality?.id },
                    attachment_link: {
                      or_search: `drillcore:${this.drillcore.id} OR locality:${this.drillcore.locality.id}`,
                    },
                  },
                },
              })
          )
        )
      : tabs

    // Hack for graphs to show tab if related .las file exists (otherwise tab is shown but is disabled)
    hydratedTabs = hydratedTabs.map((item) => {
      if (item.id === 'graphs') {
        const count = lasFileResponse?.items?.[0]?.attachment
          ? item.count + 1
          : item.count
        return {
          ...item,
          count,
          props: {
            ...item.props,
            analysisResultsCount: item.count,
          },
        }
      } else return item
    })

    const slugRoute = this.$createSlugRoute(
      this.$route,
      this.$translate({
        et: this.drillcore.drillcore,
        en: this.drillcore.drillcore_en,
      })
    )

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
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
      return this.tabs.filter((item) => {
        if (item.id === 'graphs') {
          return item.props.attachment || item.props.analysisResultsCount > 0
        } else return item.count > 0
      })
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
