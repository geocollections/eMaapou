<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
    <template #title>
      <header-detail :ids="ids" :title="preparation.preparation_number" />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row
            :title="$t('preparation.preparation_number').toString()"
            :value="preparation.preparation_number"
          />

          <table-row
            :title="$t('preparation.sample_number').toString()"
            :value="preparation.sample_number"
          />
          <table-row-link
            v-if="analysis"
            :title="$t('preparation.analysis').toString()"
            :value="analysis.id"
            nuxt
            :href="
              localePath({
                name: 'analysis-id',
                params: { id: analysis.id },
              })
            "
          />
          <table-row-link
            v-if="taxon"
            :title="$t('preparation.taxon').toString()"
            :value="taxon.taxon"
            @link-click="
              $openWindow(`https://fossiilid.info/${preparation.taxon.id}`)
            "
          />
          <table-row
            v-if="agent"
            :title="$t('preparation.agent').toString()"
            :value="agent.agent || preparation.agent_txt"
          />
          <table-row
            v-if="identificationAgent"
            :title="$t('preparation.identification_agent').toString()"
            :value="identificationAgent.agent"
          />
          <table-row
            :title="$t('preparation.date_prepared').toString()"
            :value="preparation.date_prepared || preparation.date_prepared_txt"
          />
          <table-row
            :title="$t('preparation.identification_date').toString()"
            :value="preparation.identification_date"
          />
          <table-row
            :title="$t('preparation.identification_remarks').toString()"
            :value="preparation.identification_remarks"
          />
          <table-row
            :title="$t('preparation.location').toString()"
            :value="preparation.location"
          />
          <table-row
            v-if="storage"
            :title="$t('preparation.storage').toString()"
            :value="storage.location"
          />
          <table-row
            v-if="owner"
            :title="$t('preparation.owner').toString()"
            :value="owner.agent"
          />
          <table-row
            v-if="preparation.date_added"
            :title="$t('preparation.dateAdded').toString()"
            :value="$formatDate(preparation.date_added)"
          />
          <table-row
            v-if="preparation.date_changed"
            :title="$t('preparation.dateChanged').toString()"
            :value="$formatDate(preparation.date_changed)"
          />
          <table-row
            :title="$t('preparation.remarks').toString()"
            :value="preparation.remarks"
          />
        </base-table>
      </v-card-text>
    </template>
    <template #column-right>
      <v-card-title class="subsection-title">
        {{ $t('sample.sample') }}
      </v-card-title>
      <v-card-text>
        <base-table>
          <table-row-link
            v-if="sample"
            :title="$t('sample.number').toString()"
            :value="
              sample.number ||
              sample.number_additional ||
              sample.number_field ||
              sample.id
            "
            nuxt
            :href="
              localePath({
                name: 'sample-id',
                params: { id: sample.id },
              })
            "
          />
          <table-row
            :title="$t('sample.depth').toString()"
            :value="sample.depth"
          />
          <table-row
            :title="$t('sample.depthInterval').toString()"
            :value="sample.depth_interval"
          />
          <table-row
            :title="$t('sample.dateCollected').toString()"
            :value="sample.date_collected || sample.date_collected_free"
          />
        </base-table>
      </v-card-text>
    </template>
    <template #bottom>
      <v-card v-if="tabs.length > 0" class="mt-4 pb-4">
        <tabs :tabs="tabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script lang="ts">
import isNil from 'lodash/isNil'
import {
  useContext,
  useFetch,
  useRoute,
  computed,
  defineComponent,
  reactive,
  toRefs,
  toRef,
  useMeta,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Tabs from '~/components/Tabs.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import { Tab, TABS_PREPARATION } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'
import { useRedirectInvalidTabRoute } from '~/composables/useRedirectInvalidTabRoute'
export default defineComponent({
  components: { TableRowLink, TableRow, HeaderDetail, Tabs, Detail, BaseTable },
  setup() {
    const { $services, $hydrateTab, i18n } = useContext()
    const route = useRoute()

    const state = reactive({
      preparation: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
    })
    const sample = computed(() => state.preparation?.sample)
    const analysis = computed(() => state.preparation?.analysis)
    const taxon = computed(() => state.preparation?.taxon)
    const agent = computed(() => state.preparation?.agent)
    const identificationAgent = computed(
      () => state.preparation?.identification_agent
    )
    const storage = computed(() => state.preparation?.storage)
    const owner = computed(() => state.preparation?.owner)

    const { fetchState } = useFetch(async () => {
      const preparationResponse = await $services.sarvREST.getResource(
        'preparation',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 1,
          },
        }
      )
      const tabs = TABS_PREPARATION.allIds.map(
        (id) => TABS_PREPARATION.byIds[id]
      )
      const hydratedTabs = await Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              solr: {
                default: { fq: `preparation_id:${route.value.params.id}` },
              },
              api: { default: { preparation: route.value.params.id } },
            },
          })
        )
      )
      // NOTE: using `Promise.all`, breaks the page weirdly.
      // For some reason the preparation promise returns a `taxon_list` result with the same id sometimes
      // Ex. `preparation/10045`
      // Making the query straight to the the API, it always returns the correct response.
      // Seems to be caused if multiple queries are made to API at the same time and if the API endpoints use generic views.
      // const [preparationResponse, hydratedTabs] = await Promise.all([
      //   preparationPromise,
      //   hydratedTabsPromise,
      // ])
      state.ids = preparationResponse?.ids
      state.preparation = preparationResponse
      state.tabs = hydratedTabs.filter((item) => item.count > 0)
    })
    const title = computed(() => state.preparation?.preparation_number)

    useRedirectInvalidTabRoute({
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'preparation'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })
    useMeta(() => {
      return {
        title: `${title.value} | ${i18n.t('preparation.pageTitle')}`,
        meta: [
          {
            property: 'og:title',
            hid: 'og:title',
            content: `${title.value} | ${i18n.t('preparation.pageTitle')}`,
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
      sample,
      analysis,
      taxon,
      agent,
      identificationAgent,
      storage,
      owner,
      isNil,
    }
  },
  head: {},
})
</script>
