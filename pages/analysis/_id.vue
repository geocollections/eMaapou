<template>
  <detail>
    <template #title>
      <header-detail
        :ids="ids"
        :title="
          $t('analysis.title', {
            method: $translate({
              et: analysis_method.analysis_method,
              en: analysis_method.method_en,
            }),
            sample: sample.number,
          })
        "
      />
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
                  v-if="analysis_method"
                  :title="$t('analysis.method')"
                  :value="
                    $translate({
                      et: analysis_method.analysis_method,
                      en: analysis_method.method_en,
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
                  nuxt
                  :href="
                    localePath({
                      name: `institution-${database.acronym.toLowerCase()}`,
                    })
                  "
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
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Tabs from '~/components/Tabs.vue'
import Detail from '~/templates/Detail.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import { TABS_ANALYSIS } from '~/constants'

export default {
  components: { HeaderDetail, TableRow, TableRowLink, Tabs, Detail, BaseTable },

  async asyncData({ params, route, error, $services }) {
    try {
      const analysisResponse = await $services.sarvREST.getResource(
        'analysis',
        params.id,
        {
          params: {
            nest: 2,
          },
        }
      )
      const ids = analysisResponse?.ids
      const analysis = analysisResponse

      return {
        analysis,
        ids,
      }
    } catch (err) {
      error({
        message: `Could not find analysis ${route.params.id}`,
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
    const tabs = TABS_ANALYSIS.allIds.map((id) => TABS_ANALYSIS.byIds[id])

    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            countParams: {
              solr: {
                default: { fq: `analysis_id:${this.analysis.id}` },
              },
              api: {
                default: { analysis: this.analysis.id },
              },
            },
          })
      )
    )

    const text = `${this.$translate({
      et: this.analysis?.analysis_method.analysis_method,
      en: this.analysis?.analysis_method.method_en,
    })}-${this.analysis?.sample.number}`

    const slugRoute = this.$createSlugRoute(this.$route, text)

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: `${this.title} | ${this.$t('analysis.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          content: `${this.title} | ${this.$t('analysis.pageTitle')}`,
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
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    title() {
      return this.$t('analysis.title', {
        method: this.$translate({
          et: this.analysis?.analysis_method?.analysis_method,
          en: this.analysis?.analysis_method?.method_en,
        }),
        sample: this.analysis?.sample?.number,
      })
    },
    database() {
      return this.analysis?.database
    },
    analysis_method() {
      return this.analysis?.analysis_method ?? ''
    },
    sample() {
      return this.analysis?.sample
    },
    agent() {
      return this.analysis?.agent
    },
    reference() {
      return this.analysis?.reference
    },
    dataset() {
      return this.analysis?.dataset
    },
  },
  methods: {
    isEmpty,
    isNil,
  },
}
</script>
