<template>
  <detail>
    <template #title>
      <prev-next-nav-title :ids="ids" :title="sampleTitle" />
    </template>
    <template #column-left>
      <v-card-title>{{ $t('common.general') }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row :title="$t('sample.number')" :value="sample.number" />
              <data-row
                :title="$t('sample.numberAdditional')"
                :value="sample.number_additional"
              />
              <data-row
                :title="$t('sample.numberField')"
                :value="sample.number_field"
              />
              <link-data-row
                :title="$t('sample.locality')"
                :value="
                  $translate({
                    et: sample.locality__locality,
                    en: sample.locality__locality_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'locality-id',
                    params: { id: sample.locality_id },
                  })
                "
              />
              <data-row
                :title="$t('sample.latitude')"
                :value="sample.locality__latitude"
              />
              <data-row
                :title="$t('sample.longitude')"
                :value="sample.locality__longitude"
              />
              <link-data-row
                :title="$t('sample.site')"
                :value="sample.site__name"
                nuxt
                :href="
                  localePath({
                    name: 'site-id',
                    params: { id: sample.site },
                  })
                "
              />
              <data-row
                :title="$t('sample.latitude')"
                :value="sample.site__latitude"
              />
              <data-row
                :title="$t('sample.longitude')"
                :value="sample.site__longitude"
              />
              <data-row :title="$t('sample.depth')" :value="sample.depth" />
              <data-row
                :title="$t('sample.depthInterval')"
                :value="sample.depth_interval"
              />
              <link-data-row
                :title="$t('sample.stratigraphy')"
                :value="
                  $translate({
                    et: sample.stratigraphy__stratigraphy,
                    en: sample.stratigraphy__stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: sample.stratigraphy__id },
                  })
                "
              />
              <link-data-row
                :title="$t('sample.lithostratigraphy')"
                :value="
                  $translate({
                    et: sample.lithostratigraphy__stratigraphy,
                    en: sample.lithostratigraphy__stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: sample.lithostratigraphy },
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
                :title="$t('sample.agentCollected')"
                :value="
                  sample.agent_collected__agent || sample.agent_collected_txt
                "
              />
              <data-row :title="$t('sample.mass')" :value="sample.mass" />
              <data-row
                :title="$t('sample.samplePurpose')"
                :value="
                  $translate({
                    et: sample.sample_purpose__value,
                    en: sample.sample_purpose__value_en,
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
                :title="$t('sample.classificationRock')"
                :value="
                  $translate({
                    et: sample.classification_rock__name,
                    en: sample.classification_rock__name_en,
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
                :title="$t('sample.owner')"
                :value="sample.owner__agent"
              />
              <data-row
                :title="$t('sample.database')"
                :value="
                  $translate({
                    et: sample.database__name,
                    en: sample.database__name_en,
                  })
                "
              />
              <data-row
                v-if="sample.date_added"
                :title="$t('sample.dateAdded')"
                :value="new Date(sample.date_added).toISOString().split('T')[0]"
              />
              <data-row
                v-if="sample.date_changed"
                :title="$t('sample.dateChanged')"
                :value="
                  new Date(sample.date_changed).toISOString().split('T')[0]
                "
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>

    <template v-if="sample.locality_id" #column-right>
      <v-card-title>{{ $t('locality.locality') }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="mb-4 custom-table">
          <template #default>
            <tbody>
              <tr>
                <td>{{ $t('locality.locality') }}</td>
                <td>
                  <a
                    class="text-link"
                    :href="
                      localePath({
                        name: 'locality-id',
                        params: { id: sample.locality_id },
                      })
                    "
                  >
                    {{
                      $translate({
                        et: sample.locality__locality,
                        en: sample.locality__locality_en,
                      })
                    }}
                  </a>
                </td>
              </tr>
              <data-row
                :title="$t('sample.localityFree')"
                :value="sample.locality_free"
              />
              <tr v-if="sample.locality__country__value">
                <td>{{ $t('locality.country') }}</td>
                <td
                  v-if="
                    isNil(
                      $translate({
                        et: sample.locality__country__value,
                        en: sample.locality__country__value_en,
                      })
                    )
                  "
                  class="no-value"
                >
                  {{ $t('common.noValue') }}
                </td>
                <td v-else>
                  {{
                    $t('locality.countryFormat', {
                      name: $translate({
                        et: sample.locality__country__value,
                        en: sample.locality__country__value_en,
                      }),
                      iso: sample.locality__country__iso_code,
                    })
                  }}
                </td>
              </tr>
              <tr>
                <td>{{ $t('locality.latitude') }}</td>
                <td v-if="isNil(sample.locality__latitude)" class="no-value">
                  {{ $t('common.noValue') }}
                </td>
                <td v-else>
                  {{ sample.locality__latitude }}
                </td>
              </tr>

              <tr>
                <td>{{ $t('locality.longitude') }}</td>
                <td v-if="isNil(sample.locality__longitude)" class="no-value">
                  {{ $t('common.noValue') }}
                </td>
                <td v-else>
                  {{ sample.locality__longitude }}
                </td>
              </tr>
              <tr>
                <td>{{ $t('locality.elevation') }}</td>
                <td v-if="isNil(sample.locality__elevation)" class="no-value">
                  {{ $t('common.noValue') }}
                </td>
                <td v-else>
                  {{ sample.locality__elevation }}
                </td>
              </tr>
              <tr>
                <td>{{ $t('locality.depth') }}</td>
                <td v-if="isNil(sample.locality__depth)" class="no-value">
                  {{ $t('common.noValue') }}
                </td>
                <td v-else>
                  {{ sample.locality__depth }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-card
          v-if="sample.locality__latitude && sample.locality__longitude"
          id="map-wrap"
          elevation="0"
        >
          <leaflet-map
            :estonian-map="sample.locality__country__value === 'Eesti'"
            :estonian-bedrock-overlay="
              sample.locality__country__value === 'Eesti'
            "
            :height="300"
            :center="{
              latitude: sample.locality__latitude,
              longitude: sample.locality__longitude,
            }"
            :markers="[
              {
                latitude: sample.locality__latitude,
                longitude: sample.locality__longitude,
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
      <v-card-title>{{ $t('locality.map') }}</v-card-title>
      <v-card-text>
        <v-card elevation="0">
          <leaflet-map rounded :markers="computedLocations" />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="filteredTabs.length > 0" class="mt-6 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isEmpty, isNil } from 'lodash'
import DataRow from '@/components/DataRow'
import LinkDataRow from '@/components/LinkDataRow'
import Tabs from '@/components/Tabs'
import LeafletMap from '@/components/map/LeafletMap'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import Detail from '~/components/templates/Detail'

export default {
  components: {
    PrevNextNavTitle,
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
        params.id
      )
      const ids = detailViewResponse?.ids
      const sample = detailViewResponse.results[0]

      const localityGroupedResponse = await app.$services.sarvSolr.getResourceList(
        'analysis',
        {
          useRawSolr: true,
          defaultParams: {
            fq: `sample_id:${sample?.id}`,
            fl:
              'locality_id,locality,locality_en,latitude,longitude,site_id,name,name_en',
            group: true,
            'group.field': ['locality_id', 'site_id'],
            rows: 10000,
          },
        }
      )

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
          routeName: 'sample-id',
          title: 'sample.analyses',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'preparation',
          routeName: 'sample-id-preparations',
          title: 'sample.preparations',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'taxon_list',
          routeName: 'sample-id-taxa',
          title: 'sample.taxa',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'attachment_link',
          routeName: 'sample-id-attachments',
          title: 'sample.attachments',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'sample_reference',
          routeName: 'sample-id-references',
          title: 'sample.sampleReferences',
          count: 0,
          props: { sample: sample.id },
        },
        {
          id: 'analysis_results',
          isSolr: true,
          routeName: 'sample-id-analysis_results',
          title: 'sample.analysisResults',
          count: 0,
          props: { sample: sample.id },
        },
        {
          table: 'taxon_list',
          id: 'graphs',
          routeName: 'sample-id-graphs',
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

      const validPath = app.$validateTabRoute(route, hydratedTabs)
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
      title:
        this.sample.number ||
        this.sample.number_additional ||
        this.sample.number_field ||
        this.sample.id,
    }
  },
  computed: {
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
          latitude: this.sample.site__latitude,
          longitude: this.sample.site__longitude,
          text: this.sample.site__name,
          routeName: 'site',
          id: this.sample.site_id,
        })
      }

      return locations
    },
  },
  methods: {
    isNil,
  },
}
</script>
