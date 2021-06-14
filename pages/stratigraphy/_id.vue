<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="
          $translate({
            et: stratigraphy.stratigraphy,
            en: stratigraphy.stratigraphy_en,
          })
        "
        class="title-stratigraphy"
      />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <link-data-row
                v-if="stratigraphy.parent_id"
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
                v-if="stratigraphy.age_chronostratigraphy_id"
                :title="$t('stratigraphy.age')"
                :value="
                  $translate({
                    et: stratigraphy.age_chronostratigraphy__stratigraphy,
                    en: stratigraphy.age_chronostratigraphy__stratigraphy_en,
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

              <data-row
                v-if="stratigraphy.index_main_html"
                :title="$t('stratigraphy.index')"
              >
                <template #value>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div v-html="stratigraphy.index_main_html" />
                </template>
              </data-row>
              <data-row
                v-if="stratigraphy.index_additional_html"
                :title="$t('stratigraphy.indexAlt')"
              >
                <template #value>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div v-html="stratigraphy.index_additional_html" />
                </template>
              </data-row>
              <data-row
                v-if="stratigraphy.date_added"
                :title="$t('stratigraphy.dateAdded')"
                :value="
                  new Date(stratigraphy.date_added).toISOString().split('T')[0]
                "
              />
              <data-row
                v-if="stratigraphy.date_changed"
                :title="$t('stratigraphy.dateChanged')"
                :value="
                  new Date(stratigraphy.date_changed)
                    .toISOString()
                    .split('T')[0]
                "
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
    <template v-if="stratotypeCount > 0" #column-right>
      <v-card-title class="subsection-title">{{
        $t('stratigraphy.stratotypes')
      }}</v-card-title>
      <v-card-text>
        <stratigraphy-stratotype-table
          only-table
          :items="stratotypes"
          :count="stratotypeCount"
          :options="options"
          class="mb-2"
        />
        <v-card id="map-wrap" elevation="0">
          <leaflet-map
            rounded
            :estonian-map="mapIsEstonian"
            :estonian-bedrock-overlay="mapIsEstonian"
            :height="300"
            :markers="stratigraphyMarkers"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="filteredTabs.length > 0" class="mt-4 mb-4">
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
            <v-card-title class="subsection-title">{{
              $t('common.description')
            }}</v-card-title>

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
    </template>
  </detail>
</template>

<script>
import { isEmpty, isNull, isNil } from 'lodash'
import LeafletMap from '@/components/map/LeafletMap'
import TitleCardDetail from '@/components/TitleCardDetail'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import StratigraphyStratotypeTable from '~/components/tables/StratigraphyStratotypeTable'
import { STRATOTYPE } from '~/constants'
import Detail from '~/components/templates/Detail'
export default {
  components: {
    TitleCardDetail,
    Tabs,
    LinkDataRow,
    DataRow,
    StratigraphyStratotypeTable,
    LeafletMap,
    Detail,
  },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const stratigraphyResponse = await app.$services.sarvREST.getResource(
        'stratigraphy',
        params.id,
        {
          params: {
            fields:
              'age_base,age_chronostratigraphy__stratigraphy,age_chronostratigraphy__stratigraphy_en,age_chronostratigraphy_id,age_reference__id,age_reference__reference,age_top,author_free,description,description_en,etymon,etymon_en,id,index_additional,index_additional_html,index_main,index_main_html,original_locality,parent__stratigraphy,parent__stratigraphy_en,parent_id,rank__value,rank__value_en,region,region_en,remarks,scope__value,scope__value_en,status__value,status__value_en,stratigraphy,stratigraphy_en,type__value,type__value_en,year,hierarchy_string,date_added,date_changed',
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
          id: 'subunits',
          table: 'stratigraphy',
          routeName: 'stratigraphy-id-subunits',
          title: 'stratigraphy.subUnits',
          count: 0,
          props: { stratigraphy: stratigraphy.id },
        },
        {
          id: 'lithostratigraphy',
          table: 'stratigraphy',
          routeName: 'stratigraphy-id-relatedUnits',
          title: 'stratigraphy.relatedUnits',
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
          props: { stratigraphy },
        },
        {
          id: 'sample',
          table: 'sample',
          routeName: 'stratigraphy-id-samples',
          title: 'stratigraphy.samples',
          isSolr: true,
          count: 0,
          props: { stratigraphy },
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

      const hydratedTabs = await Promise.all(
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
                  fq: stratigraphy.hierarchy_string
                    ? `(stratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*)+OR+age_hierarchy:(${stratigraphy.hierarchy_string}*)+OR+lithostratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*))`
                    : `(stratigraphy_hierarchy:("")+OR+age_hierarchy:("")+OR+lithostratigraphy_hierarchy:(""))`,
                  // fq: `stratigraphy_id:${stratigraphy.id}`,
                },
              },
              fields: tab.fields ?? 'id',
            })
        )
      )

      const validPath = app.$validateTabRoute(route, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)

      return {
        stratigraphy,
        stratotypes,
        stratotypeCount,
        ids,
        initActiveTab: validPath,
        tabs: hydratedTabs,
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
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$translate({
            et: this.stratigraphy.stratigraphy,
            en: this.stratigraphy.stratigraphy_en,
          }),
        },
      ],
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
    mapIsEstonian() {
      if (this.stratotypes?.length > 0) {
        return this.stratotypes.some(
          (item) => item.locality__country__value_en === 'Estonia'
        )
      }
      return false
    },
  },
  methods: {
    isEmpty,
    isNull,
  },
}
</script>
