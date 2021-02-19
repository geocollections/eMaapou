<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ $t('analysis.title', { id: analysis.id }) }}
      </h1>
      <v-card flat tile>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
              style="max-width: 100%"
              class="pt-0 px-0 flex-grow-1 flex-shrink-0"
            >
              <v-card-title class="pl-md-0 pr-md-4 px-0">{{
                $t('common.general')
              }}</v-card-title>
              <v-card-text class="pl-md-0 pr-md-4 px-0">
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
                        @link-click="$openGeoDetail('sample', analysis.sample)"
                      />

                      <data-row
                        :title="$t('analysis.remarks')"
                        :value="analysis.remarks"
                      />
                      <link-data-row
                        :title="$t('analysis.reference')"
                        :value="analysis.reference__reference"
                        @link-click="
                          $openGeoDetail('reference', analysis.reference)
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
                        @link-click="
                          $openNuxtWindow('locality-id', {
                            id: analysis.sample__locality_id,
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
                        @link-click="
                          $openGeoDetail(
                            'stratigraphy',
                            analysis.sample__stratigraphy_id
                          )
                        "
                      />
                      <link-data-row
                        :title="$t('analysis.lithostratigraphy')"
                        :value="
                          $translate({
                            et:
                              analysis.sample__lithostratigraphy__stratigraphy,
                            en:
                              analysis.sample__lithostratigraphy__stratigraphy__en,
                          })
                        "
                        @link-click="
                          $openGeoDetail(
                            'stratigraphy',
                            analysis.sample__lithostratigraphy_id
                          )
                        "
                      />
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="tabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isEmpty, isNil } from 'lodash'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Tabs from '~/components/Tabs'
export default {
  components: { DataRow, LinkDataRow, Tabs },
  layout: 'detail',
  async asyncData({ params, route, error, app }) {
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

      return { analysis, tabs, initActiveTab: route.path }
    } catch (err) {
      error({
        message: `Could not find analysis ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$t('analysis.title', { id: this.analysis.id }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
  },
  methods: {
    isEmpty,
    isNil,
  },
}
</script>
