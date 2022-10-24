<template>
  <detail v-if="!$fetchState.pending">
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
            :title="$t('drillcore.name')"
            :value="
              $translate({
                et: drillcore.drillcore,
                en: drillcore.drillcore_en,
              })
            "
          />
          <table-row :title="$t('drillcore.boxes')" :value="drillcore.boxes" />
          <table-row
            :title="$t('drillcore.boxNumbers')"
            :value="drillcore.box_numbers"
          />
          <table-row
            v-if="depository"
            :title="$t('drillcore.repository')"
            :value="
              $translate({
                et: depository.value,
                en: depository.value_en,
              })
            "
          />
          <table-row
            v-if="storage"
            :title="$t('drillcore.storage')"
            :value="storage.location"
          />
          <table-row
            v-if="agent"
            :title="$t('drillcore.driller')"
            :value="agent.agent"
          />
          <table-row :title="$t('drillcore.year')" :value="drillcore.year" />
          <table-row
            :title="$t('drillcore.metersInBox')"
            :value="drillcore.number_meters"
          />

          <table-row-link
            v-if="database"
            :title="$t('drillcore.database')"
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
            :title="$t('drillcore.dateAdded')"
            :value="$formatDate(drillcore.date_added)"
          />
          <table-row
            v-if="drillcore.date_changed"
            :title="$t('drillcore.dateChanged')"
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
          <table-row
            v-if="locality.country"
            :title="$t('locality.country')"
            :value="
              $translate({
                et: locality.country.value,
                en: locality.country.value_en,
              })
            "
          />
          <table-row
            :title="$t('locality.latitude')"
            :value="locality.latitude"
          />
          <table-row
            :title="$t('locality.longitude')"
            :value="locality.longitude"
          />
          <table-row
            :title="$t('locality.elevation')"
            :value="locality.elevation"
          />
          <table-row :title="$t('locality.depth')" :value="locality.depth" />
        </base-table>
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
        <tabs :tabs="filteredTabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import LeafletMap from '~/components/map/LeafletMap.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Tabs from '~/components/Tabs.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import { TABS_DRILLCORE } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'

export default {
  components: {
    HeaderDetail,
    Tabs,
    LeafletMap,
    TableRow,
    TableRowLink,
    Detail,
    BaseTable,
  },
  data() {
    return {
      drillcore: null,
      ids: [],
      validRoute: {},
      tabs: [],
    }
  },
  async fetch() {
    const drillcoreResponse = await this.$services.sarvREST.getResource(
      'drillcore',
      this.$route.params.id,
      {
        params: {
          nest: 2,
        },
      }
    )
    this.ids = drillcoreResponse?.ids
    this.drillcore = drillcoreResponse

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
    tabsObject.byIds.analysis_results.count = lasFileResponse?.items?.[0]
      ?.attachment
      ? 1
      : 0
    tabsObject.byIds.analysis_results.props = {
      drillcoreObject: this.drillcore,
      locality: this.drillcore?.locality?.id,
      attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
      analysisResultsCount: tabsObject.byIds.analysis_results.count,
    }

    const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])
    this.tabs = this.drillcore?.locality?.id
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

    const slugRoute = this.$createSlugRoute(
      this.$route,
      this.$translate({
        et: this.drillcore.drillcore,
        en: this.drillcore.drillcore_en,
      })
    )
    this.validRoute = this.localeLocation(
      this.$validateTabRoute(slugRoute, this.tabs)
    )
    if (this.$router.resolve(this.validRoute).href !== this.$route.path)
      this.$nuxt.context.redirect(this.validRoute)
  },
  head() {
    return {
      title: `${this.title} | ${this.$t('drillcore.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          content: `${this.title} | ${this.$t('drillcore.pageTitle')}`,
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
    title() {
      return this.$translate({
        et: this.drillcore?.drillcore,
        en: this.drillcore?.drillcore_en,
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
