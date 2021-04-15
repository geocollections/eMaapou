<template>
  <detail>
    <template #title>
      <prev-next-nav-title
        :ids="ids"
        :title="$translate({ et: site.name, en: site.name_en })"
      />
    </template>

    <template #column-left>
      <v-card-title class="pl-md-0 pr-md-4 px-0">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text class="pl-md-0 pr-md-4 px-0">
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row
                :title="$t('site.name')"
                :value="
                  $translate({
                    et: site.name,
                    en: site.name_en,
                  })
                "
              />
              <data-row :value="site.area" :title="$t('site.area')">
                <template #value>
                  <a
                    v-if="site.area__area_type === 2"
                    class="text-link"
                    @click="$openTurba('turbaala', site.area)"
                  >
                    {{
                      $translate({
                        et: site.area__name,
                        en: site.area__name_en,
                      })
                    }}
                    <v-icon small color="deep-orange darken-2"
                      >mdi-open-in-new</v-icon
                    >
                  </a>
                  <div v-else>
                    {{
                      $translate({
                        et: site.area__name,
                        en: site.area__name_en,
                      })
                    }}
                  </div>
                </template>
              </data-row>

              <data-row
                v-if="site.area__area_type === 2"
                :value="site.area"
                :title="$t('site.areaText1')"
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
              <data-row
                :title="$t('site.project')"
                :value="
                  $translate({
                    et: site.project__name,
                    en: site.project__name_en,
                  })
                "
              />
              <data-row :title="$t('site.coordx')" :value="site.coordx" />
              <data-row :title="$t('site.coordy')" :value="site.coordy" />
              <data-row :title="$t('site.elevation')" :value="site.elevation" />
              <data-row :title="$t('site.depth')" :value="site.depth" />
              <data-row
                :title="$t('site.description')"
                :value="site.description"
              />
              <data-row :title="$t('site.id')" :value="site.id" />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>

    <template
      v-if="(site.latitude && site.longitude) || site.locality_id"
      #column-right
    >
      <v-card-title class="pr-md-0 pl-md-4 px-0">{{
        $t('site.locality')
      }}</v-card-title>
      <v-card-text class="pr-md-0 pl-md-4 px-0">
        <v-simple-table dense class="mb-4 custom-table">
          <template #default>
            <tbody>
              <link-data-row
                :title="$t('locality.locality')"
                :value="
                  $translate({
                    et: site.locality__locality,
                    en: site.locality__locality_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'locality-id',
                    params: { id: site.locality_id },
                  })
                "
              />
              <data-row
                :title="$t('locality.country')"
                :value="
                  isNil(
                    $translate({
                      et: site.locality__country__value,
                      en: site.locality__country__value_en,
                    })
                  )
                "
              >
                <template #value>
                  {{
                    $t('locality.countryFormat', {
                      name: $translate({
                        et: site.locality__country__value,
                        en: site.locality__country__value_en,
                      }),
                      iso: site.locality__country__iso_code,
                    })
                  }}
                </template>
              </data-row>
              <data-row
                :title="$t('locality.latitude')"
                :value="site.latitude"
              />
              <data-row
                :title="$t('locality.longitude')"
                :value="site.longitude"
              />
              <data-row
                :title="$t('locality.elevation')"
                :value="site.elevation"
              />
              <data-row
                :title="$t('locality.elevationAccuracy')"
                :value="site.elevationAccuracy"
              />
              <data-row
                :title="$t('locality.depth')"
                :value="site.locality__depth"
              />
            </tbody>
          </template>
        </v-simple-table>
        <v-card
          v-if="site.latitude && site.longitude"
          id="map-wrap"
          elevation="0"
          height="300"
        >
          <leaflet-map
            :is-estonian="site.locality__country__value === 'Eesti'"
            :height="300"
            :center="{
              latitude: site.latitude,
              longitude: site.longitude,
            }"
            :markers="[
              {
                latitude: site.latitude,
                longitude: site.longitude,
                text: $translate({
                  et: site.name,
                  en: site.name_en,
                }),
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNil } from 'lodash'
import LeafletMap from '@/components/map/LeafletMap'
import Tabs from '~/components/Tabs.vue'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Detail from '~/components/templates/Detail.vue'

export default {
  components: {
    PrevNextNavTitle,
    Tabs,
    LeafletMap,
    DataRow,
    LinkDataRow,
    Detail,
  },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'site',
        params.id
      )
      const ids = detailViewResponse?.ids
      const site = detailViewResponse.results[0]

      const tabs = [
        {
          id: 'attachment_link',
          routeName: 'site-id',
          title: 'site.attachments',
          count: 0,
          props: {},
        },
        {
          id: 'sample',
          isSolr: true,
          routeName: 'site-id-samples',
          title: 'site.samples',
          count: 0,
          props: {},
        },
        {
          id: 'locality_description',
          routeName: 'site-id-descriptions',
          title: 'site.localityDescriptions',
          count: 0,
          props: {},
        },
        {
          id: 'locality_reference',
          routeName: 'site-id-references',
          title: 'site.localityReferences',
          count: 0,
          props: {},
        },
      ]

      const hydratedTabs = (
        await Promise.all(
          tabs.map(
            async (tab) =>
              await app.$hydrateCount(tab, {
                solr: { default: { fq: `site_id:${site.id}` } },
                api: { default: { site: site.id } },
              })
          )
        )
      ).map((tab) =>
        app.$populateProps(tab, {
          ...tab.props,
          site: site.id,
        })
      )

      // Find tab that has items
      const initTab = hydratedTabs.find((tab) => tab.count > 0)

      // Constuct route
      const path = initTab
        ? app.localePath({
            name: initTab.routeName,
            params: { id: site.id },
          })
        : route.path

      if (initTab && path !== route.path) redirect(path)

      return {
        site,
        ids,
        initActiveTab: path,
        tabs: hydratedTabs,
      }
    } catch (err) {
      error({
        message: `Could not find site ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.site.name,
        en: this.site.name_en,
      }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    planArray() {
      if (this.site.area__text1) {
        if (this.site.area__text1.includes(',')) {
          return this.site.area__text1.split(',')
        } else return [this.site.area__text1]
      } else return []
    },
  },
  methods: {
    isNil,
  },
}
</script>
