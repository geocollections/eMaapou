<template>
  <detail>
    <template #title>
      <prev-next-nav-title
        :ids="ids"
        :title="$translate({ et: area.name, en: area.name_en })"
      />
    </template>

    <template #column-left>
      <v-card flat tile>
        <v-row no-gutters justify="center">
          <v-col cols="12">
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
                            <v-icon small color="primary darken-2"
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
                    <data-row
                      v-if="area.date_added"
                      :title="$t('area.dateAdded')"
                      :value="
                        new Date(area.date_added).toISOString().split('T')[0]
                      "
                    />
                    <data-row
                      v-if="area.date_changed"
                      :title="$t('area.dateChanged')"
                      :value="
                        new Date(area.date_changed).toISOString().split('T')[0]
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

    <template v-if="computedSites" #column-right>
      <v-card-title>{{ $t('locality.map') }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <leaflet-map
            rounded
            estonian-map
            estonian-bedrock-layer
            :markers="computedSites"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="filteredTabs.length > 0" flat tile class="mt-6 mx-4 mb-4">
        <v-row no-gutters justify="center" class="px-4">
          <v-col cols="12" class="elevation-2 rounded">
            <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
          </v-col>
        </v-row> </v-card
    ></template>
  </detail>
</template>

<script>
import { isNil } from 'lodash'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import Detail from '~/components/templates/Detail.vue'
import LeafletMap from '~/components/map/LeafletMap'

export default {
  components: {
    LeafletMap,
    PrevNextNavTitle,
    Tabs,
    DataRow,
    LinkDataRow,
    Detail,
  },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'area',
        params.id
      )
      const ids = detailViewResponse?.ids
      const area = detailViewResponse.results[0]

      const sitesResponse = await app.$services.sarvSolr.getResourceList(
        'site',
        {
          defaultParams: {
            fq: `area_id:${params.id}`,
          },
        }
      )

      const sites = sitesResponse.items

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

      const hydratedTabs = (
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
      )

      const validPath = app.$validateTabRoute(route, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)

      return {
        area,
        ids,
        sites,
        initActiveTab: validPath,
        tabs: hydratedTabs,
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

    computedSites() {
      if (this.sites) {
        return this.sites.reduce((filtered, item) => {
          if (item.longitude && item.latitude) {
            const newItem = {
              longitude: item.longitude,
              latitude: item.latitude,
              text:
                this.$translate({ et: item.name, en: item.name_en }) ??
                `ID: ${item.id}`,
              routeName: 'site',
              id: item.id,
            }
            const isItemInArray = !!filtered.find(
              (existingItem) =>
                existingItem.latitude === item.latitude &&
                existingItem.longitude === item.longitude
            )
            if (!isItemInArray) filtered.push(newItem)
          }
          return filtered
        }, [])
      } else return []
    },
  },
  methods: {
    isNil,
  },
}
</script>
