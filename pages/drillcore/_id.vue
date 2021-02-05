<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{
          $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
        }}
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
              <v-card-title class="pl-md-0">{{
                $t('common.general')
              }}</v-card-title>
              <v-card-text class="pl-md-0">
                <v-simple-table dense class="custom-table">
                  <template #default>
                    <tbody>
                      <tr>
                        <td>{{ $t('drillcore.id') }}</td>
                        <td>{{ drillcore.id }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.name') }}</td>
                        <td>
                          {{
                            $translate({
                              et: drillcore.drillcore,
                              en: drillcore.drillcore_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.boxes') }}</td>
                        <td v-if="isNull(drillcore.boxes)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.boxes }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.boxNumbers') }}</td>
                        <td
                          v-if="isEmpty(drillcore.box_numbers)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.box_numbers }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.depository') }}</td>
                        <td
                          v-if="
                            isEmpty(
                              $translate({
                                et: drillcore.depository__value,
                                en: drillcore.depository__value_en,
                              })
                            )
                          "
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{
                            $translate({
                              et: drillcore.depository__value,
                              en: drillcore.depository__value_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.storage') }}</td>
                        <td
                          v-if="isEmpty(drillcore.storage__location)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.storage__location }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.driller') }}</td>
                        <td
                          v-if="isEmpty(drillcore.agent__agent)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.agent__agent }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.year') }}</td>

                        <td v-if="isEmpty(drillcore.year)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.year }}
                        </td>
                      </tr>

                      <tr>
                        <td>{{ $t('drillcore.metersInBox') }}</td>
                        <td
                          v-if="isNull(drillcore.number_meters)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.number_meters }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
              <div v-if="drillcore.remarks">
                <v-card-title class="pt-0 pl-md-0">{{
                  $t('drillcore.remarks')
                }}</v-card-title>
                <v-card-text class="pl-md-0">{{
                  drillcore.remarks
                }}</v-card-text>
              </div>
            </v-col>
            <v-col
              v-if="drillcore.locality_id"
              cols="12"
              md="6"
              class="pt-0 px-0"
            >
              <v-card-title>{{ $t('locality.locality') }}</v-card-title>
              <v-card-text class="pr-md-0">
                <v-simple-table dense class="mb-4 custom-table">
                  <template #default>
                    <tbody>
                      <tr>
                        <td>{{ $t('locality.locality') }}</td>
                        <td>
                          <a
                            class="text-link"
                            :href="`https://geocollections.info/locality/${drillcore.locality_id}`"
                          >
                            {{
                              $translate({
                                et: drillcore.locality__locality,
                                en: drillcore.locality__locality_en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr v-if="drillcore.locality__country__value">
                        <td>{{ $t('locality.country') }}</td>
                        <td
                          v-if="
                            isEmpty(
                              $translate({
                                et: drillcore.locality__country__value,
                                en: drillcore.locality__country__value_en,
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
                                et: drillcore.locality__country__value,
                                en: drillcore.locality__country__value_en,
                              }),
                              iso: drillcore.locality__country__iso_code,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.latitude') }}</td>
                        <td
                          v-if="isNull(drillcore.locality__latitude)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__latitude }}
                        </td>
                      </tr>

                      <tr>
                        <td>{{ $t('locality.longitude') }}</td>
                        <td
                          v-if="isNull(drillcore.locality__longitude)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__longitude }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.depth') }}</td>
                        <td
                          v-if="isNull(drillcore.locality__depth)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__depth }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-card
                  v-if="
                    drillcore.locality__latitude &&
                    drillcore.locality__longitude
                  "
                  id="map-wrap"
                  elevation="0"
                  height="500"
                >
                  <leaflet-map
                    :height="500"
                    :center="{
                      latitude: drillcore.locality__latitude,
                      longitude: drillcore.locality__longitude,
                    }"
                    :markers="[
                      {
                        latitude: drillcore.locality__latitude,
                        longitude: drillcore.locality__longitude,
                      },
                    ]"
                  />
                </v-card>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card class="mt-2">
        <v-tabs color="deep-orange darken-2">
          <v-tab>{{
            $t('drillcore.drillcoreBoxesTitle', { number: drillcore.boxes })
          }}</v-tab>
          <v-tab-item>
            <v-container>
              <v-row>
                <v-col
                  v-for="(box, i) in boxes"
                  :key="box.id"
                  cols="12"
                  class="pa-0"
                >
                  <v-divider v-if="i !== 0" />
                  <v-hover v-slot="{ hover }">
                    <!-- Opens box as new tab -->
                    <!-- <v-card
                  nuxt
                  :ripple="false"
                  target="_blank"
                  :href="`/drillcore_box/${box.id}`"
                  class="mx-4 my-2"
                  :elevation="hover ? 10 : 2"
                > -->
                    <v-card
                      flat
                      tile
                      :ripple="false"
                      target="_blank"
                      :class="{ 'on-hover': hover }"
                      @click="openDrillcoreBox(box.id)"
                    >
                      <v-card-text>
                        <v-row align="start">
                          <v-col cols="12" sm="8" align-self="center">
                            <!-- TODO: Add placeholder, for case when box does not have a picture -->
                            <v-img
                              class="rounded"
                              contain
                              max-height="400"
                              :lazy-src="`https://files.geocollections.info/small/${box.attachment__filename}`"
                              :src="`https://files.geocollections.info/medium/${box.attachment__filename}`"
                            >
                              <template #placeholder>
                                <v-row
                                  class="fill-height ma-0"
                                  align="center"
                                  justify="center"
                                >
                                  <v-progress-circular
                                    indeterminate
                                    color="grey lighten-5"
                                  ></v-progress-circular>
                                </v-row>
                              </template>
                            </v-img>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-card-title class="px-0 pt-0">
                              {{
                                $t('drillcoreBox.nr', {
                                  number: box.drillcore_box__number,
                                })
                              }}
                            </v-card-title>
                            <v-simple-table dense class="custom-table">
                              <template #default>
                                <tbody>
                                  <tr>
                                    <td>{{ $t('drillcoreBox.depthStart') }}</td>
                                    <td
                                      v-if="
                                        isNull(box.drillcore_box__depth_start)
                                      "
                                      class="no-value"
                                    >
                                      {{ $t('common.noValue') }}
                                    </td>
                                    <td v-else>
                                      {{ box.drillcore_box__depth_start }}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{{ $t('drillcoreBox.depthEnd') }}</td>
                                    <td
                                      v-if="
                                        isNull(box.drillcore_box__depth_end)
                                      "
                                      class="no-value"
                                    >
                                      {{ $t('common.noValue') }}
                                    </td>
                                    <td v-else>
                                      {{ box.drillcore_box__depth_end }}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      {{ $t('drillcoreBox.stratigraphyTop') }}
                                    </td>
                                    <td
                                      v-if="
                                        isNull(
                                          box.drillcore_box__stratigraphy_top
                                        )
                                      "
                                      class="no-value"
                                    >
                                      {{ $t('common.noValue') }}
                                    </td>
                                    <td v-else>
                                      <a
                                        class="text-link"
                                        :href="`https://geocollections.info/stratigraphy/${drillcore_box__stratigraphy_top}`"
                                      >
                                        {{
                                          $translate({
                                            et:
                                              box.drillcore_box__stratigraphy_top__stratigraphy,
                                            en:
                                              box.drillcore_box__stratigraphy_top__stratigraphy_en,
                                          })
                                        }}
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      {{ $t('drillcoreBox.stratigraphyBase') }}
                                    </td>
                                    <td
                                      v-if="
                                        isNull(
                                          box.drillcore_box__stratigraphy_base
                                        )
                                      "
                                      class="no-value"
                                    >
                                      {{ $t('common.noValue') }}
                                    </td>
                                    <td v-else>
                                      <a
                                        class="text-link"
                                        :href="`https://geocollections.info/stratigraphy/${box.drillcore_box__stratigraphy_base}`"
                                      >
                                        {{
                                          $translate({
                                            et:
                                              box.drillcore_box__stratigraphy_base__stratigraphy,
                                            en:
                                              box.drillcore_box__stratigraphy_base__stratigraphy_en,
                                          })
                                        }}
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-col>
                <v-col>
                  <infinite-loading
                    @infinite="infiniteHandler"
                  ></infinite-loading>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isEmpty, isNull } from 'lodash'

export default {
  async asyncData({ $axios, params }) {
    const drillcoreResponse = await $axios.$get(
      `https://api.geocollections.info/drillcore/${params.id}`
    )

    const drillcore = drillcoreResponse.results[0]
    return { drillcore }
  },
  data() {
    return {
      page: 1,
      boxes: [],
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.drillcore.drillcore,
        en: this.drillcore.drillcore_en,
      }),
    }
  },
  methods: {
    isEmpty,
    isNull,
    openDrillcoreBox(id) {
      const routeData = this.$router.resolve({
        name: `drillcore_box-id___${this.$i18n.locale}`,
        params: { id },
      })
      window.open(routeData.href, '_blank', 'height=800, width=800')
    },
    infiniteHandler($state) {
      const paginateBy = 5
      const url = `https://api.geocollections.info/attachment_link/?drillcore_box__drillcore=${this.$route.params.id}&page=${this.page}&paginate_by=${paginateBy}&distinct=true&fields=id,attachment__filename,drillcore_box__number,drillcore_box__stratigraphy_top,drillcore_box__stratigraphy_top__stratigraphy,drillcore_box__stratigraphy_top__stratigraphy_en,drillcore_box__stratigraphy_base,drillcore_box__stratigraphy_base__stratigraphy,drillcore_box__stratigraphy_base__stratigraphy_en,drillcore_box__depth_start,drillcore_box__depth_end`
      this.$axios.$get(url).then((res) => {
        if (!res.page) {
          this.boxes.push(...res.results)
          $state.loaded()
          $state.complete()
        } else if (parseInt(res.page.split(' ').pop()) >= this.page) {
          this.page += 1
          this.boxes.push(...res.results)
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
  },
}
</script>
