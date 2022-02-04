<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="$translate({ et: area.name, en: area.name_en })"
        class="title-area"
      />
    </template>

    <template #column-left>
      <v-row no-gutters justify="center">
        <v-col cols="12">
          <v-card-title class="subsection-title">{{
            $t('common.general')
          }}</v-card-title>
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
                    :title="$t('area.areaType')"
                    :value="
                      $translate({
                        et: area.area_type.name,
                        en: area.area_type.name_en,
                      })
                    "
                  />
                  <data-row
                    :title="$t('area.county')"
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
                  <data-row
                    v-if="
                      $translate({
                        et: area.description,
                        en: area.description_en,
                      })
                    "
                    :title="$t('area.description')"
                  >
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
                        <span v-if="index !== planArray.length - 1" class="mr-1"
                          >|</span
                        >
                      </span>
                    </template>
                  </data-row>
                  <data-row
                    v-if="area.date_added"
                    :title="$t('area.dateAdded')"
                    :value="$formatDate(area.date_added)"
                  />
                  <data-row
                    v-if="area.date_changed"
                    :title="$t('area.dateChanged')"
                    :value="$formatDate(area.date_changed)"
                  />
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row v-if="deposit" no-gutters justify="center">
        <v-col cols="12">
          <v-card-title class="subsection-title">{{
            $t('area.deposit')
          }}</v-card-title>
          <v-card-text>
            <v-alert
              dense
              type="info"
              color="accent"
              outlined
              class="text-body-2"
            >
              {{ $t('alert.estonianLandBoardDatabase') }}
            </v-alert>
            <v-simple-table dense class="custom-table">
              <template #default>
                <tbody>
                  <data-row
                    :title="$t('deposit.id')"
                    :value="area.maaamet_maardla.id"
                  />
                  <link-data-row
                    :title="$t('deposit.registrationNo')"
                    :value="deposit.reg_kaart"
                    @link-click="
                      $openWindow(
                        `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${deposit.reg_kaart}`
                      )
                    "
                  />
                  <data-row
                    :title="$t('deposit.name')"
                    :value="`${deposit.nimetus} ${
                      deposit.maardla_os ? `(${deposit.maardla_os})` : ''
                    }`"
                  />
                  <data-row
                    :title="$t('deposit.name')"
                    :value="deposit.maardla_os"
                  />
                  <data-row
                    :title="$t('deposit.area')"
                    :value="deposit.pindala"
                  />
                  <data-row :title="$t('deposit.isBedrock')">
                    <template #value>
                      <boolean-indicator :value="deposit.aluspohja" />
                    </template>
                  </data-row>
                  <data-row
                    :title="$t('deposit.commodity')"
                    :value="deposit.maavara"
                  />
                  <data-row
                    :title="$t('deposit.usage')"
                    :value="deposit.pohimaavar"
                  />
                  <data-row
                    :title="$t('deposit.additionalCommodity')"
                    :value="deposit.kaasmaavar"
                  />

                  <data-row
                    :title="$t('deposit.miningConditions')"
                    :value="deposit.maeteh_ti"
                  />
                  <data-row
                    :title="$t('deposit.enviromentalRestrictions')"
                    :value="deposit.geookol_ti"
                  />
                  <data-row
                    :title="$t('deposit.dataExportDate')"
                    :value="deposit.eksporditi"
                  />
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row v-if="miningClaim" no-gutters justify="center">
        <v-col cols="12">
          <v-card-title class="subsection-title">{{
            $t('area.miningClaim')
          }}</v-card-title>
          <v-card-text>
            <v-alert
              dense
              type="info"
              color="accent"
              outlined
              class="text-body-2"
            >
              {{ $t('alert.estonianLandBoardDatabase') }}
            </v-alert>
            <v-simple-table dense class="custom-table">
              <template #default>
                <tbody>
                  <data-row
                    :title="$t('miningClaim.id')"
                    :value="area.maaamet_maeeraldis.id"
                  />
                  <data-row
                    :title="$t('miningClaim.number')"
                    :value="miningClaim.me_kood"
                  />
                  <link-data-row
                    :title="$t('miningClaim.registrationNo')"
                    :value="miningClaim.reg_kaart"
                    @link-click="
                      $openWindow(
                        `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${miningClaim.reg_kaart}`
                      )
                    "
                  />
                  <data-row
                    :title="$t('miningClaim.name')"
                    :value="`${miningClaim.nimetus} ${
                      miningClaim.maardla_os
                        ? `(${miningClaim.maardla_os})`
                        : ''
                    }`"
                  />
                  <data-row
                    :title="$t('miningClaim.area')"
                    :value="miningClaim.pindala"
                  />
                  <data-row
                    :title="$t('miningClaim.reserve')"
                    :value="miningClaim.erald_varu"
                  />
                  <data-row
                    :title="$t('miningClaim.usage')"
                    :value="miningClaim.kas_eesm"
                  />
                  <data-row
                    :title="$t('miningClaim.reclamation')"
                    :value="miningClaim.rekult"
                  />

                  <data-row
                    :title="$t('miningClaim.status')"
                    :value="miningClaim.me_olek"
                  />
                  <data-row
                    v-if="miningClaim.loa_number"
                    :title="$t('miningClaim.extractionPermit')"
                  >
                    <template #value>
                      <external-link
                        @click.native="
                          $openWindow(
                            `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7935&LOA_NUMBER=${miningClaim.loa_number}&hide=true`
                          )
                        "
                      >
                        {{ miningClaim.loa_number }}
                      </external-link>
                      {{
                        ` (${miningClaim.loa_algus} - ${miningClaim.loa_lopp})`
                      }}
                    </template>
                  </data-row>
                  <data-row
                    :title="$t('miningClaim.permitOwner')"
                    :value="miningClaim.loa_omanik"
                  />
                  <data-row
                    :title="$t('miningClaim.miningCompany')"
                    :value="miningClaim.kaevandaja"
                  />

                  <data-row
                    :title="$t('miningClaim.dataExportDate')"
                    :value="miningClaim.eksporditi"
                  />
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-col>
      </v-row>
    </template>

    <template v-if="computedSites" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <leaflet-map
            rounded
            estonian-map
            estonian-bedrock-overlay
            :markers="computedSites"
            :geojson="
              parsedPolygon
                ? {
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: parsedPolygon,
                    },
                  }
                : null
            "
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
    </template>
  </detail>
</template>

<script>
import { isNil } from 'lodash'
import TitleCardDetail from '@/components/TitleCardDetail'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Detail from '~/components/templates/Detail.vue'
import LeafletMap from '~/components/map/LeafletMap'
import { TABS_AREA } from '~/constants'
import BooleanIndicator from '~/components/BooleanIndicator.vue'
import ExternalLink from '~/components/ExternalLink.vue'

export default {
  components: {
    LeafletMap,
    TitleCardDetail,
    Tabs,
    DataRow,
    LinkDataRow,
    Detail,
    BooleanIndicator,
    ExternalLink,
  },
  async asyncData({ params, route, error, $services }) {
    try {
      const detailViewResponse = await $services.sarvREST.getResource(
        'area',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = detailViewResponse?.ids
      const area = detailViewResponse
      const sitesForMapResponse = await $services.sarvSolr.getResourceList(
        'site',
        {
          defaultParams: {
            fq: `area_id:${params.id}`,
          },
        }
      )

      const deposit = area.maaamet_maardla

      const miningClaim = area.maaamet_maeeraldis

      const sites = sitesForMapResponse.items

      return {
        area,
        ids,
        sites,
        deposit,
        miningClaim,
      }
    } catch (err) {
      error({
        message: `Could not find area ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      tabs: [],
      initActiveTab: '',
    }
  },
  async fetch() {
    const tabs = TABS_AREA.allIds.map((id) => TABS_AREA.byIds[id])

    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            countParams: {
              solr: {
                default: { fq: `area_id:${this.area.id}` },
              },
              api: {
                default: { area: this.area.id },
              },
            },
          })
      )
    )

    const text = this.$translate({ et: this.area.name, en: this.area.name_en })

    const slugRoute = this.$createSlugRoute(this.$route, text)

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: `${this.$translate({
        et: this.area.name,
        en: this.area.name_en,
      })} | ${this.$t('area.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          content: `${this.$translate({
            et: this.area.name,
            en: this.area.name_en,
          })} | ${this.$t('area.pageTitle')}`,
          hid: 'og:title',
        },
      ],
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
    parsedPolygon() {
      try {
        return JSON.parse(this.area.polygon)
      } catch (e) {
        return null
      }
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
