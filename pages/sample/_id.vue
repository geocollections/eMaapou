<template>
  <detail>
    <template #title>
      <header-detail :ids="ids" :title="sampleTitle" class="title-sample" />
    </template>
    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <table-row :title="$t('sample.number')" :value="sample.number" />
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
                v-if="agent_collected || sample.agent_collected_txt"
                :title="$t('sample.agentCollected')"
                :value="agent_collected.agent || sample.agent_collected_txt"
              />
              <table-row :title="$t('sample.mass')" :value="sample.mass" />
              <table-row
                v-if="sample_purpose"
                :title="$t('sample.samplePurpose')"
                :value="
                  $translate({
                    et: sample_purpose.value,
                    en: sample_purpose.value_en,
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
                v-if="classification_rock"
                :title="$t('sample.classificationRock')"
                :value="
                  $translate({
                    et: classification_rock.name,
                    en: classification_rock.name_en,
                  })
                "
              />
              <table-row
                :title="$t('sample.palaeontology')"
                :value="sample.palaeontology"
              />
              <table-row
                :title="$t('sample.fossils')"
                :value="sample.fossils"
              />
              <table-row
                :title="$t('sample.remarks')"
                :value="sample.remarks"
              />
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
                nuxt
                :href="
                  localePath({
                    name: `institution-${sample.database.acronym.toLowerCase()}`,
                  })
                "
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
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>

    <template v-if="locality" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.locality')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="mb-4 custom-table">
          <template #default>
            <tbody>
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
              <table-row
                :title="$t('locality.depth')"
                :value="locality.depth"
              />
            </tbody>
          </template>
        </v-simple-table>
        <v-card
          v-if="locality.latitude && locality.longitude"
          id="map-wrap"
          elevation="0"
        >
          <leaflet-map
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
            sample-overlay
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

    <template v-else-if="computedLocations.length > 0" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card elevation="0">
          <leaflet-map rounded :markers="computedLocations" />
        </v-card>
      </v-card-text>
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
import { isEmpty, isNil } from 'lodash'

import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Tabs from '~/components/Tabs.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Detail from '~/templates/Detail.vue'
import { TABS_SAMPLE } from '~/constants'

export default {
  components: {
    HeaderDetail,
    TableRowLink,
    TableRow,
    Tabs,
    LeafletMap,
    Detail,
  },
  async asyncData({ params, route, error, $services }) {
    try {
      const detailViewResponse = await $services.sarvREST.getResource(
        'sample',
        params.id,
        {
          params: {
            nest: 2,
          },
        }
      )
      const ids = detailViewResponse?.ids
      const sample = detailViewResponse

      return {
        sample,
        ids,
      }
    } catch (err) {
      error({
        message: `Could not find sample ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      tabs: [],
      initActiveTab: '',
      locations: [],
    }
  },
  async fetch() {
    const localityGroupedResponse =
      await this.$services.sarvSolr.getResourceList('analysis', {
        useRawSolr: true,
        defaultParams: {
          fq: `sample_id:${this.sample?.id}`,
          fl: 'locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en',
          group: true,
          'group.field': ['locality_id', 'site_id'],
          rows: 10000,
        },
      })

    const localities = localityGroupedResponse?.grouped?.locality_id?.groups
      ?.map((item) => item?.doclist?.docs?.[0])
      .filter((item) => !isEmpty(item) && item?.locality_id)
    const sites = localityGroupedResponse?.grouped?.site_id?.groups
      ?.map((item) => item?.doclist?.docs?.[0])
      .filter((item) => !isEmpty(item) && item?.site_id)
    this.locations = localities.concat(sites)

    const tabsObject = TABS_SAMPLE

    tabsObject.byIds.graphs.props.sampleObject = this.sample

    const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])
    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            countParams: {
              solr: { default: { fq: `sample_id:${this.sample?.id}` } },
              api: { default: { sample: this.sample?.id } },
            },
          })
      )
    )
    const name = `${
      this.sample?.number ||
      this.sample?.number_additional ||
      this.sample?.number_field
    }`.trim()
    // NOTE: Sample 115823 has number = " ", so slug fallback is the id of the sample
    const slugRoute = this.$createSlugRoute(
      this.$route,
      `${isEmpty(name) ? this.sample?.id : name}`
    )

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
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
  computed: {
    title() {
      return (
        this.sample.number ||
        this.sample.number_additional ||
        this.sample.number_field ||
        this.sample.id
      )
    },
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    sampleTitle() {
      return `${this.$t('sample.number')} ${
        this.sample.number ||
        this.sample.number_additional ||
        this.sample.number_field ||
        this.sample.id
      }`
    },

    computedLocations() {
      const locations = this.locations.reduce((filtered, item) => {
        if (item.latitude && item.longitude) {
          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              this.$translate({ et: item.locality, en: item.locality_en }) ??
              (item.name || `ID: ${item.id}`),
            routeName: item.locality_id ? 'locality' : 'site',
            id: item.locality_id ?? item.site_id,
          }

          const isItemInArray = !!filtered.find(
            (existingItem) =>
              existingItem.latitude === item.latitude &&
              existingItem.longitude === item.longitude
          )
          if (!isItemInArray) filtered.push(newItem)
        }
        return filtered
      }, [])

      if (this.sample.site) {
        locations.push({
          latitude: this.sample?.site?.latitude,
          longitude: this.sample?.site?.longitude,
          text: this.sample?.site?.name,
          routeName: 'site',
          id: this.sample.site_id,
        })
      }

      return locations
    },
    locality() {
      return this.sample?.locality
    },
    site() {
      return this.sample?.site
    },
    stratigraphy() {
      return this.sample?.stratigraphy
    },
    lithostratigraphy() {
      return this.sample?.lithostratigraphy
    },
    agent_collected() {
      return this.sample?.agent_collected
    },
    sample_purpose() {
      return this.sample?.sample_purpose
    },
    classification_rock() {
      return this.sample?.classification_rock
    },
    owner() {
      return this.sample?.owner
    },
    database() {
      return this.sample?.database
    },
    project() {
      return this.sample?.project
    },
  },
  methods: {
    isNil,
  },
}
</script>
