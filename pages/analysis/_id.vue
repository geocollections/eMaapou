<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="
          $t('analysis.title', {
            method: $translate({
              et: analysis_method.analysis_method,
              en: analysis_method.method_en,
            }),
            sample: sample.number,
          })
        "
        class="title-analysis"
      />
    </template>

    <template #default>
      <v-card>
        <v-row no-gutters justify="center">
          <v-col>
            <v-card-title class="subsection-title">{{
              $t('common.general')
            }}</v-card-title>
            <v-card-text>
              <v-simple-table dense class="custom-table">
                <template #default>
                  <tbody>
                    <data-row
                      v-if="analysis_method"
                      :title="$t('analysis.method')"
                      :value="
                        $translate({
                          et: analysis_method.analysis_method,
                          en: analysis_method.method_en,
                        })
                      "
                    />
                    <data-row
                      v-if="agent"
                      :title="$t('analysis.analysedBy')"
                      :value="agent.agent"
                    />

                    <link-data-row
                      v-if="sample"
                      :title="$t('analysis.sampleNumber')"
                      :value="sample.number"
                      nuxt
                      :href="
                        localePath({
                          name: 'sample-id',
                          params: { id: analysis.sample.id },
                        })
                      "
                    />

                    <data-row
                      :title="$t('analysis.remarks')"
                      :value="analysis.remarks"
                    />
                    <link-data-row
                      v-if="reference"
                      :title="$t('analysis.reference')"
                      :value="reference.reference"
                      @link-click="$openGeology('reference', reference.id)"
                    />
                    <data-row
                      v-if="dataset"
                      :title="$t('analysis.dataset')"
                      :value="
                        $translate({
                          et: dataset.name,
                          en: dataset.name_en,
                        })
                      "
                    />
                    <link-data-row
                      v-if="sample && sample.locality"
                      :title="$t('analysis.locality')"
                      :value="
                        $translate({
                          et: sample.locality.locality,
                          en: sample.locality.locality_en,
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
                      v-if="sample"
                      :title="$t('analysis.depth')"
                      :value="sample.depth"
                    />
                    <data-row
                      v-if="sample"
                      :title="$t('analysis.depthInterval')"
                      :value="sample.depth_interval"
                    />
                    <link-data-row
                      v-if="sample && sample.stratigraphy"
                      :title="$t('analysis.stratigraphy')"
                      :value="
                        $translate({
                          et: sample.stratigraphy.stratigraphy,
                          en: sample.stratigraphy.stratigraphy_en,
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
                      v-if="sample && sample.lithostratigraphy"
                      :title="$t('analysis.lithostratigraphy')"
                      :value="
                        $translate({
                          et: sample.lithostratigraphy.stratigraphy,
                          en: sample.lithostratigraphy.stratigraphy_en,
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
                    <link-data-row
                      v-if="database"
                      :title="$t('analysis.institution')"
                      :value="
                        $translate({
                          et: database.name,
                          en: database.name_en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: `institution-${database.acronym.toLowerCase()}`,
                        })
                      "
                    />

                    <data-row
                      v-if="analysis.date_added"
                      :title="$t('analysis.dateAdded')"
                      :value="$formatDate(analysis.date_added)"
                    />
                    <data-row
                      v-if="analysis.date_changed"
                      :title="$t('analysis.dateChanged')"
                      :value="$formatDate(analysis.date_changed)"
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
import slugify from 'slugify'

import TitleCardDetail from '~/components/TitleCardDetail.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Tabs from '~/components/Tabs.vue'
import Detail from '~/components/templates/Detail.vue'

export default {
  components: { TitleCardDetail, DataRow, LinkDataRow, Tabs, Detail },

  async asyncData({ params, route, error, app, redirect }) {
    try {
      const analysisResponse = await app.$services.sarvREST.getResource(
        'analysis',
        params.id,
        {
          params: {
            nest: 2,
          },
        }
      )
      const ids = analysisResponse?.ids
      const analysis = analysisResponse

      const tabs = [
        {
          id: 'analysis_results',
          isSolr: true,
          routeName: 'analysis-id-slug',
          title: 'analysis.results',
          count: 0,
          props: { analysis: analysis.id },
        },
        {
          id: 'attachment_link',
          routeName: 'analysis-id-slug-attachments',
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

      const slug = slugify(
        `${app.$translate({
          et: analysis?.analysis_method.analysis_method,
          en: analysis?.analysis_method.method_en,
        })}-${analysis?.sample.number}`,
        { lower: true }
      )

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
          et: this.analysis?.analysis_method?.analysis_method,
          en: this.analysis?.analysis_method?.method_en,
        }),
        sample: this.analysis?.sample?.number,
      })
    },
    database() {
      return this.analysis?.database
    },
    analysis_method() {
      return this.analysis?.analysis_method ?? ''
    },
    sample() {
      return this.analysis?.sample
    },
    agent() {
      return this.analysis?.agent
    },
    reference() {
      return this.analysis?.reference
    },
    dataset() {
      return this.analysis?.dataset
    },
  },
  methods: {
    isEmpty,
    isNil,
  },
}
</script>
