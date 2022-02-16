<template>
  <detail>
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
            :title="$t('preparation.preparation_number')"
            :value="preparation.preparation_number"
          />

          <table-row
            :title="$t('preparation.sample_number')"
            :value="preparation.sample_number"
          />
          <table-row-link
            v-if="analysis"
            :title="$t('preparation.analysis')"
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
            :title="$t('preparation.taxon')"
            :value="taxon.taxon"
            @link-click="
              $openWindow(`https://fossiilid.info/${preparation.taxon.id}`)
            "
          />
          <table-row
            v-if="agent"
            :title="$t('preparation.agent')"
            :value="agent.agent || preparation.agent_txt"
          />
          <table-row
            v-if="identification_agent"
            :title="$t('preparation.identification_agent')"
            :value="identification_agent.agent"
          />
          <table-row
            :title="$t('preparation.date_prepared')"
            :value="preparation.date_prepared || preparation.date_prepared_txt"
          />
          <table-row
            :title="$t('preparation.identification_date')"
            :value="preparation.identification_date"
          />
          <table-row
            :title="$t('preparation.identification_remarks')"
            :value="preparation.identification_remarks"
          />
          <table-row
            :title="$t('preparation.location')"
            :value="preparation.location"
          />
          <table-row
            v-if="storage"
            :title="$t('preparation.storage')"
            :value="storage.location"
          />
          <table-row
            v-if="owner"
            :title="$t('preparation.owner')"
            :value="owner.agent"
          />
          <table-row
            v-if="preparation.date_added"
            :title="$t('preparation.dateAdded')"
            :value="$formatDate(preparation.date_added)"
          />
          <table-row
            v-if="preparation.date_changed"
            :title="$t('preparation.dateChanged')"
            :value="$formatDate(preparation.date_changed)"
          />
          <table-row
            :title="$t('preparation.remarks')"
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
            :title="$t('sample.number')"
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
          <table-row :title="$t('sample.depth')" :value="sample.depth" />
          <table-row
            :title="$t('sample.depthInterval')"
            :value="sample.depth_interval"
          />
          <table-row
            :title="$t('sample.dateCollected')"
            :value="sample.date_collected || sample.date_collected_free"
          />
        </base-table>
      </v-card-text>
    </template>
    <template #bottom>
      <v-card
        v-if="filteredTabs.length > 0 && !$fetchState.pending"
        class="mt-4 pb-4"
      >
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNil } from 'lodash'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Tabs from '~/components/Tabs.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import { TABS_PREPARATION } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'

export default {
  components: { TableRowLink, TableRow, HeaderDetail, Tabs, Detail, BaseTable },

  async asyncData({ params, route, error, $services }) {
    try {
      const detailViewResponse = await $services.sarvREST.getResource(
        'preparation',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = detailViewResponse?.ids
      const preparation = detailViewResponse

      return {
        preparation,
        ids,
      }
    } catch (err) {
      error({
        message: `Could not find preparation ${route.params.id}`,
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
    const tabs = TABS_PREPARATION.allIds.map((id) => TABS_PREPARATION.byIds[id])

    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            countParams: {
              solr: {
                default: { fq: `preparation_id:${this.preparation?.id}` },
              },
              api: { default: { preparation: this.preparation?.id } },
            },
          })
      )
    )

    const slugRoute = this.$createSlugRoute(
      this.$route,
      this.preparation?.preparation_number
    )

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: `${this.preparation.preparation_number} | ${this.$t(
        'preparation.pageTitle'
      )}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.preparation.preparation_number} | ${this.$t(
            'preparation.pageTitle'
          )}`,
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
    sample() {
      return this.preparation?.sample
    },
    analysis() {
      return this.preparation?.analysis
    },
    taxon() {
      return this.preparation?.taxon
    },
    agent() {
      return this.preparation?.agent
    },
    identification_agent() {
      return this.preparation?.identification_agent
    },
    storage() {
      return this.preparation?.storage
    },
    owner() {
      return this.preparation?.owner
    },
  },
  methods: {
    isNil,
  },
}
</script>
