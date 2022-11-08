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
            :href="database.url"
            target="DatabaseWindow"
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
  toRef,
  toRefs,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import HeaderDetail from '~/components/HeaderDetail.vue'
import TableRow from '~/components/table/TableRow.vue'
import Tabs from '~/components/Tabs.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import { Tab, TABS_COLLECTION } from '~/constants/tabs'
import BaseTable from '~/components/base/BaseTable.vue'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: {
    HeaderDetail,
    TableRow,
    TableRowLink,
    Detail,
    Tabs,
    BaseTable,
  },
  setup() {
    const { $services, $hydrateTab, $translate } = useContext()
    const route = useRoute()

    const state = reactive({
      collection: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
    })
    const reference = computed(() => state.collection?.reference)
    const database = computed(() => state.collection?.database)
    const classification = computed(() => state.collection?.classification)

    const { fetchState } = useFetch(async () => {
      const collectionPromise = $services.sarvREST.getResource(
        'collection',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 1,
          },
        }
      )
      const tabs = TABS_COLLECTION.allIds.map((id) => TABS_COLLECTION.byIds[id])
      const hydratedTabsPromise = await Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              solr: {
                default: {
                  fq: `collection_id:${route.value.params.id}`,
                },
              },
            },
          })
        )
      )
      const [collectionResponse, hydratedTabs] = await Promise.all([
        collectionPromise,
        hydratedTabsPromise,
      ])
      state.ids = collectionResponse?.ids
      state.collection = collectionResponse
      state.tabs = hydratedTabs
        .filter((tab) => tab.count > 0)
        .map((tab) => {
          return { ...tab, props: { collection: state.collection } }
        })
    })
    const title = computed(() =>
      $translate({
        et: state.collection?.name,
        en: state.collection?.name_en,
      })
    )
    useSlugRoute({
      slug: title,
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'collection'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })
    return { ...toRefs(state), title, reference, classification, database }
  },
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
  methods: {
    isEmpty,
    isNull,
  },
})
</script>
