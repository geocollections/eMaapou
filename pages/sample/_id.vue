<template>
  <detail>
    <template #title>
      <title-card-detail :ids="ids" :title="sampleTitle" class="title-sample" />
    </template>
    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row :title="$t('sample.number')" :value="sample.number" />
              <link-data-row
                :title="$t('sample.igsn')"
                :value="sample.igsn"
                :href="`http://igsn.org/${sample.igsn}`"
              />
              <data-row
                :title="$t('sample.numberAdditional')"
                :value="sample.number_additional"
              />
              <data-row
                :title="$t('sample.numberField')"
                :value="sample.number_field"
              />
              <link-data-row
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
              <data-row
                v-if="locality"
                :title="$t('sample.latitude')"
                :value="locality.latitude"
              />
              <data-row
                v-if="locality"
                :title="$t('sample.longitude')"
                :value="locality.longitude"
              />
              <link-data-row
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
              <data-row
                v-if="site"
                :title="$t('sample.latitude')"
                :value="site.latitude"
              />
              <data-row
                v-if="site"
                :title="$t('sample.longitude')"
                :value="site.longitude"
              />
              <data-row :title="$t('sample.depth')" :value="sample.depth" />
              <data-row
                :title="$t('sample.depthInterval')"
                :value="sample.depth_interval"
              />
              <link-data-row
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
              <link-data-row
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
              <data-row
                :title="$t('sample.stratigraphyFree')"
                :value="sample.stratigraphy_free"
              />
              <data-row
                :title="$t('sample.stratigraphyBed')"
                :value="sample.stratigraphy_bed"
              />
              <data-row
                :title="$t('sample.dateCollected')"
                :value="sample.date_collected || sample.date_collected_free"
              />
              <data-row
                v-if="agent_collected || sample.agent_collected_txt"
                :title="$t('sample.agentCollected')"
                :value="agent_collected.agent || sample.agent_collected_txt"
              />
              <data-row :title="$t('sample.mass')" :value="sample.mass" />
              <data-row
                v-if="sample_purpose"
                :title="$t('sample.samplePurpose')"
                :value="
                  $translate({
                    et: sample_purpose.value,
                    en: sample_purpose.value_en,
                  })
                "
              />
              <data-row
                :title="$t('sample.rock')"
                :value="
                  $translate({
                    et: sample.rock,
                    en: sample.rock_en,
                  })
                "
              />
              <data-row
                v-if="classification_rock"
                :title="$t('sample.classificationRock')"
                :value="
                  $translate({
                    et: classification_rock.name,
                    en: classification_rock.name_en,
                  })
                "
              />
              <data-row
                :title="$t('sample.palaeontology')"
                :value="sample.palaeontology"
              />
              <data-row :title="$t('sample.fossils')" :value="sample.fossils" />
              <data-row :title="$t('sample.remarks')" :value="sample.remarks" />
              <data-row
                v-if="owner"
                :title="$t('sample.owner')"
                :value="owner.agent"
              />
              <link-data-row
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
              <data-row
                v-if="project"
                :title="$t('sample.project')"
                :value="
                  $translate({
                    et: sample.project.name,
                    en: sample.project.name_en,
                  })
                "
              />
              <data-row
                v-if="sample.date_added"
                :title="$t('sample.dateAdded')"
                :value="$formatDate(sample.date_added)"
              />
              <data-row
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
              <link-data-row
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
              </link-data-row>
              <data-row
                :title="$t('sample.localityFree')"
                :value="sample.locality_free"
              />
              <data-row
                v-if="locality.country"
                :title="$t('locality.country')"
                :value="
                  $translate({
                    et: locality.country.value,
                    en: locality.country.value_en,
                  })
                "
              />
              <data-row
                :title="$t('locality.latitude')"
                :value="locality.latitude"
              />
              <data-row
                :title="$t('locality.longitude')"
                :value="locality.longitude"
              />
              <data-row
                :title="$t('locality.elevation')"
                :value="locality.elevation"
              />
              <data-row :title="$t('locality.depth')" :value="locality.depth" />
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
      <v-card v-if="filteredTabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isEmpty, isNil } from 'lodash'
import slugify from 'slugify'

import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Tabs from '~/components/Tabs.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import Detail from '~/components/templates/Detail.vue'

export default {
  components: {
    TitleCardDetail,
    LinkDataRow,
    DataRow,
    Tabs,
    LeafletMap,
    Detail,
  },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
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

      const localityGroupedResponse =
        await app.$services.sarvSolr.getResourceList('analysis', {
          useRawSolr: true,
          defaultParams: {
            fq: `sample_id:${sample?.id}`,
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
      const locations = localities.concat(sites)

      const tabs = [
        {
          id: 'analysis',
          isSolr: true,
          routeName: 'sample-id-slug',
          title: 'sample.analyses',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'preparation',
          isSolr: true,
          routeName: 'sample-id-slug-preparations',
          title: 'sample.preparations',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'taxon_list',
          routeName: 'sample-id-slug-taxa',
          title: 'sample.taxa',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'attachment_link',
          routeName: 'sample-id-slug-attachments',
          title: 'sample.attachments',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'sample_reference',
          routeName: 'sample-id-slug-references',
          title: 'sample.sampleReferences',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'analysis_results',
          isSolr: true,
          routeName: 'sample-id-slug-analysis-results',
          title: 'sample.analysisResults',
          count: 0,
          props: { sample: sample.id },
        },
        {
          table: 'taxon_list',
          id: 'graphs',
          routeName: 'sample-id-slug-graphs',
          title: 'locality.graphs',
          count: 0,
          props: {
            sample: sample.id,
            sampleObject: { ...sample },
          },
        },
      ]

      const hydratedTabs = await Promise.all(
        tabs.map(
          async (tab) =>
            await app.$hydrateCount(tab, {
              solr: { default: { fq: `sample_id:${sample.id}` } },
              api: { default: { sample: sample.id } },
            })
        )
      )
      const name = `${
        sample.number || sample.number_additional || sample.number_field
      }`.trim()
      // NOTE: Sample 115823 has number = " ", so slug fallback is the id of the sample
      const slug = slugify(`${isEmpty(name) ? sample.id : name}`, {
        lower: true,
      })
      const slugRoute = app.localeRoute({
        ...route,
        name: app.getRouteBaseName().includes('-slug')
          ? app.getRouteBaseName()
          : `${app.getRouteBaseName()}-slug`,
        params: {
          ...route.params,
          slug,
        },
      })

      const validPath = app.$validateTabRoute(slugRoute, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)

      return {
        sample,
        ids,
        initActiveTab: validPath,
        tabs: hydratedTabs,
        locations,
      }
    } catch (err) {
      error({
        message: `Could not find sample ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.title,
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
