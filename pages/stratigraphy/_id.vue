<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
    <template #title>
      <header-detail :ids="ids" :title="title" />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row-link
            v-if="stratigraphy.parent"
            :title="$t('stratigraphy.parentStratigraphy').toString()"
            :value="
              $translate({
                et: stratigraphy.parent.stratigraphy,
                en: stratigraphy.parent.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: stratigraphy.parent.id },
              })
            "
          />
          <table-row
            v-if="stratigraphy.type"
            :title="$t('stratigraphy.type').toString()"
            :value="
              $translate({
                et: stratigraphy.type.value,
                en: stratigraphy.type.value_en,
              })
            "
          />
          <table-row
            v-if="stratigraphy.rank"
            :title="$t('stratigraphy.rank').toString()"
            :value="
              $translate({
                et: stratigraphy.rank.value,
                en: stratigraphy.rank.value_en,
              })
            "
          />
          <table-row
            v-if="stratigraphy.original_rank"
            :title="$t('stratigraphy.originalRank').toString()"
            :value="stratigraphy.original_rank"
          />
          <table-row
            v-if="stratigraphy.scope"
            :title="$t('stratigraphy.scope').toString()"
            :value="
              $translate({
                et: stratigraphy.scope.value,
                en: stratigraphy.scope.value_en,
              })
            "
          />
          <table-row
            v-if="stratigraphy.status"
            :title="$t('stratigraphy.status').toString()"
            :value="
              $translate({
                et: stratigraphy.status.value,
                en: stratigraphy.status.value_en,
              })
            "
          />
          <table-row
            :title="$t('stratigraphy.author').toString()"
            :value="stratigraphy.author_free"
          />
          <table-row
            :title="$t('stratigraphy.year').toString()"
            :value="stratigraphy.year"
          />
          <table-row
            :title="$t('stratigraphy.etymon').toString()"
            :value="
              $translate({
                et: stratigraphy.etymon,
                en: stratigraphy.etymon_en,
              })
            "
          />
          <table-row
            :title="$t('stratigraphy.originalLocality').toString()"
            :value="stratigraphy.original_locality"
          />
          <table-row
            :title="$t('stratigraphy.ageTop').toString()"
            :value="stratigraphy.age_top"
          />
          <table-row
            :title="$t('stratigraphy.ageBase').toString()"
            :value="stratigraphy.age_base"
          />
          <table-row-link
            v-if="stratigraphy.age_chronostratigraphy"
            :title="$t('stratigraphy.age').toString()"
            :value="
              $translate({
                et: stratigraphy.age_chronostratigraphy.stratigraphy,
                en: stratigraphy.age_chronostratigraphy.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: {
                  id: stratigraphy.age_chronostratigraphy.id,
                },
              })
            "
          />
          <table-row
            v-if="stratigraphy.age_reference"
            :title="$t('stratigraphy.ageReference').toString()"
            :value="stratigraphy.age_reference.reference"
          />

          <table-row
            v-if="stratigraphy.index_main_html"
            :title="$t('stratigraphy.index').toString()"
          >
            <template #value>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="stratigraphy.index_main_html" />
            </template>
          </table-row>
          <table-row
            v-if="stratigraphy.index_additional_html"
            :title="$t('stratigraphy.indexAlt').toString()"
          >
            <template #value>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="stratigraphy.index_additional_html" />
            </template>
          </table-row>
          <table-row
            v-if="stratigraphy.index_old"
            :title="$t('stratigraphy.indexAlt').toString()"
          >
            <template #value>
              <div v-text="stratigraphy.index_old" />
            </template>
          </table-row>
          <table-row
            v-if="stratigraphy.date_added"
            :title="$t('stratigraphy.dateAdded').toString()"
            :value="$formatDate(stratigraphy.date_added)"
          />
          <table-row
            v-if="stratigraphy.date_changed"
            :title="$t('stratigraphy.dateChanged').toString()"
            :value="$formatDate(stratigraphy.date_changed)"
          />
        </base-table>
      </v-card-text>
    </template>
    <template
      v-if="stratotypeCount > 0 || stratigraphyMarkers.length > 0"
      #column-right
    >
      <v-card-title class="subsection-title">{{
        $t('stratigraphy.stratotypes')
      }}</v-card-title>
      <v-card-text>
        <data-table-stratigraphy-stratotype
          v-if="stratotypeCount > 0"
          only-table
          :items="stratotypes"
          :count="stratotypeCount"
          :options="options"
          :is-loading="false"
          class="mb-2"
        />
        <v-card
          v-if="stratigraphyMarkers.length > 0"
          id="map-wrap"
          elevation="0"
        >
          <map-detail
            rounded
            :estonian-map="mapIsEstonian"
            :estonian-bedrock-overlay="mapIsEstonian"
            height="300px"
            :markers="stratigraphyMarkers"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="tabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="tabs" :init-active-tab="validRoute" />
      </v-card>
      <v-card
        v-if="
          $translate({
            et: stratigraphy.description,
            en: stratigraphy.description_en,
          })
        "
      >
        <v-row no-gutters>
          <v-col cols="12">
            <v-card-title class="subsection-title">{{
              $t('common.description')
            }}</v-card-title>

            <v-card-text>
              <div
                v-html="
                  $translate({
                    et: stratigraphy.description,
                    en: stratigraphy.description_en,
                  })
                "
              />
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </detail>
</template>

<script lang="ts">
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import {
  defineComponent,
  reactive,
  toRefs,
  useRoute,
  useContext,
  useFetch,
  // toRef,
  computed,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch,
  toRef,
  useMeta,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import {
  STRATOTYPE,
  TABS_STRATIGRAPHY,
  HEADERS_STRATOTYPE,
  Tab,
} from '~/constants'
import MapDetail from '~/components/map/MapDetail.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Tabs from '~/components/Tabs.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import DataTableStratigraphyStratotype from '~/components/data-table/DataTableStratigraphyStratotype.vue'
import Detail from '~/templates/Detail.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import { useRedirectInvalidTabRoute } from '~/composables/useRedirectInvalidTabRoute'
import { MapMarker } from '~/types/map'
export default defineComponent({
  components: {
    HeaderDetail,
    Tabs,
    TableRowLink,
    TableRow,
    DataTableStratigraphyStratotype,
    MapDetail,
    Detail,
    BaseTable,
  },
  setup() {
    const { $services, $getAPIFieldValues, $hydrateTab, $translate, i18n } =
      useContext()
    const route = useRoute()
    const state = reactive({
      stratigraphy: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
      stratotypes: [] as any[],
      stratotypeCount: 0,
      options: STRATOTYPE.options,
    })
    const stratigraphyMarkers = computed((): MapMarker[] => {
      return state.stratotypes?.reduce((prev, stratotype) => {
        if (stratotype.locality) {
          prev.push({
            latitude: stratotype?.locality?.latitude,
            longitude: stratotype?.locality?.longitude,
            text: `${$translate({
              et: stratotype?.locality?.locality,
              en: stratotype?.locality?.locality_en,
            })} (${$translate({
              et: stratotype?.stratotype_type?.value,
              en: stratotype?.stratotype_type?.value_en,
            })})`,
          })
        }
        return prev
      }, [])
    })
    const mapIsEstonian = computed(() => {
      return state.stratotypes.some(
        (item) => item?.locality?.country?.value_en === 'Estonia'
      )
    })

    const { fetchState } = useFetch(async () => {
      const stratigraphyPromise = $services.sarvREST.getResource(
        'stratigraphy',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 1,
          },
        }
      )

      const stratotypePromise = $services.sarvREST.getResourceList(
        'stratigraphy_stratotype',
        {
          ...STRATOTYPE.options,
          defaultParams: {
            stratigraphy: route.value.params.id,
            nest: 2,
          },
          fields: $getAPIFieldValues(HEADERS_STRATOTYPE),
        }
      )
      const [stratigraphyResponse, stratotypeResponse] = await Promise.all([
        stratigraphyPromise,
        stratotypePromise,
      ])

      state.ids = stratigraphyResponse?.ids
      state.stratigraphy = stratigraphyResponse
      state.stratotypes = stratotypeResponse.items
      state.stratotypeCount = stratotypeResponse.count

      const tabsObject = TABS_STRATIGRAPHY

      tabsObject.byIds.specimen.props.stratigraphy = state.stratigraphy
      tabsObject.byIds.sample.props.stratigraphy = state.stratigraphy

      const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

      const hydratedTabs = await Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              api: {
                default: {
                  stratigraphy: route.value.params.id,
                },
                stratigraphy_stratotype: {
                  stratigraphy: route.value.params.id,
                },
                stratigraphy_synonym: {
                  stratigraphy: route.value.params.id,
                },
              },
              solr: {
                default: {
                  fq: state.stratigraphy.hierarchy_string
                    ? `(stratigraphy_hierarchy:(${state.stratigraphy.hierarchy_string}*) OR age_hierarchy:(${state.stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${state.stratigraphy.hierarchy_string}*))`
                    : `(stratigraphy_hierarchy:("") OR age_hierarchy:("") OR lithostratigraphy_hierarchy:(""))`,
                },
                lithostratigraphy: {
                  fq: `age_chronostratigraphy:${route.value.params.id}`,
                },
                subunits: {
                  fq: `parent_id:${route.value.params.id}`,
                },
              },
              fields: tab.fields ?? 'id',
            },
          })
        )
      )
      state.tabs = hydratedTabs.filter((tab) => tab.count > 0)
    })

    const title = computed(() =>
      $translate({
        et: state.stratigraphy?.stratigraphy,
        en: state.stratigraphy?.stratigraphy_en,
      })
    )
    useRedirectInvalidTabRoute({
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'stratigraphy'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })
    useMeta(() => {
      return {
        title: `${title.value} | ${i18n.t('stratigraphy.pageTitle')}`,
        meta: [
          {
            property: 'og:title',
            hid: 'og:title',
            content: `${title.value} | ${i18n.t('stratigraphy.pageTitle')}`,
          },
          {
            property: 'og:url',
            hid: 'og:url',
            content: route.value.path,
          },
        ],
      }
    })
    return {
      ...toRefs(state),
      title,
      stratigraphyMarkers,
      mapIsEstonian,
      isEmpty,
      isNull,
    }
  },
  head: {},
})
</script>
