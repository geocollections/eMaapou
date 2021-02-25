<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ $translate({ et: area.name, en: area.name_en }) }}
      </h1>
      <v-card class="my-2" flat tile>
        <v-card-title>{{ $t('common.general') }}</v-card-title>
        <v-card-text class="px-0">
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
                <data-row :title="$t('area.areaHa')" :value="area.area_ha" />
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
                      <span v-if="index !== egfArray.length - 1" class="mr-1"
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
                      <span v-if="index !== eelisArray.length - 1" class="mr-1"
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
                      <span v-if="index !== planArray.length - 1" class="mr-1"
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
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="tabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil } from 'lodash'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'

export default {
  components: { Tabs, DataRow, LinkDataRow },
  layout: 'detail',
  async asyncData({ params, route, error, app }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'area',
        params.id
      )
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
        initActiveTab: route.path,
        tabs,
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
