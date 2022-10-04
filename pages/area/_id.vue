<template>
  <detail>
    <template #title>
      <header-detail
        :ids="ids"
        :title="$translate({ et: area.name, en: area.name_en })"
      />
    </template>

    <template #column-left>
      <v-row no-gutters justify="center">
        <v-col cols="12">
          <v-card-title class="subsection-title">{{
            $t('common.general')
          }}</v-card-title>
          <v-card-text>
            <base-table>
              <table-row
                :title="$t('area.name')"
                :value="$translate({ et: area.name, en: area.name_en })"
              />
              <table-row-link
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
              <table-row
                v-else
                :title="$t('area.areaType')"
                :value="
                  $translate({
                    et: area.area_type.name,
                    en: area.area_type.name_en,
                  })
                "
              />
              <table-row-link
                v-if="area.parent_area"
                nuxt
                :href="
                  localePath({
                    name: 'area-id',
                    params: { id: area.parent_area.id },
                  })
                "
                :title="$t('area.parentArea')"
                :value="
                  $translate({
                    et: area.parent_area.name,
                    en: area.parent_area.name_en,
                  })
                "
              />
              <table-row
                :title="$t('area.county')"
                :value="
                  $translate({
                    et: area.maakond__maakond,
                    en: area.maakond__maakond_en,
                  })
                "
              />
              <table-row :title="$t('area.areaHa')" :value="area.area_ha" />
              <table-row
                :title="$t('area.depositAreaHa')"
                :value="area.deposit_area_ha"
              />
              <table-row
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
              </table-row>
              <table-row :title="$t('area.egf')">
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
              </table-row>
              <table-row-link
                :title="$t('area.maardla')"
                @link-click="$openEelis(item)"
              >
                <template #value>
                  {{ $t('area.maardlaLink') }} ({{ area.maardla }})
                </template>
              </table-row-link>
              <table-row :title="$t('area.eelis')">
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
              </table-row>

              <table-row
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
              </table-row>
              <table-row
                v-if="area.date_added"
                :title="$t('area.dateAdded')"
                :value="$formatDate(area.date_added)"
              />
              <table-row
                v-if="area.date_changed"
                :title="$t('area.dateChanged')"
                :value="$formatDate(area.date_changed)"
              />
            </base-table>
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
            <base-table>
              <table-row-link
                :title="$t('deposit.registrationNo')"
                :value="deposit.id"
                @link-click="
                  $openWindow(
                    `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${deposit.id}`
                  )
                "
              />
              <table-row
                :title="$t('deposit.name')"
                :value="`${deposit.nimetus} ${
                  deposit.maardla_os ? `(${deposit.maardla_os})` : ''
                }`"
              />
              <table-row
                :title="$t('deposit.name')"
                :value="deposit.maardla_os"
              />
              <table-row :title="$t('deposit.area')" :value="deposit.pindala" />
              <table-row :title="$t('deposit.isBedrock')">
                <template #value>
                  <base-boolean :value="deposit.aluspohja" />
                </template>
              </table-row>
              <table-row
                :title="$t('deposit.commodity')"
                :value="deposit.maavara"
              />
              <table-row
                :title="$t('deposit.usage')"
                :value="deposit.pohimaavar"
              />
              <table-row
                :title="$t('deposit.additionalCommodity')"
                :value="deposit.kaasmaavar"
              />

              <table-row
                :title="$t('deposit.miningConditions')"
                :value="deposit.maeteh_ti"
              />
              <table-row
                :title="$t('deposit.enviromentalRestrictions')"
                :value="deposit.geookol_ti"
              />
              <table-row
                :title="$t('deposit.dataExportDate')"
                :value="deposit.eksporditi"
              />
            </base-table>
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
            <base-table>
              <table-row :title="$t('miningClaim.number')">
                <template #value>
                  <base-link-external
                    @click.native="
                      $openWindow(
                        `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7935&LOA_NUMBER=${miningClaim.loa_number}&hide=true`
                      )
                    "
                  >
                    {{ area.maaamet_maeeraldis.id }}
                  </base-link-external>
                  (Maaamet XGIS2)
                </template>
              </table-row>
              <table-row :title="$t('miningClaim.registrationNo')">
                <template #value>
                  <base-link-external
                    @click.native="
                      $openWindow(
                        `https://xgis.maaamet.ee/xgis2/page/app/maardlad?showsearchlayer=1&searchid=FUU7966&REGISTRIKAART=${miningClaim.reg_kaart}`
                      )
                    "
                  >
                    {{ miningClaim.reg_kaart }}
                  </base-link-external>
                  (Maaamet XGIS2)
                </template>
              </table-row>
              <table-row
                :title="$t('miningClaim.name')"
                :value="`${miningClaim.nimetus} ${
                  miningClaim.maardla_os ? `(${miningClaim.maardla_os})` : ''
                }`"
              />
              <table-row
                :title="$t('miningClaim.area')"
                :value="miningClaim.pindala"
              />
              <table-row
                :title="$t('miningClaim.reserve')"
                :value="miningClaim.erald_varu"
              />
              <table-row
                :title="$t('miningClaim.usage')"
                :value="miningClaim.kas_eesm"
              />
              <table-row
                :title="$t('miningClaim.reclamation')"
                :value="miningClaim.rekult"
              />

              <table-row
                :title="$t('miningClaim.status')"
                :value="miningClaim.me_olek"
              />

              <table-row
                v-if="miningClaim.loa_number"
                :title="$t('miningClaim.extractionPermit')"
              >
                <template #value>
                  <base-link-external
                    @click.native="
                      $openWindow(
                        `https://kotkas.envir.ee/permits/public_index?search=1&permit_nr=${miningClaim.loa_number}`
                      )
                    "
                  >
                    {{ miningClaim.loa_number }}
                  </base-link-external>
                  (Kotkas)
                </template>
              </table-row>
              <table-row
                :title="$t('miningClaim.period')"
                :value="`${miningClaim.loa_algus} - ${miningClaim.loa_lopp}`"
              />
              <table-row
                :title="$t('miningClaim.permitOwner')"
                :value="miningClaim.loa_omanik"
              />
              <table-row
                :title="$t('miningClaim.miningCompany')"
                :value="miningClaim.kaevandaja"
              />

              <table-row
                :title="$t('miningClaim.dataExportDate')"
                :value="miningClaim.eksporditi"
              />
            </base-table>
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
            :geojson="geojson"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="filteredTabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import isNil from 'lodash/isNil'
import { TABS_AREA } from '~/constants'
export default {
  async asyncData({ app, params, route, error, $services }) {
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

      const tabs = TABS_AREA.allIds.map((id) => TABS_AREA.byIds[id])

      const hydratedTabs = await Promise.all(
        tabs.map(
          async (tab) =>
            await app.$hydrateTab(tab, {
              countParams: {
                solr: {
                  default: { fq: `area_id:${area.id}` },
                },
                api: {
                  default: { area: area.id },
                  relatedArea: { parent_area: area.id },
                },
              },
            })
        )
      )

      const text = app.$translate({
        et: area.name,
        en: area.name_en,
      })

      const slugRoute = app.$createSlugRoute(route, text)

      const validPath = app.$validateTabRoute(slugRoute, hydratedTabs)

      return {
        area,
        ids,
        sites,
        deposit,
        miningClaim,
        validPath,
        tabs: hydratedTabs,
        initActiveTab: validPath,
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
        // NOTE: Remove trailing commas from JSON object string
        // eslint-disable-next-line no-useless-escape
        const regex = /\,(?!\s*?[\{\[\"\'\w])/g
        return JSON.parse(this.area.polygon.replace(regex, ''))
      } catch (e) {
        return null
      }
    },
    geojson() {
      if (this.parsedPolygon === null) return null

      if (!(this.parsedPolygon instanceof Array)) return this.parsedPolygon
      else
        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: this.parsedPolygon,
          },
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
  created() {
    if (this.validPath !== this.$route.path)
      this.$router.replace(this.validPath)
  },
  methods: {
    isNil,
  },
}
</script>
