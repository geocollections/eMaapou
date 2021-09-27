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
                v-if="stratigraphy.parent"
                :title="$t('stratigraphy.parentStratigraphy')"
                :value="
                  $translate({
                    et: stratigraphy.parent.stratigraphy,
                    en: stratigraphy.parent.stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: stratigraphy.parent.id },
                  })
                "
              />
              <data-row
                v-if="stratigraphy.type"
                :title="$t('stratigraphy.type')"
                :value="
                  $translate({
                    et: stratigraphy.type.value,
                    en: stratigraphy.type.value_en,
                  })
                "
              />
              <data-row
                v-if="stratigraphy.rank"
                :title="$t('stratigraphy.rank')"
                :value="
                  $translate({
                    et: stratigraphy.rank.value,
                    en: stratigraphy.rank.value_en,
                  })
                "
              />
              <data-row
                v-if="stratigraphy.scope"
                :title="$t('stratigraphy.scope')"
                :value="
                  $translate({
                    et: stratigraphy.scope.value,
                    en: stratigraphy.scope.value_en,
                  })
                "
              />
              <data-row
                v-if="stratigraphy.status"
                :title="$t('stratigraphy.status')"
                :value="
                  $translate({
                    et: stratigraphy.status.value,
                    en: stratigraphy.status.value_en,
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
                v-if="stratigraphy.age_chronostratigraphy"
                :title="$t('stratigraphy.age')"
                :value="
                  $translate({
                    et: stratigraphy.age_chronostratigraphy.stratigraphy,
                    en: stratigraphy.age_chronostratigraphy.stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: {
                      id: stratigraphy.age_chronostratigraphy.id,
                    },
                  })
                "
              />
              <data-row
                v-if="stratigraphy.age_reference"
                :title="$t('stratigraphy.ageReference')"
                :value="stratigraphy.age_reference.reference"
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
                :value="$formatDate(stratigraphy.date_added)"
              />
              <data-row
                v-if="stratigraphy.date_changed"
                :title="$t('stratigraphy.dateChanged')"
                :value="$formatDate(stratigraphy.date_changed)"
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
    <template
      v-if="stratotypeCount > 0 || stratigraphyMarkers > 0"
      #column-right
    >
      <v-card-title class="subsection-title">{{
        $t('stratigraphy.stratotypes')
      }}</v-card-title>
      <v-card-text>
        <stratigraphy-stratotype-table
          v-if="stratotypeCount > 0"
          only-table
          :items="stratotypes"
          :count="stratotypeCount"
          :options="options"
          class="mb-2"
        />
        <v-card
          v-if="stratigraphyMarkers.length > 0"
          id="map-wrap"
          elevation="0"
        >
          <leaflet-map
            rounded
            :estonian-map="mapIsEstonian"
            :estonian-bedrock-overlay="mapIsEstonian"
            height="300px"
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
import { STRATOTYPE, TABS_STRATIGRAPHY, HEADERS_STRATOTYPE } from '~/constants'
import LeafletMap from '~/components/map/LeafletMap.vue'
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import StratigraphyStratotypeTable from '~/components/tables/StratigraphyStratotypeTable.vue'
import Detail from '~/components/templates/Detail.vue'
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
  async asyncData({
    params,
    route,
    error,
    redirect,
    $validateTabRoute,
    $services,
    $hydrateTab,
    $translate,
    $createSlugRoute,
    $getSortValues,
  }) {
    try {
      const stratigraphyResponse = await $services.sarvREST.getResource(
        'stratigraphy',
        params.id,
        {
          params: {
            nest: 1,
            // fields:
            //   'age_base,age_chronostratigraphy__stratigraphy,age_chronostratigraphy__stratigraphy_en,age_chronostratigraphy_id,age_reference__id,age_reference__reference,age_top,author_free,description,description_en,etymon,etymon_en,id,index_additional,index_additional_html,index_main,index_main_html,original_locality,parent__stratigraphy,parent__stratigraphy_en,parent_id,rank__value,rank__value_en,region,region_en,remarks,scope__value,scope__value_en,status__value,status__value_en,stratigraphy,stratigraphy_en,type__value,type__value_en,year,hierarchy_string,date_added,date_changed',
          },
        }
      )
      const ids = stratigraphyResponse?.ids
      const stratigraphy = stratigraphyResponse

      const stratotypeResponse = await $services.sarvREST.getResourceList(
        'stratigraphy_stratotype',
        {
          ...STRATOTYPE.options,
          isValid: isNil(stratigraphy.id),
          defaultParams: {
            stratigraphy: stratigraphy.id,
            nest: 2,
          },
          queryFields: $getSortValues(HEADERS_STRATOTYPE),
        }
      )
      const stratotypes = stratotypeResponse.items
      const stratotypeCount = stratotypeResponse.count

      const tabsObject = TABS_STRATIGRAPHY

      tabsObject.byIds.specimen.props.stratigraphy = stratigraphy
      tabsObject.byIds.sample.props.stratigraphy = stratigraphy

      const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

      const hydratedTabs = await Promise.all(
        tabs.map(
          async (tab) =>
            await $hydrateTab(tab, {
              countParams: {
                api: {
                  default: {
                    stratigraphy: stratigraphy.id,
                  },
                  stratigraphy_stratotype: {
                    stratigraphy: stratigraphy.id,
                  },
                  stratigraphy_synonym: {
                    stratigraphy: stratigraphy.id,
                  },
                },
                solr: {
                  default: {
                    fq: stratigraphy.hierarchy_string
                      ? `(stratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*) OR age_hierarchy:(${stratigraphy.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${stratigraphy.hierarchy_string}*))`
                      : `(stratigraphy_hierarchy:("") OR age_hierarchy:("") OR lithostratigraphy_hierarchy:(""))`,
                    // fq: `stratigraphy_id:${stratigraphy.id}`,
                  },
                  lithostratigraphy: {
                    fq: `age_chronostratigraphy:${stratigraphy.id}`,
                  },
                  subunits: {
                    fq: `parent_id:${stratigraphy.id}`,
                  },
                },
                fields: tab.fields ?? 'id',
              },
            })
        )
      )

      const slugRoute = $createSlugRoute(
        route,
        $translate({
          et: stratigraphy.stratigraphy,
          en: stratigraphy.stratigraphy_en,
        })
      )

      const validPath = $validateTabRoute(slugRoute, hydratedTabs)
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
      return this.stratotypes?.reduce((prev, stratotype) => {
        if (stratotype.locality) {
          prev.push({
            latitude: stratotype?.locality?.latitude,
            longitude: stratotype?.locality?.longitude,
            text: `${this.$translate({
              et: stratotype?.locality?.locality,
              en: stratotype?.locality?.locality_en,
            })} (${this.$translate({
              et: stratotype?.stratotype_type?.value,
              en: stratotype?.stratotype_type?.value_en,
            })})`,
          })
        }
        return prev
      }, [])
    },
    mapIsEstonian() {
      if (this.stratotypes?.length > 0) {
        return this.stratotypes.some(
          (item) => item?.locality?.country?.value_en === 'Estonia'
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
