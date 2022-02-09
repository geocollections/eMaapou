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
      <v-card
        v-if="filteredTabs.length > 0 && !$fetchState.pending"
        class="mt-4 mb-4"
      >
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
      <v-card
        v-if="
          $translate({
            et: stratigraphy.description,
            en: stratigraphy.description_en,
          })
        "
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
import Detail from '~/templates/Detail.vue'
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
  async asyncData({ params, route, error, $services }) {
    try {
      const stratigraphyResponse = await $services.sarvREST.getResource(
        'stratigraphy',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = stratigraphyResponse?.ids
      const stratigraphy = stratigraphyResponse

      return {
        stratigraphy,
        ids,
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
      tabs: [],
      initActiveTab: '',
      stratotypes: [],
      stratotypeCount: 0,
    }
  },
  async fetch() {
    const stratotypeResponse = await this.$services.sarvREST.getResourceList(
      'stratigraphy_stratotype',
      {
        ...STRATOTYPE.options,
        isValid: isNil(this.stratigraphy?.id),
        defaultParams: {
          stratigraphy: this.stratigraphy?.id,
          nest: 2,
        },
        fields: this.$getAPIFieldValues(HEADERS_STRATOTYPE),
      }
    )
    this.stratotypes = stratotypeResponse.items
    this.stratotypeCount = stratotypeResponse.count

    const tabsObject = TABS_STRATIGRAPHY

    tabsObject.byIds.specimen.props.stratigraphy = this.stratigraphy
    tabsObject.byIds.sample.props.stratigraphy = this.stratigraphy

    const tabs = tabsObject.allIds.map((id) => tabsObject.byIds[id])

    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            countParams: {
              api: {
                default: {
                  stratigraphy: this.stratigraphy?.id,
                },
                stratigraphy_stratotype: {
                  stratigraphy: this.stratigraphy?.id,
                },
                stratigraphy_synonym: {
                  stratigraphy: this.stratigraphy?.id,
                },
              },
              solr: {
                default: {
                  fq: this.stratigraphy?.hierarchy_string
                    ? `(stratigraphy_hierarchy:(${this.stratigraphy?.hierarchy_string}*) OR age_hierarchy:(${this.stratigraphy?.hierarchy_string}*) OR lithostratigraphy_hierarchy:(${this.stratigraphy?.hierarchy_string}*))`
                    : `(stratigraphy_hierarchy:("") OR age_hierarchy:("") OR lithostratigraphy_hierarchy:(""))`,
                  // fq: `stratigraphy_id:${stratigraphy.id}`,
                },
                lithostratigraphy: {
                  fq: `age_chronostratigraphy:${this.stratigraphy?.id}`,
                },
                subunits: {
                  fq: `parent_id:${this.stratigraphy?.id}`,
                },
              },
              fields: tab.fields ?? 'id',
            },
          })
      )
    )

    const slugRoute = this.$createSlugRoute(
      this.$route,
      this.$translate({
        et: this.stratigraphy?.stratigraphy,
        en: this.stratigraphy?.stratigraphy_en,
      })
    )

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: `${this.$translate({
        et: this.stratigraphy.stratigraphy,
        en: this.stratigraphy.stratigraphy_en,
      })} | ${this.$t('stratigraphy.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.$translate({
            et: this.stratigraphy.stratigraphy,
            en: this.stratigraphy.stratigraphy_en,
          })} | ${this.$t('stratigraphy.pageTitle')}`,
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
