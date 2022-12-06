<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
    <template #title>
      <header-detail :ids="ids" :title="pageTitle" />
    </template>
    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row :title="$t('sample.number')" :value="sample.number" />
          <table-row-link
            v-if="parent"
            :title="$t('sample.parent')"
            nuxt
            :href="localePath({ name: 'sample-id', params: { id: parent.id } })"
            :value="parent.number"
          />
          <table-row-link
            v-if="parentSpecimen"
            :title="$t('sample.parentSpecimen')"
            nuxt
            :href="
              localePath({
                name: 'specimen-id',
                params: { id: parentSpecimen.id },
              })
            "
            :value="parentSpecimen.specimen_id"
          />
          <table-row-link
            :title="$t('sample.igsn')"
            :value="sample.igsn"
            :href="`http://igsn.org/${sample.igsn}`"
          />
          <table-row
            :title="$t('sample.numberAdditional')"
            :value="sample.number_additional"
          />
          <table-row
            :title="$t('sample.numberField')"
            :value="sample.number_field"
          />
          <table-row-link
            v-if="locality"
            :title="$t('sample.locality')"
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
                params: { id: sample.locality.id },
              })
            "
          />
          <table-row
            v-if="locality"
            :title="$t('sample.latitude')"
            :value="locality.latitude"
          />
          <table-row
            v-if="locality"
            :title="$t('sample.longitude')"
            :value="locality.longitude"
          />
          <table-row-link
            v-if="site"
            :title="$t('sample.site')"
            :value="site.name"
            nuxt
            :href="
              localePath({
                name: 'site-id',
                params: { id: site.id },
              })
            "
          />
          <table-row
            v-if="site"
            :title="$t('sample.latitude')"
            :value="site.latitude"
          />
          <table-row
            v-if="site"
            :title="$t('sample.longitude')"
            :value="site.longitude"
          />
          <table-row :title="$t('sample.depth')" :value="sample.depth" />
          <table-row
            :title="$t('sample.depthInterval')"
            :value="sample.depth_interval"
          />
          <table-row-link
            v-if="stratigraphy"
            :title="$t('sample.stratigraphy')"
            :value="
              $translate({
                et: stratigraphy.stratigraphy,
                en: stratigraphy.stratigraphy_en,
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
            v-if="lithostratigraphy"
            :title="$t('sample.lithostratigraphy')"
            :value="
              $translate({
                et: lithostratigraphy.stratigraphy,
                en: lithostratigraphy.stratigraphy_en,
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
          <table-row
            :title="$t('sample.stratigraphyFree')"
            :value="sample.stratigraphy_free"
          />
          <table-row
            :title="$t('sample.stratigraphyBed')"
            :value="sample.stratigraphy_bed"
          />
          <table-row
            :title="$t('sample.dateCollected')"
            :value="sample.date_collected || sample.date_collected_free"
          />
          <table-row
            v-if="agentCollected || sample.agent_collected_txt"
            :title="$t('sample.agentCollected')"
            :value="agentCollected.agent || sample.agent_collected_txt"
          />
          <table-row :title="$t('sample.mass')" :value="sample.mass" />
          <table-row
            v-if="samplePurpose"
            :title="$t('sample.samplePurpose')"
            :value="
              $translate({
                et: samplePurpose.value,
                en: samplePurpose.value_en,
              })
            "
          />
          <table-row
            :title="$t('sample.rock')"
            :value="
              $translate({
                et: sample.rock,
                en: sample.rock_en,
              })
            "
          />
          <table-row
            v-if="classificationRock"
            :title="$t('sample.classificationRock')"
            :value="
              $translate({
                et: classificationRock.name,
                en: classificationRock.name_en,
              })
            "
          />
          <table-row
            :title="$t('sample.palaeontology')"
            :value="sample.palaeontology"
          />
          <table-row :title="$t('sample.fossils')" :value="sample.fossils" />
          <table-row :title="$t('sample.remarks')" :value="sample.remarks" />
          <table-row
            v-if="owner"
            :title="$t('sample.owner')"
            :value="owner.agent"
          />
          <table-row-link
            v-if="database"
            :title="$t('sample.database')"
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
            v-if="project"
            :title="$t('sample.project')"
            :value="
              $translate({
                et: sample.project.name,
                en: sample.project.name_en,
              })
            "
          />
          <table-row
            v-if="sample.date_added"
            :title="$t('sample.dateAdded')"
            :value="$formatDate(sample.date_added)"
          />
          <table-row
            v-if="sample.date_changed"
            :title="$t('sample.dateChanged')"
            :value="$formatDate(sample.date_changed)"
          />
        </base-table>
      </v-card-text>
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
                params: { id: sample.locality.id },
              })
            "
          >
          </table-row-link>
          <table-row
            :title="$t('sample.localityFree')"
            :value="sample.locality_free"
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
          <map-detail
            rounded
            :estonian-map="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            :estonian-bedrock-overlay="
              locality.country ? locality.country.value === 'Eesti' : false
            "
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
                  et: sample.drillcore,
                  en: sample.drillcore_en,
                }),
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template v-else-if="locations.length > 0" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card elevation="0">
          <map-detail rounded :markers="locations" />
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
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Tabs from '~/components/Tabs.vue'
import MapDetail from '~/components/map/MapDetail.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Detail from '~/templates/Detail.vue'
import { Tab, TABS_SAMPLE } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: {
    HeaderDetail,
    TableRowLink,
    TableRow,
    Tabs,
    MapDetail,
    Detail,
    BaseTable,
  },
  setup() {
    const { i18n, $hydrateTab, $services, $translate } = useContext()
    const route = useRoute()

    const state = reactive({
      sample: null as any,
      tabs: [] as Tab[],
      locations: [] as any[],
      validRoute: {} as Location,
      ids: {} as any,
    })

    const parentSpecimen = computed(() => state.sample?.parent_specimen)
    const parent = computed(() => state.sample?.parent_sample)
    const project = computed(() => state.sample?.project)
    const database = computed(() => state.sample?.database)
    const owner = computed(() => state.sample?.owner)
    const classificationRock = computed(() => state.sample?.classification_rock)
    const samplePurpose = computed(() => state.sample?.sample_purpose)
    const agentCollected = computed(() => state.sample?.agent_collected)
    const lithostratigraphy = computed(() => state.sample?.lithostratigraphy)
    const stratigraphy = computed(() => state.sample?.stratigraphy)
    const site = computed(() => state.sample?.site)
    const locality = computed(() => state.sample?.locality)

    const { fetchState } = useFetch(async () => {
      const samplePromise = $services.sarvREST.getResource(
        'sample',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 2,
          },
        }
      )
      const localityGroupedPromise = $services.sarvSolr.getResourceList(
        'analysis',
        {
          defaultParams: {
            fq: `sample_id:${route.value.params.id}`,
            fl: 'locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en',
            group: true,
            'group.field': ['locality_id', 'site_id'],
            rows: 10000,
          },
        }
      )
      const tabsObject = TABS_SAMPLE

      const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])
      const hydratedTabsPromise = Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              solr: { default: { fq: `sample_id:${route.value.params.id}` } },
              api: { default: { sample: route.value.params.id } },
            },
          })
        )
      ).then((res): { [K: string]: any } => {
        return res.reduce((prev, tab): { [K: string]: any } => {
          return { ...prev, [tab.id]: tab }
        }, {})
      })
      const [sampleResponse, localityGroupedResponse, hydratedTabsByIds] =
        await Promise.all([
          samplePromise,
          localityGroupedPromise,
          hydratedTabsPromise,
        ])
      state.ids = sampleResponse?.ids
      state.sample = sampleResponse

      hydratedTabsByIds.graphs.props.sampleObject = state.sample
      state.tabs = TABS_SAMPLE.allIds
        .map((id) => hydratedTabsByIds[id])
        .filter((tab) => tab.count > 0)

      const localities = localityGroupedResponse?.grouped?.locality_id?.groups
        ?.map((item: any) => item?.doclist?.docs?.[0])
        .filter((item: any) => !isEmpty(item) && item?.locality_id)
      const sites = localityGroupedResponse?.grouped?.site_id?.groups
        ?.map((item: any) => item?.doclist?.docs?.[0])
        .filter((item: any) => !isEmpty(item) && item?.site_id)

      state.locations = localities
        .concat(sites)
        .reduce((filtered: any[], item: any) => {
          if (!(item.latitude && item.longitude)) return filtered
          const isItemInArray = filtered.some(
            (existingItem: any) =>
              existingItem.latitude === item.latitude &&
              existingItem.longitude === item.longitude
          )
          if (isItemInArray) return filtered

          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              $translate({ et: item.locality, en: item.locality_en }) ??
              (item.name || `ID: ${item.id}`),
            routeName: item.locality_id ? 'locality' : 'site',
            id: item.locality_id ?? item.site_id,
          }
          return [...filtered, newItem]
        }, [])

      if (state.sample?.site) {
        state.locations.push({
          latitude: state.sample.site.latitude,
          longitude: state.sample.site.longitude,
          text: state.sample.site.name,
          routeName: 'site',
          id: state.sample.site_id,
        })
      }
    })

    const title = computed(() =>
      `${
        state.sample?.number ||
        state.sample?.number_additional ||
        state.sample?.number_field ||
        state.sample?.id
      }`.trim()
    )
    const pageTitle = computed(
      () => `${i18n.t('sample.number')} ${title.value}`
    )
    useSlugRoute({
      slug: title,
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'sample'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })

    return {
      ...toRefs(state),
      parentSpecimen,
      parent,
      project,
      database,
      owner,
      classificationRock,
      samplePurpose,
      agentCollected,
      lithostratigraphy,
      stratigraphy,
      site,
      locality,
      title,
      pageTitle,
    }
  },
  head() {
    return {
      title: `${this.title} | ${this.$t('sample.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.title} | ${this.$t('sample.pageTitle')}`,
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
    isNil,
  },
})
</script>
