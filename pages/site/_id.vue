<template>
  <detail>
    <template #title>
      <prev-next-nav-title
        :ids="ids"
        :title="$translate({ et: site.name, en: site.name_en })"
      />
    </template>

    <template #column-left>
      <v-card-title>{{ $t('common.general') }}</v-card-title>
      <v-card-text>
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
                    <v-icon small color="primary darken-2"
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

              <link-data-row
                v-if="(site.latitude && site.longitude) || site.locality_id"
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
                v-if="site.locality_id"
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
                v-if="(site.latitude && site.longitude) || site.locality_id"
                :title="$t('locality.latitude')"
                :value="site.latitude"
              />
              <data-row
                v-if="(site.latitude && site.longitude) || site.locality_id"
                :title="$t('locality.longitude')"
                :value="site.longitude"
              />
              <data-row
                v-if="(site.latitude && site.longitude) || site.locality_id"
                :title="$t('locality.elevation')"
                :value="site.elevation"
              />
              <data-row
                v-if="(site.latitude && site.longitude) || site.locality_id"
                :title="$t('locality.elevationAccuracy')"
                :value="site.elevationAccuracy"
              />
              <data-row
                v-if="(site.latitude && site.longitude) || site.locality_id"
                :title="$t('locality.depth')"
                :value="site.locality__depth"
              />
              <data-row
                v-if="site.date_added"
                :title="$t('site.dateAdded')"
                :value="new Date(site.date_added).toISOString().split('T')[0]"
              />
              <data-row
                v-if="site.date_changed"
                :title="$t('site.dateChanged')"
                :value="new Date(site.date_changed).toISOString().split('T')[0]"
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>

    <template
      v-if="(site.latitude && site.longitude) || site.locality_id"
      #column-right
    >
      <v-card-text>
        <v-card
          v-if="site.latitude && site.longitude"
          id="map-wrap"
          elevation="0"
        >
          <leaflet-map
            :is-estonian="site.locality__country__value === 'Eesti'"
            :height="500"
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
      <image-bar v-if="images.length > 0" :images="images">
        <template #image="{ item, on, attrs }">
          <v-hover v-slot="{ hover }">
            <v-img
              v-bind="attrs"
              :src="`https://files.geocollections.info/small/${item.attachment__uuid_filename}`"
              :lazy-src="`https://files.geocollections.info/small/${item.attachment__uuid_filename}`"
              max-width="200"
              max-height="200"
              width="200"
              height="200"
              :class="{
                'elevation-4': hover,
                'elevation-2': !hover,
              }"
              class="grey lighten-2 rounded transition-swing cursor-pointer"
              v-on="on"
              @click="
                $router.push(
                  localePath({
                    name: 'file-id',
                    params: { id: item.attachment },
                  })
                )
              "
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-hover>
        </template>
        <template #info="{ item }">
          <div v-if="item.attachment__author__agent">
            <span class="font-weight-bold"
              >{{ $t('attachment.author') }}:
            </span>
            <span>{{ item.attachment__author__agent }}</span>
          </div>
          <div
            v-if="
              item.attachment__date_created ||
              item.attachment__date_created_free
            "
          >
            <span class="font-weight-bold">{{ $t('locality.date') }}: </span>
            <span v-if="item.attachment__date_created">
              {{
                new Date(item.attachment__date_created)
                  .toISOString()
                  .split('T')[0]
              }}
            </span>
            <span v-else>{{ item.attachment__date_created_free }}</span>
          </div>
          <div v-else>{{ $t('common.clickToOpen') }}</div>
        </template>
      </image-bar>
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
import ImageBar from '~/components/ImageBar.vue'

export default {
  components: {
    PrevNextNavTitle,
    Tabs,
    LeafletMap,
    DataRow,
    LinkDataRow,
    Detail,
    ImageBar,
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

      const attachmentResponse = await app.$services.sarvREST.getResourceList(
        'attachment_link',
        {
          isValid: isNil(site.id),
          defaultParams: {
            site: site.id,
          },
          queryFields: {},
        }
      )
      const attachments = attachmentResponse.items ?? []

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

      const validPath = app.$validateTabRoute(route, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)

      return {
        site,
        ids,
        initActiveTab: validPath,
        tabs: hydratedTabs,
        images: attachments,
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
      title: this.$t(`breadcrumbs.${this.routeName}-id`, {
        id: this.$route.params.id,
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
    routeName() {
      return this.getRouteBaseName().split('-id')[0]
    },
  },
  methods: {
    isNil,
  },
}
</script>
