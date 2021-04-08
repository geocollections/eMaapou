<template>
  <v-row>
    <v-col>
      <prev-next-nav-title
        :ids="ids"
        :title="$translate({ et: area.name, en: area.name_en })"
      />
      <v-card flat tile>
        <v-row no-gutters justify="center">
          <v-col cols="12" md="9" lg="7" xl="6">
            <v-card-title>{{ $t('common.general') }}</v-card-title>
            <v-card-text>
              <v-simple-table dense class="custom-table">
                <template #default>
                  <tbody>
                    <data-row
                      :title="$t('area.name')"
                      :value="$translate({ et: area.name, en: area.name_en })"
                    />
                    <link-data-row
                      v-if="area.area_type === 2"
                      :title="$t('area.areaType')"
                      :value="
                        $translate({
                          et: area.area_type__name,
                          en: area.area_type__name_en,
                        })
                      "
                      @link-click="$openTurba('turbaala', area.id)"
                    />
                    <data-row
                      v-else
                      :title="$t('area.name')"
                      :value="
                        $translate({
                          et: area.area_type__name,
                          en: area.area_type__name_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('area.maakond')"
                      :value="
                        $translate({
                          et: area.maakond__maakond,
                          en: area.maakond__maakond_en,
                        })
                      "
                    />
                    <data-row
                      :title="$t('area.areaHa')"
                      :value="area.area_ha"
                    />
                    <data-row
                      :title="$t('area.depositAreaHa')"
                      :value="area.deposit_area_ha"
                    />
                    <data-row :title="$t('area.description')">
                      <template #value>
                        <!-- eslint-disable vue/no-v-html -->
                        <div
                          v-html="
                            $translate({
                              et: area.description,
                              en: area.description_en,
                            })
                          "
                        />
                        <!-- eslint-enable -->
                      </template>
                    </data-row>
                    <data-row :title="$t('area.egf')">
                      <template #value>
                        <span v-for="(item, index) in egfArray" :key="index">
                          <a class="text-link" @click="$openEgf(item)">
                            {{ item }}
                          </a>
                          <span
                            v-if="index !== egfArray.length - 1"
                            class="mr-1"
                            >|</span
                          >
                        </span>
                      </template>
                    </data-row>
                    <link-data-row
                      :title="$t('area.maardla')"
                      @link-click="$openEelis(item)"
                    >
                      <template #value>
                        {{ $t('area.maardlaLink') }} ({{ area.maardla }})
                      </template>
                    </link-data-row>
                    <data-row :title="$t('area.eelis')">
                      <template #value>
                        <span v-for="(item, index) in eelisArray" :key="index">
                          <a class="text-link" @click="$openEelis(item)">
                            {{ item }}
                          </a>
                          <span
                            v-if="index !== eelisArray.length - 1"
                            class="mr-1"
                            >|</span
                          >
                        </span>
                      </template>
                    </data-row>

                    <data-row
                      v-if="area.area_type === 2"
                      :title="$t('area.text1')"
                      :value="planArray"
                    >
                      <template #value>
                        <span v-for="(item, index) in planArray" :key="index">
                          <a
                            class="text-link"
                            :download="item.trim()"
                            @click="$openTurba('plaanid', item.trim(), false)"
                          >
                            {{ item }}
                            <v-icon small color="deep-orange darken-2"
                              >mdi-file-download-outline</v-icon
                            >
                          </a>
                          <span
                            v-if="index !== planArray.length - 1"
                            class="mr-1"
                            >|</span
                          >
                        </span>
                      </template>
                    </data-row>

                    <data-row :title="$t('area.id')" :value="area.id" />
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" flat tile class="mt-6 mx-4 mb-4">
        <v-row no-gutters justify="center" class="px-4">
          <v-col cols="12" md="9" lg="7" xl="6" class="elevation-2 rounded">
            <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil } from 'lodash'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'

export default {
  components: { PrevNextNavTitle, Tabs, DataRow, LinkDataRow },
  async asyncData({ params, route, error, app }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'area',
        params.id
      )
      const ids = detailViewResponse?.ids
      const area = detailViewResponse.results[0]

      const tabs = [
        {
          id: 'site',
          isSolr: true,
          routeName: 'area-id',
          title: 'area.sites',
          count: 0,
          props: {},
        },
        {
          id: 'locality_reference',
          routeName: 'area-id-references',
          title: 'area.localityReferences',
          count: 0,
          props: {},
        },
      ]
      // FIXME: If check seems unneccessary
      if (area?.id) {
        const solrParams = { fq: `area_id:${area.id}` }
        const apiParams = { area: area.id }

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
              area: area.id,
            }
          }
        }
        await forLoop()
      }

      return {
        area,
        ids,
        initActiveTab: route.path,
        tabs: (
          await Promise.all(
            tabs.map(
              async (tab) =>
                await app.$hydrateCount(tab, {
                  solr: {
                    default: { fq: `area_id:${area.id}` },
                  },
                  api: {
                    default: { area: area.id },
                  },
                })
            )
          )
        ).map((tab) =>
          app.$populateProps(tab, {
            ...tab.props,
            area: area.id,
          })
        ),
      }
    } catch (err) {
      error({
        message: `Could not find area ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.area.name,
        en: this.area.name_en,
      }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },

    eelisArray() {
      if (this.area.eelis) {
        if (this.area.eelis.includes(';')) {
          return this.area.eelis.split(';')
        } else return [this.area.eelis]
      } else return []
    },

    egfArray() {
      if (this.area.egf) {
        if (this.area.egf.includes(';')) {
          return this.area.egf.split(';')
        } else return [this.area.egf]
      } else return []
    },

    planArray() {
      if (this.area.text1) {
        if (this.area.text1.includes(',')) {
          return this.area.text1.split(',')
        } else return [this.area.text1]
      } else return []
    },
  },
  methods: {
    isNil,
  },
}
</script>
