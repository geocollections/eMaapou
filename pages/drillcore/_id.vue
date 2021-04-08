<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{
          $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
        }}
      </h1>
      <prev-next-nav :ids="ids" />
      <v-card flat tile>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('common.general') }}</v-card-title>
            <v-card-text>
              <v-simple-table dense class="custom-table">
                <template #default>
                  <tbody>
                    <data-row
                      :title="$t('drillcore.name')"
                      :value="
                        $translate({
                          et: drillcore.drillcore,
                          en: drillcore.drillcore_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('drillcore.boxes')"
                      :value="drillcore.boxes"
                    />
                    <data-row
                      :title="$t('drillcore.boxNumbers')"
                      :value="drillcore.box_numbers"
                    />
                    <data-row
                      :title="$t('drillcore.repository')"
                      :value="
                        $translate({
                          et: drillcore.depository__value,
                          en: drillcore.depository__value_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('drillcore.storage')"
                      :value="drillcore.storage__location"
                    />
                    <data-row
                      :title="$t('drillcore.driller')"
                      :value="drillcore.agent__agent"
                    />
                    <data-row
                      :title="$t('drillcore.year')"
                      :value="drillcore.year"
                    />
                    <data-row
                      :title="$t('drillcore.metersInBox')"
                      :value="drillcore.number_meters"
                    />
                    <data-row
                      :title="$t('drillcore.id')"
                      :value="drillcore.id"
                    />
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <div v-if="drillcore.remarks">
              <v-card-title>{{ $t('drillcore.remarks') }}</v-card-title>
              <v-card-text>{{ drillcore.remarks }}</v-card-text>
            </div>
          </v-col>
          <v-col v-if="drillcore.locality_id" cols="12" md="6">
            <v-card-title>{{ $t('locality.locality') }}</v-card-title>
            <v-card-text>
              <v-simple-table dense class="mb-4 custom-table">
                <template #default>
                  <tbody>
                    <link-data-row
                      :title="$t('locality.locality')"
                      :value="
                        $translate({
                          et: drillcore.locality__locality,
                          en: drillcore.locality__locality_en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'locality-id',
                          params: { id: drillcore.locality_id },
                        })
                      "
                    />
                    <data-row
                      :title="$t('locality.country')"
                      :value="
                        $translate({
                          et: drillcore.locality__country__value,
                          en: drillcore.locality__country__value_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('locality.latitude')"
                      :value="drillcore.locality__latitude"
                    />
                    <data-row
                      :title="$t('locality.longitude')"
                      :value="drillcore.locality__longitude"
                    />
                    <data-row
                      :title="$t('locality.elevation')"
                      :value="drillcore.locality__elevation"
                    />
                    <data-row
                      :title="$t('locality.depth')"
                      :value="drillcore.locality__depth"
                    />
                  </tbody>
                </template>
              </v-simple-table>
              <v-card
                v-if="
                  drillcore.locality__latitude && drillcore.locality__longitude
                "
                id="map-wrap"
                elevation="0"
                height="300"
              >
                <leaflet-map
                  :is-estonian="drillcore.locality__country__value === 'Eesti'"
                  :height="300"
                  :center="{
                    latitude: drillcore.locality__latitude,
                    longitude: drillcore.locality__longitude,
                  }"
                  :markers="[
                    {
                      latitude: drillcore.locality__latitude,
                      longitude: drillcore.locality__longitude,
                      text: $translate({
                        et: drillcore.locality__locality,
                        en: drillcore.locality__locality_en,
                      }),
                    },
                  ]"
                />
              </v-card>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-6 mx-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isEmpty, isNull } from 'lodash'
import LeafletMap from '@/components/LeafletMap'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import PrevNextNav from '~/components/PrevNextNav'

export default {
  components: { PrevNextNav, Tabs, LeafletMap, DataRow, LinkDataRow },
  async asyncData({ params, route, error, app }) {
    try {
      const drillcoreResponse = await app.$services.sarvREST.getResource(
        'drillcore',
        params.id
      )
      const ids = drillcoreResponse?.ids
      const drillcore = drillcoreResponse.results[0]

      const tabs = [
        {
          routeName: 'drillcore-id',
          title: 'drillcore.drillcoreBoxesTitle',
          count: drillcore?.boxes || 0,
          props: { drillcore: drillcore.id },
        },
        {
          id: 'locality_description',
          routeName: 'drillcore-id-descriptions',
          title: 'drillcore.localityDescriptions',
          count: 0,
          props: {},
        },
        {
          id: 'locality_reference',
          routeName: 'drillcore-id-references',
          title: 'drillcore.localityReferences',
          count: 0,
          props: {},
        },
        {
          id: 'attachment_link',
          routeName: 'drillcore-id-attachments',
          title: 'drillcore.attachments',
          count: 0,
          props: {},
        },
        {
          id: 'sample',
          isSolr: true,
          routeName: 'drillcore-id-samples',
          title: 'drillcore.samples',
          count: 0,
          props: {},
        },
        {
          id: 'analysis',
          isSolr: true,
          routeName: 'drillcore-id-analyses',
          title: 'drillcore.analyses',
          count: 0,
          props: {},
        },
        {
          id: 'specimen',
          isSolr: true,
          routeName: 'drillcore-id-specimens',
          title: 'drillcore.specimens',
          count: 0,
          props: {},
        },
      ]

      return {
        drillcore,
        ids,
        initActiveTab: route.path,
        tabs: drillcore?.locality_id
          ? (
              await Promise.all(
                tabs.map(
                  async (tab) =>
                    await app.$hydrateCount(tab, {
                      solr: {
                        default: {
                          fq: `locality_id :${drillcore.locality_id}`,
                        },
                      },
                      api: {
                        default: { locality: drillcore.locality_id },
                        attachment_link: {
                          or_search: `drillcore:${drillcore.id};locality:${drillcore.locality_id}`,
                        },
                      },
                    })
                )
              )
            ).map((tab) =>
              app.$populateProps(tab, {
                ...tab.props,
                locality: drillcore.locality_id,
              })
            )
          : tabs,
      }
    } catch (err) {
      error({
        message: `Could not find drillcore ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.drillcore.drillcore,
        en: this.drillcore.drillcore_en,
      }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
  },
  methods: {
    isEmpty,
    isNull,
  },
}
</script>
