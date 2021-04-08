<template>
  <v-row>
    <v-col>
      <prev-next-nav-title
        :ids="ids"
        :title="
          $translate({
            et: stratigraphy.stratigraphy,
            en: stratigraphy.stratigraphy_en,
          })
        "
      />
      <v-card flat tile>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('common.general') }}</v-card-title>
            <v-card-text>
              <v-simple-table dense class="custom-table">
                <template #default>
                  <tbody>
                    <link-data-row
                      :title="$t('stratigraphy.parentStratigraphy')"
                      :value="
                        $translate({
                          et: stratigraphy.parent__stratigraphy,
                          en: stratigraphy.parent__stratigraphy_en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'stratigraphy-id',
                          params: { id: stratigraphy.parent_id },
                        })
                      "
                    />
                    <data-row
                      :title="$t('stratigraphy.type')"
                      :value="
                        $translate({
                          et: stratigraphy.type__value,
                          en: stratigraphy.type__value_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('stratigraphy.rank')"
                      :value="
                        $translate({
                          et: stratigraphy.rank__value,
                          en: stratigraphy.rank__value_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('stratigraphy.scope')"
                      :value="
                        $translate({
                          et: stratigraphy.scope__value,
                          en: stratigraphy.scope__value_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('stratigraphy.status')"
                      :value="
                        $translate({
                          et: stratigraphy.status__value,
                          en: stratigraphy.status__value_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('stratigraphy.author')"
                      :value="stratigraphy.author_free"
                    />
                    <data-row
                      :title="$t('stratigraphy.year')"
                      :value="stratigraphy.year"
                    />
                    <data-row
                      :title="$t('stratigraphy.etymon')"
                      :value="
                        $translate({
                          et: stratigraphy.etymon,
                          en: stratigraphy.etymon_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('stratigraphy.originalLocality')"
                      :value="stratigraphy.original_locality"
                    />
                    <data-row
                      :title="$t('stratigraphy.ageTop')"
                      :value="stratigraphy.age_top"
                    />
                    <data-row
                      :title="$t('stratigraphy.ageBase')"
                      :value="stratigraphy.age_base"
                    />
                    <link-data-row
                      :title="$t('stratigraphy.age')"
                      :value="
                        $translate({
                          et: stratigraphy.age_chronostratigraphy__stratigraphy,
                          en:
                            stratigraphy.age_chronostratigraphy__stratigraphy_en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'stratigraphy-id',
                          params: {
                            id: stratigraphy.age_chronostratigraphy_id,
                          },
                        })
                      "
                    />
                    <data-row
                      :title="$t('stratigraphy.ageReference')"
                      :value="stratigraphy.age_reference__reference"
                    />

                    <data-row :title="$t('stratigraphy.index')">
                      <template #value>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <div v-html="stratigraphy.index_main_html" />
                      </template>
                    </data-row>
                    <data-row :title="$t('stratigraphy.indexAlt')">
                      <template #value>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <div v-html="stratigraphy.index_additional_html" />
                      </template>
                    </data-row>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-col>
          <v-col v-if="stratotypeCount > 0" cols="12" md="6">
            <v-card-title>{{ $t('stratigraphy.stratotypes') }}</v-card-title>
            <v-card-text>
              <stratigraphy-stratotype-table
                only-table
                :items="stratotypes"
                :count="stratotypeCount"
                :options="options"
                class="mb-2"
              />
              <v-card id="map-wrap" elevation="0" height="300">
                <leaflet-map
                  :is-estonian="
                    stratotypes[0].locality__country__value === 'Eesti'
                  "
                  :height="300"
                  :markers="stratigraphyMarkers"
                />
              </v-card>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-6 mx-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
      <v-card
        v-if="
          $translate({
            et: stratigraphy.description,
            en: stratigraphy.description_en,
          })
        "
        flat
        tile
      >
        <v-row no-gutters>
          <v-col cols="12">
            <v-card-title>{{ $t('common.description') }}</v-card-title>

            <!-- eslint-disable vue/no-v-html -->
            <v-card-text
              v-html="
                $translate({
                  et: stratigraphy.description,
                  en: stratigraphy.description_en,
                })
              "
            />
            <!-- eslint-enable -->
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isEmpty, isNull, isNil } from 'lodash'
import LeafletMap from '@/components/map/LeafletMap'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import StratigraphyStratotypeTable from '~/components/tables/StratigraphyStratotypeTable'
import { STRATOTYPE } from '~/constants'

export default {
  components: {
    PrevNextNavTitle,
    Tabs,
    LinkDataRow,
    DataRow,
    StratigraphyStratotypeTable,
    LeafletMap,
  },
  async asyncData({ params, route, error, app }) {
    try {
      const stratigraphyResponse = await app.$services.sarvREST.getResource(
        'stratigraphy',
        params.id,
        {
          params: {
            fields:
              'age_base,age_chronostratigraphy__stratigraphy,age_chronostratigraphy__stratigraphy_en,age_chronostratigraphy_id,age_reference__id,age_reference__reference,age_top,author_free,description,description_en,etymon,etymon_en,id,index_additional,index_additional_html,index_main,index_main_html,original_locality,parent__stratigraphy,parent__stratigraphy_en,parent_id,rank__value,rank__value_en,region,region_en,remarks,scope__value,scope__value_en,status__value,status__value_en,stratigraphy,stratigraphy_en,type__value,type__value_en,year',
          },
        }
      )
      const ids = stratigraphyResponse?.ids
      const stratigraphy = stratigraphyResponse.results[0]

      const tabs = [
        {
          id: 'stratigraphy_reference',
          table: 'stratigraphy_reference',
          routeName: 'stratigraphy-id',
          title: 'stratigraphy.references',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
          fields: 'reference_id',
        },
        {
          id: 'stratigraphy_synonym',
          table: 'stratigraphy_synonym',
          routeName: 'stratigraphy-id-synonyms',
          title: 'stratigraphy.synonyms',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
        {
          id: 'lithostratigraphy',
          table: 'stratigraphy',
          routeName: 'stratigraphy-id-lithostratigraphy',
          title: 'stratigraphy.lithostratigraphy',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
        {
          id: 'subunits',
          table: 'stratigraphy',
          routeName: 'stratigraphy-id-subunits',
          title: 'stratigraphy.subUnits',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
        {
          id: 'specimen',
          table: 'specimen',
          routeName: 'stratigraphy-id-specimens',
          title: 'stratigraphy.specimens',
          isSolr: true,
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
        {
          id: 'sample',
          table: 'sample',
          routeName: 'stratigraphy-id-samples',
          title: 'stratigraphy.samples',
          isSolr: true,
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
      ]

      const stratotypeResponse = await app.$services.sarvREST.getResourceList(
        'stratigraphy_stratotype',
        {
          ...STRATOTYPE.options,
          isValid: isNil(stratigraphy.id),
          defaultParams: {
            stratigraphy__id: stratigraphy.id,
          },
          queryFields: app.$getQueryFields(STRATOTYPE.queryFields),
        }
      )
      const stratotypes = stratotypeResponse.items
      const stratotypeCount = stratotypeResponse.count

      return {
        stratigraphy,
        stratotypes,
        stratotypeCount,
        ids,
        initActiveTab: route.path,
        tabs: await Promise.all(
          tabs.map(
            async (tab) =>
              await app.$hydrateCount(tab, {
                api: {
                  default: {
                    stratigraphy: stratigraphy.id,
                  },
                  stratigraphy_stratotype: {
                    stratigraphy__id: stratigraphy.id,
                  },
                  stratigraphy_synonym: {
                    stratigraphy__id: stratigraphy.id,
                  },
                  lithostratigraphy: {
                    age_chronostratigraphy_id: stratigraphy.id,
                  },
                  subunits: {
                    parent_id: stratigraphy.id,
                  },
                },
                solr: {
                  default: {
                    fq: `stratigraphy_id:${stratigraphy.id}`,
                  },
                },
                fields: tab.fields ?? 'id',
              })
          )
        ),
      }
    } catch (err) {
      error({
        message: `Could not find stratigraphy ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      options: STRATOTYPE.options,
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.stratigraphy.stratigraphy,
        en: this.stratigraphy.stratigraphy_en,
      }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    stratigraphyMarkers() {
      return this.stratotypes?.map((stratotype) => {
        return {
          latitude: stratotype.locality__latitude,
          longitude: stratotype.locality__longitude,
          text: `${this.$translate({
            et: stratotype.locality__locality,
            en: stratotype.locality__locality_en,
          })} (${this.$translate({
            et: stratotype.stratotype_type__value,
            en: stratotype.stratotype_type__value_en,
          })})`,
        }
      })
    },
  },
  methods: {
    isEmpty,
    isNull,
  },
}
</script>
