<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{
          $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
        }}
      </h1>
      <v-card>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
              style="max-width: 100%"
              class="pt-0 px-0 flex-grow-1 flex-shrink-0"
            >
              <v-card-title>{{ $t('common.general') }}</v-card-title>
              <v-card-text>
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
                <v-card-title class="pt-0">{{
                  $t('drillcore.remarks')
                }}</v-card-title>
                <v-card-text>{{ drillcore.remarks }}</v-card-text>
              </div>
            </v-col>
            <v-col
              v-if="drillcore.locality_id"
              cols="12"
              md="6"
              class="pt-0 px-0"
            >
              <v-card-title>{{ $t('locality.locality') }}</v-card-title>
              <v-card-text>
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
        <v-card-title>
          {{ $t('drillcore.drillcoreBoxesTitle', { number: drillcore.boxes }) }}
        </v-card-title>
        <v-container>
          <v-row>
            <v-col
              v-for="box in boxes.results"
              :key="box.id"
              cols="12"
              class="pa-0"
            >
              <v-hover v-slot="{ hover }">
                <v-card
                  nuxt
                  :ripple="false"
                  :href="`/drillcore_box/${box.id}`"
                  class="mx-4 my-2"
                  :elevation="hover ? 10 : 2"
                >
                  <v-card-text>
                    <v-row align="start">
                      <v-col cols="12" sm="8" align-self="center">
                        <!-- TODO: Add placeholder, for case when box does not have a picture -->
                        <v-img
                          class="rounded-lg"
                          contain
                          max-height="400"
                          :lazy-src="`https://files.geocollections.info/small/${box.drillcorebox_image__attachment__uuid_filename}`"
                          :src="`https://files.geocollections.info/medium/${box.drillcorebox_image__attachment__uuid_filename}`"
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
                          {{ $t('drillcoreBox.nr', { number: box.number }) }}
                        </v-card-title>
                        <v-simple-table dense class="custom-table">
                          <template #default>
                            <tbody>
                              <tr>
                                <td>{{ $t('drillcoreBox.depthStart') }}</td>
                                <td
                                  v-if="isNull(box.depth_start)"
                                  class="no-value"
                                >
                                  {{ $t('common.noValue') }}
                                </td>
                                <td v-else>
                                  {{ box.depth_start }}
                                </td>
                              </tr>
                              <tr>
                                <td>{{ $t('drillcoreBox.depthEnd') }}</td>
                                <td
                                  v-if="isNull(box.depth_end)"
                                  class="no-value"
                                >
                                  {{ $t('common.noValue') }}
                                </td>
                                <td v-else>
                                  {{ box.depth_end }}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {{ $t('drillcoreBox.stratigraphyTop') }}
                                </td>
                                <td v-if="isNull(box.stratigraphy_top_id)">
                                  {{ $t('common.noValue') }}
                                </td>
                                <td v-else class="no-value">
                                  <a
                                    class="text-link"
                                    :href="`https://geocollections.info/stratigraphy/${box.stratigraphy_top_id}`"
                                  >
                                    {{
                                      $translate({
                                        et: box.stratigraphy_top__stratigraphy,
                                        en:
                                          box.stratigraphy_top__stratigraphy_en,
                                      })
                                    }}
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {{ $t('drillcoreBox.stratigraphyBase') }}
                                </td>
                                <td v-if="isNull(box.stratigraphy_base_id)">
                                  {{ $t('common.noValue') }}
                                </td>
                                <td v-else class="no-value">
                                  <a
                                    class="text-link"
                                    :href="`https://geocollections.info/stratigraphy/${box.stratigraphy_base_id}`"
                                  >
                                    {{
                                      $translate({
                                        et: box.stratigraphy_base__stratigraphy,
                                        en:
                                          box.stratigraphy_base__stratigraphy_en,
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
          </v-row>
        </v-container>
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

    const boxResponse = await $axios.$get(
      `https://api.geocollections.info/drillcore_box/?drillcore__id=${params.id}&distinct=true`
    )

    const drillcore = drillcoreResponse.results[0]
    const boxes = boxResponse
    return { drillcore, boxes }
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
  },
}
</script>
