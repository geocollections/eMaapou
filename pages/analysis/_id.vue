<template>
  <detail v-if="!$fetchState.pending">
    <template #title>
      <header-detail :ids="ids" :title="pageTitle" />
    </template>

    <template #default>
      <v-card>
        <v-row no-gutters justify="center">
          <v-col>
            <v-card-title class="subsection-title">{{
              $t('common.general')
            }}</v-card-title>
            <v-card-text>
              <base-table>
                <table-row
                  v-if="analysisMethod"
                  :title="$t('analysis.method')"
                  :value="
                    $translate({
                      et: analysisMethod.analysis_method,
                      en: analysisMethod.method_en,
                    })
                  "
                />
                <table-row
                  v-if="agent"
                  :title="$t('analysis.analysedBy')"
                  :value="agent.agent"
                />

                <table-row-link
                  v-if="sample"
                  :title="$t('analysis.sampleNumber')"
                  :value="sample.number"
                  nuxt
                  :href="
                    localePath({
                      name: 'sample-id',
                      params: { id: analysis.sample.id },
                    })
                  "
                />

                <table-row
                  :title="$t('analysis.remarks')"
                  :value="analysis.remarks"
                />
                <table-row-link
                  v-if="reference"
                  :title="$t('analysis.reference')"
                  :value="reference.reference"
                  @link-click="$openGeology('reference', reference.id)"
                />
                <table-row
                  v-if="dataset"
                  :title="$t('analysis.dataset')"
                  :value="
                    $translate({
                      et: dataset.name,
                      en: dataset.name_en,
                    })
                  "
                />
                <table-row-link
                  v-if="sample && sample.locality"
                  :title="$t('analysis.locality')"
                  :value="
                    $translate({
                      et: sample.locality.locality,
                      en: sample.locality.locality_en,
                    })
                  "
                  nuxt
                  :href="
                    localePath({
                      name: 'locality-id',
                      params: { id: sample.locality.id },
                    })
                  "
                />
                <table-row
                  v-if="sample"
                  :title="$t('analysis.depth')"
                  :value="sample.depth"
                />
                <table-row
                  v-if="sample"
                  :title="$t('analysis.depthInterval')"
                  :value="sample.depth_interval"
                />
                <table-row-link
                  v-if="sample && sample.stratigraphy"
                  :title="$t('analysis.stratigraphy')"
                  :value="
                    $translate({
                      et: sample.stratigraphy.stratigraphy,
                      en: sample.stratigraphy.stratigraphy_en,
                    })
                  "
                  nuxt
                  :href="
                    localePath({
                      name: 'stratigraphy-id',
                      params: { id: sample.stratigraphy.id },
                    })
                  "
                />
                <table-row-link
                  v-if="sample && sample.lithostratigraphy"
                  :title="$t('analysis.lithostratigraphy')"
                  :value="
                    $translate({
                      et: sample.lithostratigraphy.stratigraphy,
                      en: sample.lithostratigraphy.stratigraphy_en,
                    })
                  "
                  nuxt
                  :href="
                    localePath({
                      name: 'stratigraphy-id',
                      params: { id: sample.lithostratigraphy.id },
                    })
                  "
                />
                <table-row-link
                  v-if="database"
                  :title="$t('analysis.institution')"
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
                  v-if="analysis.date_added"
                  :title="$t('analysis.dateAdded')"
                  :value="$formatDate(analysis.date_added)"
                />
                <table-row
                  v-if="analysis.date_changed"
                  :title="$t('analysis.dateChanged')"
                  :value="$formatDate(analysis.date_changed)"
                />
              </base-table>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
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
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Tabs from '~/components/Tabs.vue'
import Detail from '~/templates/Detail.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import { Tab, TABS_ANALYSIS } from '~/constants'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: { HeaderDetail, TableRow, TableRowLink, Tabs, Detail, BaseTable },
  setup() {
    const { $services, $hydrateTab, $translate, i18n } = useContext()
    const route = useRoute()
    const state = reactive({
      analysis: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
    })

    const database = computed(() => state.analysis?.database)
    const analysisMethod = computed(() => state.analysis?.analysis_method ?? '')
    const sample = computed(() => state.analysis?.sample)
    const agent = computed(() => state.analysis?.agent)
    const reference = computed(() => state.analysis?.reference)
    const dataset = computed(() => state.analysis?.dataset)

    const { fetchState } = useFetch(async () => {
      const analysisPromise = $services.sarvREST.getResource(
        'analysis',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 2,
          },
        }
      )

      const tabs = TABS_ANALYSIS.allIds.map((id) => TABS_ANALYSIS.byIds[id])
      const hydratedTabsPromise = Promise.all(
        tabs.map(
          async (tab) =>
            await $hydrateTab(tab, {
              countParams: {
                solr: {
                  default: { fq: `analysis_id:${route.value.params.id}` },
                },
                api: {
                  default: { analysis: route.value.params.id },
                },
              },
            })
        )
      )
      const [analysisResponse, hydratedTabs] = await Promise.all([
        analysisPromise,
        hydratedTabsPromise,
      ])
      state.tabs = hydratedTabs.filter((tab) => tab.count > 0)
      state.ids = analysisResponse?.ids
      state.analysis = analysisResponse
    })
    const slugText = computed(
      () =>
        `${$translate({
          et: state.analysis?.analysis_method.analysis_method,
          en: state.analysis?.analysis_method.method_en,
        })}-${state.analysis?.sample.number}`
    )
    const pageTitle = computed(() =>
      i18n.t('analysis.title', {
        method: $translate({
          et: state.analysis?.analysis_method?.analysis_method,
          en: state.analysis?.analysis_method?.method_en,
        }),
        sample: state.analysis?.sample?.number,
      })
    )
    useSlugRoute({
      slug: slugText,
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'analysis'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })

    return {
      ...toRefs(state),
      database,
      analysisMethod,
      sample,
      agent,
      reference,
      dataset,
      pageTitle,
    }
  },
  head() {
    return {
      title: `${this.pageTitle} | ${this.$t('analysis.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          content: `${this.pageTitle} | ${this.$t('analysis.pageTitle')}`,
          hid: 'og:title',
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
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
