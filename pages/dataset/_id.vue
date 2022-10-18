<template>
  <detail v-if="!$fetchState.pending">
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
                params: { id: dataset.locality.id },
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
              <v-chip
                v-for="(parameter, i) in parameters"
                :key="i"
                small
                class="mr-1 mb-1"
              >
                {{ parameter.text }}
              </v-chip>
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
      <v-card v-if="filteredTabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="validRoute" />
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
  data() {
    return {
      dataset: null,
      ids: [],
      parameters: [],
      parameterHeaders: [],
      doi: null,
      reference: null,
      validRoute: {},
      tabs: TABS_DATASET.allIds.map((id) => TABS_DATASET.byIds[id]),
      localities: [],
      locations: [],
    }
  },
  async fetch() {
    const datasetPromise = this.$services.sarvREST.getResource(
      'dataset',
      this.$route.params.id,
      {
        params: {
          nest: 1,
        },
      }
    )
    const parametersPromise = this.$services.sarvSolr.getResource(
      'dataset',
      this.$route.params.id,
      { fl: 'parameter_index_list,parameter_list' }
    )
    const doiPromise = this.$services.sarvREST.getResourceList('doi', {
      defaultParams: {
        dataset: this.$route.params.id,
        nest: 1,
      },
    })
    const localityGroupedPromise = this.$services.sarvSolr.getResourceList(
      'analysis',
      {
        useRawSolr: true,
        defaultParams: {
          fq: `dataset_id:${this.$route.params.id}`,
          fl: 'locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en',
          group: true,
          'group.field': ['locality_id', 'site_id'],
          rows: 10000,
        },
      }
    )

    const tabs = TABS_DATASET.allIds.map((id) => TABS_DATASET.byIds[id])
    const hydratedTabsPromise = Promise.all(
      tabs.map((tab) => {
        return this.$hydrateTab(tab, {
          countParams: {
            solr: {
              default: { fq: `dataset_ids:${this.$route.params.id}` },
            },
            api: {
              default: { dataset: this.$route.params.id },
            },
          },
        })
      })
    ).then((res) => {
      return res.reduce((prev, tab) => {
        return { ...prev, [tab.id]: tab }
      }, {})
    })
    const [
      datasetResponse,
      parameters,
      doiResponse,
      localityGroupedResponse,
      hydratedTabsByIds,
    ] = await Promise.all([
      datasetPromise,
      parametersPromise,
      doiPromise,
      localityGroupedPromise,
      hydratedTabsPromise,
    ])

    this.ids = datasetResponse?.ids
    this.dataset = datasetResponse

    const parameterValues =
      parameters[0]?.parameter_index_list?.[0]?.split('; ')
    const parameterText = parameters[0]?.parameter_list?.[0]?.split('; ')

    this.parameters = parameterValues?.map((v, i) => {
      return { text: parameterText[i], value: v }
    })

    this.parameterHeaders = {
      byIds: this.parameters.reduce((prev, parameter) => {
        return { ...prev, [parameter.value]: { ...parameter, show: false } }
      }, {}),
      allIds: parameterValues,
    }

    this.doi = doiResponse.items?.[0]?.identifier
    this.reference = {
      id: doiResponse.items?.[0]?.reference?.id,
      reference: doiResponse.items?.[0]?.reference?.reference,
    }

    this.localities = localityGroupedResponse?.grouped?.locality_id?.groups
      ?.map((item) => item?.doclist?.docs?.[0])
      .filter((item) => {
        return !isEmpty(item) && item?.locality_id
      })
    const sites = localityGroupedResponse?.grouped?.site_id?.groups
      ?.map((item) => item?.doclist?.docs?.[0])
      .filter((item) => {
        return !isEmpty(item) && item?.site_id
      })
    this.locations = this.localities.concat(sites)

    hydratedTabsByIds.sample_results.props.parameterHeaders = {
      ...this.parameterHeaders,
      byIds: Object.fromEntries(
        Object.entries(this.parameterHeaders.byIds).map(([k, v]) => {
          return [k, { ...v, show: true }]
        })
      ),
    }

    hydratedTabsByIds.graphs.count =
      this.locations.length === 1 ? this.locations.length : 0
    hydratedTabsByIds.graphs.props.dataset = this.dataset

    this.tabs = TABS_DATASET.allIds.map((id) => hydratedTabsByIds[id])
    const slugRoute = this.$createSlugRoute(this.$route, this.dataset?.title)
    this.validRoute = this.$validateTabRoute(slugRoute, this.tabs)
    if (this.validRoute.path !== this.$route.path)
      this.$router.replace(this.validRoute)
  },
  head() {
    return {
      title: this.dataset?.title,
      meta: [
        {
          property: 'og:title',
          content: this.dataset?.title,
          hid: 'og:title',
        },
        {
          property: 'og:description',
          content: this.dataset?.abstract,
          hid: 'og:description',
        },
        {
          property: 'description',
          content: this.dataset?.abstract,
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
  },
  methods: {
    isEmpty,
    isNil,
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
