<template>
  <detail>
    <template #title>
      <prev-next-nav-title
        :ids="ids"
        :title="
          $t('analysis.title', {
            method: $translate({
              et: analysis.analysis_method__analysis_method,
              en: analysis.analysis_method__method_en,
            }),
            sample: analysis.sample__number,
          })
        "
        class="title-analysis"
      />
    </template>

    <template #default>
      <v-card>
        <v-row no-gutters justify="center">
          <v-col>
            <v-card-title>{{ $t('common.general') }}</v-card-title>
            <v-card-text>
              <v-simple-table dense class="custom-table">
                <template #default>
                  <tbody>
                    <data-row
                      :title="$t('analysis.method')"
                      :value="
                        $translate({
                          et: analysis.analysis_method__analysis_method,
                          en: analysis.analysis_method__method_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('analysis.analysedBy')"
                      :value="analysis.agent__agent"
                    />

                    <link-data-row
                      :title="$t('analysis.sampleNumber')"
                      :value="analysis.sample__number"
                      nuxt
                      :href="
                        localePath({
                          name: 'sample-id',
                          params: { id: analysis.sample },
                        })
                      "
                    />

                    <data-row
                      :title="$t('analysis.remarks')"
                      :value="analysis.remarks"
                    />
                    <link-data-row
                      :title="$t('analysis.reference')"
                      :value="analysis.reference__reference"
                      @link-click="
                        $openGeology('reference', analysis.reference)
                      "
                    />
                    <data-row
                      :title="$t('analysis.dataset')"
                      :value="
                        $translate({
                          et: analysis.dataset__name,
                          en: analysis.dataset__name__en,
                        })
                      "
                    />
                    <link-data-row
                      :title="$t('analysis.locality')"
                      :value="
                        $translate({
                          et: analysis.sample__locality__locality,
                          en: analysis.sample__locality__locality__en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'locality-id',
                          params: { id: analysis.sample__locality_id },
                        })
                      "
                    />
                    <data-row
                      :title="$t('analysis.depth')"
                      :value="analysis.sample__depth"
                    />
                    <link-data-row
                      :title="$t('analysis.stratigraphy')"
                      :value="
                        $translate({
                          et: analysis.sample__stratigraphy__stratigraphy,
                          en: analysis.sample__stratigraphy__stratigraphy__en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'stratigraphy-id',
                          params: { id: analysis.sample__stratigraphy_id },
                        })
                      "
                    />
                    <link-data-row
                      :title="$t('analysis.lithostratigraphy')"
                      :value="
                        $translate({
                          et: analysis.sample__lithostratigraphy__stratigraphy,
                          en:
                            analysis.sample__lithostratigraphy__stratigraphy__en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'stratigraphy-id',
                          params: { id: analysis.sample__lithostratigraphy_id },
                        })
                      "
                    />
                    <data-row
                      v-if="analysis.date_added"
                      :title="$t('analysis.dateAdded')"
                      :value="
                        new Date(analysis.date_added)
                          .toISOString()
                          .split('T')[0]
                      "
                    />
                    <data-row
                      v-if="analysis.date_changed"
                      :title="$t('analysis.dateChanged')"
                      :value="
                        new Date(analysis.date_changed)
                          .toISOString()
                          .split('T')[0]
                      "
                    />
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
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
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Tabs from '~/components/Tabs'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import Detail from '~/components/templates/Detail.vue'
export default {
  components: { PrevNextNavTitle, DataRow, LinkDataRow, Tabs, Detail },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const analysisResponse = await app.$services.sarvREST.getResource(
        'analysis',
        params.id,
        {
          params: {
            fields:
              'agent__agent,analysis_method__analysis_method,analysis_method__method_en,database__name,database__name_en,dataset,dataset__name,dataset__name_en,date,date_added,date_changed,date_free,id,instrument,instrument__instrument,instrument__instrument_en,instrument_txt,lab,lab__lab,lab__lab_en,lab_analysis_number,lab_txt,mass,material,method_details,method_details_en,owner__agent,reference,reference__reference,sample,sample__depth,sample__depth_interval,sample__lithostratigraphy__stratigraphy,sample__lithostratigraphy__stratigraphy_en,sample__lithostratigraphy_id,sample__locality__depth,sample__locality__locality,sample__locality__locality_en,sample__locality_free,sample__locality_id,sample__number,sample__parent_sample,sample__stratigraphy__stratigraphy,sample__stratigraphy__stratigraphy_en,sample__stratigraphy_bed,sample__stratigraphy_free,sample__stratigraphy_id',
          },
        }
      )
      const ids = analysisResponse?.ids
      const analysis = analysisResponse.results[0]

      const tabs = [
        {
          id: 'analysis_results',
          isSolr: true,
          routeName: 'analysis-id',
          title: 'analysis.results',
          count: 0,
          props: { analysis: analysis.id },
        },
        {
          id: 'attachment_link',
          routeName: 'analysis-id-attachments',
          title: 'analysis.attachments',
          count: 0,
          props: { analysis: analysis.id },
        },
      ]

      const solrParams = { fq: `analysis_id:${analysis.id}` }
      const apiParams = { analysis: analysis.id }

      const forLoop = async () => {
        const filteredTabs = tabs.filter((item) => !!item.id)
        for (const item of filteredTabs) {
          let countResponse
          if (item?.isSolr)
            countResponse = await app.$services.sarvSolr.getResourceCount(
              item.id,
              solrParams
            )
          else
            countResponse = await app.$services.sarvREST.getResourceCount(
              item.id,
              apiParams
            )
          item.count = countResponse?.count ?? 0
          item.props = {
            analysis: analysis.id,
          }
        }
      }
      await forLoop()

      const hydratedTabs = (
        await Promise.all(
          tabs.map(
            async (tab) =>
              await app.$hydrateCount(tab, {
                solr: {
                  default: { fq: `analysis_id:${analysis.id}` },
                },
                api: {
                  default: { analysis: analysis.id },
                },
              })
          )
        )
      ).map((tab) =>
        app.$populateProps(tab, {
          ...tab.props,
          analysis: analysis.id,
        })
      )

      const validPath = app.$validateTabRoute(route, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)
      return {
        analysis,
        ids,
        tabs: hydratedTabs,
        initActiveTab: validPath,
      }
    } catch (err) {
      error({
        message: `Could not find analysis ${route.params.id}`,
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
          content: this.title,
          hid: 'og:title',
        },
      ],
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    title() {
      return this.$t('analysis.title', {
        method: this.$translate({
          et: this.analysis.analysis_method__analysis_method,
          en: this.analysis.analysis_method__method_en,
        }),
        sample: this.analysis.sample__number,
      })
    },
  },
  methods: {
    isEmpty,
    isNil,
  },
}
</script>
