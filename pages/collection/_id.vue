<template>
  <detail>
    <template #title>
      <title-card-detail :ids="ids" :title="title" class="title-drillcore" />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row
                :title="$t('collection.number')"
                :value="collection.number"
              />
              <data-row
                :title="$t('collection.name')"
                :value="
                  $translate({
                    et: collection.name,
                    en: collection.name_en,
                  })
                "
              />
              <data-row
                :title="$t('collection.nameLong')"
                :value="
                  $translate({
                    et: collection.name_long,
                    en: collection.name_long_en,
                  })
                "
              />
              <data-row
                v-if="classification"
                :title="$t('collection.classification')"
                :value="classification.class_field"
              />
              <link-data-row
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
              <data-row
                :title="$t('collection.numberObjects')"
                :value="`${collection.number_objects}`"
              />
              <link-data-row
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
              <data-row
                v-if="collection.date_added"
                :title="$t('collection.dateAdded')"
                :value="$formatDate(collection.date_added)"
              />
              <data-row
                v-if="collection.date_changed"
                :title="$t('collection.dateChanged')"
                :value="$formatDate(collection.date_changed)"
              />
              <!-- <data-row
                :title="$t('drillcore.boxes')"
                :value="drillcore.boxes"
              />
              <data-row
                :title="$t('drillcore.boxNumbers')"
                :value="drillcore.box_numbers"
              />
              <data-row
                v-if="depository"
                :title="$t('drillcore.repository')"
                :value="
                  $translate({
                    et: depository.value,
                    en: depository.value_en,
                  })
                "
              />
              <data-row
                v-if="storage"
                :title="$t('drillcore.storage')"
                :value="storage.location"
              />
              <data-row
                v-if="agent"
                :title="$t('drillcore.driller')"
                :value="agent.agent"
              />
              <data-row :title="$t('drillcore.year')" :value="drillcore.year" />
              <data-row
                :title="$t('drillcore.metersInBox')"
                :value="drillcore.number_meters"
              />

              <link-data-row
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
              <data-row
                v-if="drillcore.date_added"
                :title="$t('drillcore.dateAdded')"
                :value="$formatDate(drillcore.date_added)"
              />
              <data-row
                v-if="drillcore.date_changed"
                :title="$t('drillcore.dateChanged')"
                :value="$formatDate(drillcore.date_changed)"
              /> -->
            </tbody>
          </template>
        </v-simple-table>
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
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import DataRow from '~/components/DataRow.vue'
import Tabs from '~/components/Tabs.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Detail from '~/templates/Detail.vue'
import { TABS_COLLECTION } from '~/constants/tabs'
export default {
  components: {
    TitleCardDetail,
    DataRow,
    LinkDataRow,
    Detail,
    Tabs,
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
