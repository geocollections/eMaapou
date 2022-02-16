<template>
  <detail>
    <template #title>
      <header-detail :ids="ids" :title="title" />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row
            :title="$t('collection.number')"
            :value="collection.number"
          />
          <table-row
            :title="$t('collection.name')"
            :value="
              $translate({
                et: collection.name,
                en: collection.name_en,
              })
            "
          />
          <table-row
            :title="$t('collection.nameLong')"
            :value="
              $translate({
                et: collection.name_long,
                en: collection.name_long_en,
              })
            "
          />
          <table-row
            v-if="classification"
            :title="$t('collection.classification')"
            :value="classification.class_field"
          />
          <table-row-link
            v-if="reference"
            :title="$t('collection.reference')"
            :value="
              $translate({
                et: reference.reference,
                en: reference.reference_en,
              })
            "
            :href="`https://kirjandus.geoloogia.info/reference/${reference.id}`"
          />
          <table-row
            :title="$t('collection.numberObjects')"
            :value="`${collection.number_objects}`"
          />
          <table-row-link
            v-if="database"
            :title="$t('collection.database')"
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
            v-if="collection.date_added"
            :title="$t('collection.dateAdded')"
            :value="$formatDate(collection.date_added)"
          />
          <table-row
            v-if="collection.date_changed"
            :title="$t('collection.dateChanged')"
            :value="$formatDate(collection.date_changed)"
          />
          <!-- <table-row
                :title="$t('drillcore.boxes')"
                :value="drillcore.boxes"
              />
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
                nuxt
                :href="
                  localePath({
                    name: `institution-${database.acronym.toLowerCase()}`,
                  })
                "
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
              /> -->
        </base-table>
      </v-card-text>
      <div v-if="collection.remarks">
        <v-card-title class="subsection-title">{{
          $t('collection.remarks')
        }}</v-card-title>
        <v-card-text>{{ collection.remarks }}</v-card-text>
      </div>
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
import { isEmpty, isNull } from 'lodash'
import HeaderDetail from '~/components/HeaderDetail.vue'
import TableRow from '~/components/table/TableRow.vue'
import Tabs from '~/components/Tabs.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import { TABS_COLLECTION } from '~/constants/tabs'
import BaseTable from '~/components/base/BaseTable.vue'
export default {
  components: {
    HeaderDetail,
    TableRow,
    TableRowLink,
    Detail,
    Tabs,
    BaseTable,
  },
  async asyncData({ params, route, error, $services }) {
    try {
      const collectionResponse = await $services.sarvREST.getResource(
        'collection',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = collectionResponse?.ids
      const collection = collectionResponse

      return {
        collection,
        ids,
      }
    } catch (err) {
      error({
        message: `Could not find collection ${route.params.id}`,
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
    const tabsObject = TABS_COLLECTION

    const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            props: { collection: this.collection },
            countParams: {
              solr: {
                default: {
                  fq: `collection_id:${this.collection?.id}`,
                },
              },
            },
          })
      )
    )
    // console.log(hydratedTabs, this.collection.number)
    const slugRoute = this.$createSlugRoute(this.$route, this.collection.number)
    // console.log(slugRoute)
    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath
    // console.log(validPath)
    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: `${this.title} | ${this.$t('collection.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          content: `${this.title} | ${this.$t('collection.pageTitle')}`,
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
        et: this.collection.name,
        en: this.collection.name_en,
      })
    },
    filteredTabs() {
      return this.tabs.filter((item) => {
        return item.count > 0
      })
    },
    reference() {
      return this.collection?.reference
    },
    classification() {
      return this.collection?.classification
    },
    database() {
      return this.collection?.database
    },
  },
  methods: {
    isEmpty,
    isNull,
  },
}
</script>
