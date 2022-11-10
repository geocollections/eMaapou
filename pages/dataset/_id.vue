<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
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

    <template v-if="locationMarkers.length > 0" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <leaflet-map rounded :markers="locationMarkers" />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="tabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="tabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script lang="ts">
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'

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
import Tabs from '~/components/Tabs.vue'
import Detail from '~/templates/Detail.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import { Tab, TABS_DATASET } from '~/constants'
import { useSlugRoute } from '~/composables/useSlugRoute'
import { MapMarker } from '~/types/map'
export default defineComponent({
  components: {
    LeafletMap,
    HeaderDetail,
    Tabs,
    Detail,
    TableRow,
    TableRowLink,
    BaseTable,
  },
  setup() {
    const { $services, $hydrateTab, $translate } = useContext()
    const route = useRoute()
    const state = reactive({
      dataset: null as any,
      ids: {} as any,
      parameters: [] as any[],
      parameterHeaders: { byIds: {}, allIds: [] } as {
        byIds: { [K: string]: any }
        allIds: string[]
      },
      doi: null as any,
      reference: null as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
      localities: [] as any[],
      locationMarkers: [] as any[],
    })

    const { fetchState } = useFetch(async () => {
      const datasetPromise = $services.sarvREST.getResource(
        'dataset',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 1,
          },
        }
      )
      const parametersPromise = $services.sarvSolr.getResource(
        'dataset',
        parseInt(route.value.params.id),
        {
          fl: 'parameter_index_list,parameter_list',
        }
      )
      const doiPromise = $services.sarvREST.getResourceList('doi', {
        defaultParams: {
          dataset: route.value.params.id,
          nest: 1,
        },
      })
      const localityGroupedPromise = $services.sarvSolr.getResourceList(
        'analysis',
        {
          defaultParams: {
            fq: `dataset_ids:${route.value.params.id}`,
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
          return $hydrateTab(tab, {
            countParams: {
              solr: {
                default: { fq: `dataset_ids:${route.value.params.id}` },
              },
              api: {
                default: { dataset: route.value.params.id },
              },
            },
          })
        })
      ).then((res): { [K: string]: any } => {
        return res.reduce((prev, tab): { [K: string]: any } => {
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

      state.ids = datasetResponse?.ids
      state.dataset = datasetResponse

      const parameterValues =
        parameters[0]?.parameter_index_list?.[0]?.split('; ')
      const parameterText = parameters[0]?.parameter_list?.[0]?.split('; ')

      state.parameters = parameterValues?.map((v: string, i: number) => {
        return { text: parameterText[i], value: v }
      })

      state.parameterHeaders = {
        byIds: state.parameters.reduce((prev, parameter) => {
          return { ...prev, [parameter.value]: { ...parameter, show: false } }
        }, {}),
        allIds: parameterValues,
      }

      state.doi = doiResponse.items?.[0]?.identifier
      state.reference = {
        id: doiResponse.items?.[0]?.reference?.id,
        reference: doiResponse.items?.[0]?.reference?.reference,
      }

      state.localities = localityGroupedResponse?.grouped?.locality_id?.groups
        ?.map((item: any) => item?.doclist?.docs?.[0])
        .filter((item: any) => {
          return !isEmpty(item) && item?.locality_id
        })
      const sites = localityGroupedResponse?.grouped?.site_id?.groups
        ?.map((item: any) => item?.doclist?.docs?.[0])
        .filter((item: any) => {
          return !isEmpty(item) && item?.site_id
        })
      state.locationMarkers = state.localities
        .concat(sites)
        .reduce((filtered: MapMarker[], item): MapMarker[] => {
          if (!(item.latitude && item.longitude)) return filtered
          const isItemInArray = filtered.some(
            (existingItem) =>
              existingItem.latitude === item.latitude &&
              existingItem.longitude === item.longitude
          )
          if (isItemInArray) return filtered

          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              $translate({ et: item.locality, en: item.locality_en }) ??
              (item.name || `ID: ${item.id}`),
            routeName: item.locality_id ? 'locality' : 'site',
            id: item.locality_id ?? item.site_id,
          }

          return [...filtered, newItem]
        }, [])

      hydratedTabsByIds.sample_results.props.parameterHeaders = {
        ...state.parameterHeaders,
        byIds: Object.fromEntries(
          Object.entries(state.parameterHeaders.byIds).map(([k, v]) => {
            return [k, { ...v, show: true }]
          })
        ),
      }

      hydratedTabsByIds.graphs.count =
        state.locationMarkers.length === 1 ? state.locationMarkers.length : 0
      hydratedTabsByIds.graphs.props.dataset = state.dataset

      state.tabs = TABS_DATASET.allIds
        .map((id) => hydratedTabsByIds[id])
        .filter((tab) => tab.count > 0)
    })
    const title = computed(() => state.dataset?.title)

    useSlugRoute({
      slug: title,
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'dataset'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })

    return { ...toRefs(state), title }
  },
  head() {
    return {
      title: `${this.title}| ${this.$t('dataset.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          content: `${this.title}| ${this.$t('dataset.pageTitle')}`,
          hid: 'og:title',
        },
        {
          property: 'og:description',
          content: (this.dataset as any)?.abstract,
          hid: 'og:description',
        },
        {
          property: 'description',
          content: (this.dataset as any)?.abstract,
          hid: 'description',
        },
      ],
    }
  },
  methods: {
    isEmpty,
    isNil,
  },
})
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
