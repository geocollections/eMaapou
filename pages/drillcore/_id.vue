<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
    <template #title>
      <header-detail
        :ids="ids"
        :title="
          $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
        "
      />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row
            :title="$t('drillcore.name').toString()"
            :value="
              $translate({
                et: drillcore.drillcore,
                en: drillcore.drillcore_en,
              })
            "
          />
          <table-row
            :title="$t('drillcore.boxes').toString()"
            :value="drillcore.boxes"
          />
          <table-row
            :title="$t('drillcore.boxNumbers').toString()"
            :value="drillcore.box_numbers"
          />
          <table-row
            v-if="depository"
            :title="$t('drillcore.repository').toString()"
            :value="
              $translate({
                et: depository.value,
                en: depository.value_en,
              })
            "
          />
          <table-row
            v-if="storage"
            :title="$t('drillcore.storage').toString()"
            :value="storage.location"
          />
          <table-row
            v-if="agent"
            :title="$t('drillcore.driller').toString()"
            :value="agent.agent"
          />
          <table-row
            :title="$t('drillcore.year').toString()"
            :value="drillcore.year"
          />
          <table-row
            :title="$t('drillcore.metersInBox').toString()"
            :value="drillcore.number_meters"
          />

          <table-row-link
            v-if="database"
            :title="$t('drillcore.database').toString()"
            :value="
              $translate({
                et: database.name,
                en: database.name_en,
              })
            "
            :href="database.url"
            target="DatabaseWindow"
          />
          <table-row
            v-if="drillcore.date_added"
            :title="$t('drillcore.dateAdded').toString()"
            :value="$formatDate(drillcore.date_added)"
          />
          <table-row
            v-if="drillcore.date_changed"
            :title="$t('drillcore.dateChanged').toString()"
            :value="$formatDate(drillcore.date_changed)"
          />
        </base-table>
      </v-card-text>
      <div v-if="drillcore.remarks">
        <v-card-title class="subsection-title">{{
          $t('drillcore.remarks')
        }}</v-card-title>
        <v-card-text>{{ drillcore.remarks }}</v-card-text>
      </div>
    </template>

    <template v-if="locality" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.locality')
      }}</v-card-title>
      <v-card-text>
        <base-table class="mb-4">
          <table-row-link
            :title="$t('locality.locality').toString()"
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
          <table-row
            v-if="locality.country"
            :title="$t('locality.country').toString()"
            :value="
              $translate({
                et: locality.country.value,
                en: locality.country.value_en,
              })
            "
          />
          <table-row
            :title="$t('locality.coordinates').toString()"
            :value="`${locality.latitude}, ${locality.longitude}`"
          />
          <table-row
            :title="$t('locality.elevation').toString()"
            :value="locality.elevation"
          />
          <table-row
            :title="$t('locality.depth').toString()"
            :value="locality.depth"
          />
        </base-table>
        <v-card
          v-if="locality.latitude && locality.longitude"
          id="map-wrap"
          elevation="0"
        >
          <map-detail
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
      <v-card v-if="tabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="tabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script lang="ts">
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import {
  computed,
  defineComponent,
  reactive,
  // reactive,
  // shallowReactive,
  toRef,
  toRefs,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import MapDetail from '~/components/map/MapDetail.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Tabs from '~/components/Tabs.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import { Tab, TABS_DRILLCORE } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'
import { useRedirectInvalidTabRoute } from '~/composables/useRedirectInvalidTabRoute'
export default defineComponent({
  components: {
    HeaderDetail,
    Tabs,
    MapDetail,
    TableRow,
    TableRowLink,
    Detail,
    BaseTable,
  },
  setup() {
    const { $services, $hydrateTab, $translate, i18n } = useContext()
    const route = useRoute()
    const state = reactive({
      drillcore: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
    })

    const depository = computed(() => state.drillcore?.depository)
    const storage = computed(() => state.drillcore?.storage)
    const agent = computed(() => state.drillcore?.agent)
    const database = computed(() => state.drillcore?.database)
    const locality = computed(() => state.drillcore?.locality)

    const { fetchState } = useFetch(async () => {
      const drillcoreResponse = await $services.sarvREST.getResource(
        'drillcore',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 2,
          },
        }
      )
      state.ids = drillcoreResponse?.ids
      state.drillcore = drillcoreResponse
      let lasFileResponse
      if (state.drillcore?.locality) {
        lasFileResponse = await $services.sarvREST.getResourceList(
          'attachment_link',
          {
            defaultParams: {
              attachment__uuid_filename__iendswith: '.las',
              locality: state.drillcore.locality.id,
              fields: 'attachment',
            },
          }
        )
      }

      const tabsObject = TABS_DRILLCORE

      tabsObject.byIds.boxes.count = state.drillcore?.boxes || 0
      tabsObject.byIds.analysis_results.count = lasFileResponse?.items?.[0]
        ?.attachment
        ? 1
        : 0
      tabsObject.byIds.analysis_results.props = {
        drillcoreObject: state.drillcore,
        locality: state.drillcore?.locality?.id,
        attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
        analysisResultsCount: tabsObject.byIds.analysis_results.count,
      }

      const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

      state.tabs = (
        state.drillcore?.locality?.id
          ? await Promise.all(
              tabs.map((tab) => {
                return $hydrateTab(tab, {
                  props: { locality: state.drillcore?.locality?.id },
                  countParams: {
                    solr: {
                      default: {
                        fq: `locality_id:${state.drillcore?.locality?.id}`,
                      },
                    },
                    api: {
                      default: { locality: state.drillcore?.locality?.id },
                      boxes: { drillcore: route.value.params.id },
                      attachment_link: {
                        or_search: `drillcore:${state.drillcore.id} OR locality:${state.drillcore.locality.id}`,
                      },
                    },
                  },
                })
              })
            )
          : tabs
      ).filter((tab) => {
        if (tab.id === 'graphs') {
          return tab.props.attachment || tab.props.analysisResultsCount > 0
        } else return tab.count > 0
      })
    })
    const title = computed(() =>
      $translate({
        et: state.drillcore?.drillcore,
        en: state.drillcore?.drillcore_en,
      })
    )
    useRedirectInvalidTabRoute({
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'drillcore'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })
    useMeta(() => {
      return {
        title: `${title.value} | ${i18n.t('drillcore.pageTitle')}`,
        meta: [
          {
            property: 'og:title',
            content: `${title.value} | ${i18n.t('drillcore.pageTitle')}`,
            hid: 'og:title',
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
      depository,
      storage,
      agent,
      database,
      locality,
      isEmpty,
      isNull,
    }
  },
  head: {},
})
</script>
