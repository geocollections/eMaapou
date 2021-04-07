<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ $translate({ et: site.name, en: site.name_en }) }}
      </h1>
      <prev-next-nav :ids="ids" />
      <v-card flat tile class="my-2">
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
                      <tr>
                        <td>{{ $t('site.name') }}</td>
                        <td>
                          {{
                            $translate({
                              et: site.name,
                              en: site.name_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.area') }}</td>
                        <td v-if="isNil(site.area)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
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
                        </td>
                      </tr>
                      <tr v-if="site.area__area_type === 2">
                        <td>{{ $t('site.areaText1') }}</td>
                        <td v-if="isNil(site.area__text1)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
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
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.coordx') }}</td>
                        <td v-if="isNil(site.coordx)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.coordx }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.coordy') }}</td>
                        <td v-if="isNil(site.coordy)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.coordy }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.elevation') }}</td>
                        <td v-if="isNil(site.elevation)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.elevation }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.depth') }}</td>
                        <td v-if="isNil(site.depth)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.depth }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.description') }}</td>
                        <td v-if="isNil(site.description)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.description }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-col>
            <v-col
              v-if="(site.latitude && site.longitude) || site.locality_id"
              cols="12"
              md="6"
              class="pt-0 px-0"
            >
              <v-card-title class="pr-md-0 pl-md-4 px-0">{{
                $t('site.locality')
              }}</v-card-title>
              <v-card-text class="pr-md-0 pl-md-4 px-0">
                <v-simple-table dense class="mb-4 custom-table">
                  <template #default>
                    <tbody>
                      <tr>
                        <td>{{ $t('locality.locality') }}</td>
                        <td>
                          <a
                            class="text-link"
                            :href="
                              localePath({
                                name: 'locality-id',
                                params: { id: site.locality_id },
                              })
                            "
                          >
                            {{
                              $translate({
                                et: site.locality__locality,
                                en: site.locality__locality_en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr v-if="site.locality__country">
                        <td>{{ $t('locality.country') }}</td>
                        <td
                          v-if="
                            isNil(
                              $translate({
                                et: site.locality__country__value,
                                en: site.locality__country__value_en,
                              })
                            )
                          "
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{
                            $t('locality.countryFormat', {
                              name: $translate({
                                et: site.locality__country__value,
                                en: site.locality__country__value_en,
                              }),
                              iso: site.locality__country__iso_code,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.latitude') }}</td>
                        <td v-if="isNil(site.latitude)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.latitude }}
                        </td>
                      </tr>

                      <tr>
                        <td>{{ $t('locality.longitude') }}</td>
                        <td v-if="isNil(site.longitude)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.longitude }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.elevation') }}</td>
                        <td v-if="isNil(site.elevation)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.elevation }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('site.elevationAccuracy') }}</td>
                        <td
                          v-if="isNil(site.elevation_accuracy)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.elevation_accuracy }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.depth') }}</td>
                        <td v-if="isNil(site.locality__depth)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ site.locality__depth }}
                        </td>
                      </tr>
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
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil } from 'lodash'
import LeafletMap from '@/components/LeafletMap'
import Tabs from '~/components/Tabs.vue'
import PrevNextNav from '~/components/PrevNextNav'

export default {
  components: { PrevNextNav, Tabs, LeafletMap },
  async asyncData({ params, route, error, app }) {
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

      return {
        site,
        ids,
        initActiveTab: route.path,
        tabs: (
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
        ),
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
