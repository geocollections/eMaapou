<template>
  <detail>
    <template #title>
      <header-detail :ids="ids" :title="dataset.title" />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row :title="$t('dataset.title')" :value="dataset.title" />
          <table-row
            :title="$t('dataset.titleTranslated')"
            :value="dataset.title_translated"
          />
          <table-row
            :title="$t('dataset.titleAlt')"
            :value="dataset.title_alternative"
          />
          <table-row
            v-if="dataset.creators || dataset.owner_txt || dataset.owner"
            :title="$t('dataset.creators')"
            :value="
              dataset.creators || dataset.owner_txt || dataset.owner.agent
            "
          />
          <table-row
            :title="$t('dataset.publicationYear')"
            :value="dataset.publication_year"
          />
          <table-row :title="$t('dataset.date')" :value="dataset.date" />
          <table-row
            :title="$t('dataset.resourceTopic')"
            :value="dataset.resource"
          />
          <table-row
            :title="$t('dataset.publisher')"
            :value="dataset.publisher"
          />
          <table-row
            :title="$t('dataset.subjects')"
            :value="dataset.subjects"
          />
          <table-row
            v-if="dataset.language"
            :title="$t('dataset.language')"
            :value="
              $translate({
                et: dataset.language.value,
                en: dataset.language.value_en,
              })
            "
          />
          <table-row
            :title="$t('dataset.abstract')"
            :value="dataset.abstract"
          />
          <table-row :title="$t('dataset.methods')" :value="dataset.methods" />
          <table-row :title="$t('dataset.version')" :value="dataset.version" />
          <table-row-link
            v-if="doi"
            :title="$t('dataset.doi')"
            :value="doi"
            :href="`https://doi.geocollections.info/${doi}`"
          />
          <table-row-link
            v-if="reference"
            :title="$t('dataset.reference')"
            :value="reference.reference"
            :href="`https://kirjandus.geoloogia.info/reference/${reference.id}`"
          />
          <table-row-link
            v-if="dataset.locality"
            :title="$t('dataset.locality')"
            :value="
              $translate({
                et: dataset.locality.locality,
                en: dataset.locality.locality_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'locality-id',
                params: { id: dataset.locality },
              })
            "
          />
          <table-row
            v-if="dataset.copyright_agent"
            :title="$t('dataset.copyright')"
            :value="dataset.copyright_agent.agent"
          />
          <table-row-link
            v-if="dataset.licence"
            :title="$t('dataset.licence')"
            :value="
              $translate({
                et: dataset.licence.licence,
                en: dataset.licence.licence_en,
              })
            "
            :href="
              $translate({
                et: dataset.licence.licence_url,
                en: dataset.licence.licence_url_en,
              })
            "
          />
          <table-row
            v-if="dataset.date_added"
            :title="$t('dataset.dateAdded')"
            :value="$formatDate(dataset.date_added)"
          />
          <table-row
            v-if="dataset.date_changed"
            :title="$t('dataset.dateChanged')"
            :value="$formatDate(dataset.date_changed)"
          />
          <table-row
            v-if="parameters"
            :title="$t('dataset.parameters')"
            :value="parameters"
          >
            <template #value>
              <v-chip-group
                :value="selectedParameterValues"
                multiple
                column
                active-class="active-tab font-weight-bold elevation-1"
                @change="handleParameterChange"
              >
                <v-chip
                  v-for="(parameter, i) in parameters"
                  :key="i"
                  :value="parameter.value"
                  small
                >
                  {{ parameter.text }}
                </v-chip>
              </v-chip-group>
            </template>
          </table-row>
        </base-table>
      </v-card-text>
    </template>

    <template #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <leaflet-map rounded :markers="computedLocations" />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
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
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'

import HeaderDetail from '~/components/HeaderDetail.vue'
import Tabs from '~/components/Tabs.vue'
import Detail from '~/templates/Detail.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import { TABS_DATASET } from '~/constants'

export default {
  components: {
    LeafletMap,
    HeaderDetail,
    Tabs,
    Detail,
    TableRow,
    TableRowLink,
    BaseTable,
  },
  async asyncData({ params, route, error, $services }) {
    try {
      const datasetResponse = await $services.sarvREST.getResource(
        'dataset',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = datasetResponse?.ids
      const dataset = datasetResponse

      const parameters = await $services.sarvSolr.getResource(
        'dataset',
        params.id,
        { fl: 'parameter_index_list,parameter_list' }
      )
      const parameterValues =
        parameters[0]?.parameter_index_list?.[0]?.split('; ')
      const parameterText = parameters[0]?.parameter_list?.[0]?.split('; ')

      const parsedParameters = parameterValues?.map((v, i) => {
        return { text: parameterText[i], value: v }
      })

      const parameterHeaders = {
        byIds: parsedParameters.reduce((prev, parameter) => {
          return { ...prev, [parameter.value]: { ...parameter, show: false } }
        }, {}),
        allIds: parameterValues,
      }

      const selectedParameters = parsedParameters?.slice(0, 5)
      const doiResponse = await $services.sarvREST.getResourceList('doi', {
        defaultParams: {
          dataset: params.id,
          nest: 1,
        },
      })

      const doi = doiResponse.items?.[0]?.identifier
      const reference = {
        id: doiResponse.items?.[0]?.reference,
        reference: doiResponse.items?.[0]?.reference?.reference,
      }

      return {
        dataset,
        ids,
        parameters: parsedParameters,
        selectedParameters,
        parameterHeaders,
        doi,
        reference,
      }
    } catch (err) {
      error({
        message: `Could not find dataset ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      tabs: [],
      initActiveTab: '',
      localities: [],
      locations: [],
    }
  },
  async fetch() {
    const localityGroupedResponse =
      await this.$services.sarvSolr.getResourceList('analysis', {
        useRawSolr: true,
        defaultParams: {
          fq: `dataset_id:${this.dataset.id}`,
          fl: 'locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en',
          group: true,
          'group.field': ['locality_id', 'site_id'],
          rows: 10000,
        },
      })

    const localities = localityGroupedResponse?.grouped?.locality_id?.groups
      ?.map((item) => item?.doclist?.docs?.[0])
      .filter((item) => !isEmpty(item) && item?.locality_id)
    const sites = localityGroupedResponse?.grouped?.site_id?.groups
      ?.map((item) => item?.doclist?.docs?.[0])
      .filter((item) => !isEmpty(item) && item?.site_id)
    const locations = localities.concat(sites)

    const tabsObject = TABS_DATASET

    tabsObject.byIds.dataset_analysis.props.parameterHeaders = {
      ...this.parameterHeaders,
      byIds: Object.fromEntries(
        Object.entries(this.parameterHeaders.byIds).map(([k, v], i) => {
          if (i < 5) return [k, { ...v, show: true }]
          return [k, v]
        })
      ),
    }
    tabsObject.byIds.sample_results.props.parameterHeaders = {
      ...this.parameterHeaders,
      byIds: Object.fromEntries(
        Object.entries(this.parameterHeaders.byIds).map(([k, v]) => {
          return [k, { ...v, show: true }]
        })
      ),
    }

    tabsObject.byIds.graphs.count =
      locations.length === 1 ? locations.length : 0

    const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

    const hydratedTabs = await Promise.all(
      tabs.map(async (tab) => {
        if (tab.isSolr) {
          return await this.$hydrateTab(tab, {
            countParams: {
              solr: {
                default: { fq: `dataset_id:${this.dataset.id}` },
              },
            },
          })
        }
        return await this.$hydrateTab(tab, {
          countParams: {
            api: {
              default: { dataset: this.dataset.id },
            },
          },
        })
      })
    )
    const slugRoute = this.$createSlugRoute(this.$route, this.dataset.title)

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.localities = localities
    this.locations = locations
    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: this.$translate({
        et: this.dataset.name,
        en: this.dataset.name_en,
      }),
      meta: [
        {
          property: 'og:title',
          content: this.$translate({
            et: this.dataset.name,
            en: this.dataset.name_en,
          }),
          hid: 'og:title',
        },
        {
          property: 'og:description',
          content: this.dataset.abstract,
          hid: 'og:description',
        },
        {
          property: 'description',
          content: this.dataset.abstract,
          hid: 'description',
        },
      ],
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },

    computedLocations() {
      return this.locations.reduce((filtered, item) => {
        if (item.latitude && item.longitude) {
          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              this.$translate({ et: item.locality, en: item.locality_en }) ??
              (item.name || `ID: ${item.id}`),
            routeName: item.locality_id ? 'locality' : 'site',
            id: item.locality_id ?? item.site_id,
          }

          const isItemInArray = !!filtered.find(
            (existingItem) =>
              existingItem.latitude === item.latitude &&
              existingItem.longitude === item.longitude
          )
          if (!isItemInArray) filtered.push(newItem)
        }
        return filtered
      }, [])
    },

    selectedParameterValues() {
      return this.selectedParameters?.map((param) => param.value)
    },
  },
  methods: {
    isEmpty,
    isNil,
    handleParameterChange(e) {
      const analysisTab = this.tabs.find((tab) => tab.id === 'dataset_analysis')

      const newParams = this.parameters.filter((parameter) =>
        e.includes(parameter.value)
      )

      analysisTab.props = { ...analysisTab.props, parameters: newParams }
    },
  },
}
</script>

<style lang="scss" scoped>
.active-tab {
  background-color: map-get($map: $grey, $key: 'lighten-3') !important;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: var(--v-accent-lighten2) !important;

  &:before {
    background-color: white !important;
  }
}
</style>
