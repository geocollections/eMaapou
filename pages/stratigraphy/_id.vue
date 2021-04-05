<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{
          $translate({
            et: stratigraphy.stratigraphy,
            en: stratigraphy.stratigraphy_en,
          })
        }}
      </h1>
      <prev-next-nav />
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
                          params: { id: stratigraphy.parent__id },
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
                            id:
                              stratigraphy.age_chronostratigraphy__stratigraphy_id,
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
                        <div v-html="stratigraphy.index_main_html" />
                      </template>
                    </data-row>
                    <data-row :title="$t('stratigraphy.indexAlt')">
                      <template #value>
                        <div v-html="stratigraphy.index_main_html" />
                      </template>
                    </data-row>
                  </tbody>
                </template>
              </v-simple-table>
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
// import LeafletMap from '@/components/LeafletMap'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import PrevNextNav from '~/components/PrevNextNav'

export default {
  components: { PrevNextNav, Tabs, LinkDataRow, DataRow },
  async asyncData({ params, route, error, app }) {
    try {
      const stratigraphyResponse = await app.$services.sarvREST.getResource(
        'stratigraphy',
        params.id
      )
      const stratigraphy = stratigraphyResponse.results[0]

      const tabs = [
        {
          id: 'stratigraphy_reference',
          routeName: 'stratigraphy-id',
          title: 'stratigraphy.references',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
          fields: 'reference_id',
        },
        {
          id: 'stratigraphy_stratotype',
          routeName: 'stratigraphy-id-stratotypes',
          title: 'stratigraphy.stratotypes',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
        {
          id: 'stratigraphy_synonym',
          routeName: 'stratigraphy-id-synonyms',
          title: 'stratigraphy.synonyms',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
        {
          id: 'stratigraphy',
          routeName: 'stratigraphy-id-lithostratigraphy',
          title: 'stratigraphy.lithostratigraphy',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
      ]

      return {
        stratigraphy,
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
                  stratigraphy: {
                    age_chronostratigraphy_id: stratigraphy.id,
                  },
                },
                fields: tab.fields ?? 'id',
              })
          )
        ),
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
        et: this.stratigraphy.stratigraphy,
        en: this.stratigraphy.stratigraphy_en,
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
