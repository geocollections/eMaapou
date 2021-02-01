<template>
  <v-row>
    <v-col>
      <h1>
        {{
          $translate({ et: drillcore.drillcore, en: drillcore.drillcore_en })
        }}
      </h1>
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" class="pt-0">
              <v-card-title>{{ $t('common.general') }}</v-card-title>
              <v-card-text>
                <v-simple-table class="">
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
                        <td>{{ drillcore.boxes }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.boxNumbers') }}</td>
                        <td>{{ drillcore.box_numbers }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.depository') }}</td>
                        <td>
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
                        <td>{{ drillcore.storage__location }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.driller') }}</td>
                        <td>{{ drillcore.agent__agent }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('drillcore.year') }}</td>
                        <td>{{ drillcore.year }}</td>
                      </tr>

                      <tr>
                        <td>{{ $t('drillcore.metersInBox') }}</td>
                        <td>{{ drillcore.number_meters }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
              <v-card-title>{{ $t('drillcore.remarks') }}</v-card-title>
              <v-card-text>{{ drillcore.remarks }}</v-card-text>
            </v-col>
            <v-col v-if="drillcore.locality_id" cols="12" md="6" class="pt-0">
              <v-card-title>{{ $t('locality.locality') }}</v-card-title>
              <v-card-text>
                <v-simple-table class="mb-2">
                  <template #default>
                    <tbody>
                      <tr v-if="drillcore.locality__locality">
                        <td>{{ $t('locality.locality') }}</td>
                        <td>
                          {{
                            $translate({
                              et: drillcore.locality__locality,
                              en: drillcore.locality__locality_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr v-if="drillcore.locality__country__value">
                        <td>{{ $t('locality.country') }}</td>
                        <td>
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
                      <tr v-if="drillcore.locality__latitude">
                        <td>{{ $t('locality.latitude') }}</td>
                        <td>{{ drillcore.locality__latitude }}</td>
                      </tr>

                      <tr v-if="drillcore.locality__longitude">
                        <td>{{ $t('locality.longitude') }}</td>
                        <td>{{ drillcore.locality__longitude }}</td>
                      </tr>
                      <tr v-if="drillcore.locality__depth">
                        <td>{{ $t('locality.depth') }}</td>
                        <td>{{ drillcore.locality__depth }}</td>
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
                  :href="`/drillcore_box/${box.id}`"
                  class="mx-4 my-2"
                  :elevation="hover ? 10 : 2"
                >
                  <v-card-title>
                    {{ $t('drillcoreBox.nr', { number: box.number }) }}
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="8">
                        <!-- TODO: Add placeholder, for case when box does not have a picture -->
                        <v-img
                          class="rounded-lg"
                          contain
                          max-height="400"
                          :lazy-src="`https://files.geocollections.info/small/${box.drillcorebox_image__attachment__uuid_filename}`"
                          :src="`https://files.geocollections.info/medium/${box.drillcorebox_image__attachment__uuid_filename}`"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-simple-table>
                          <template #default>
                            <tbody>
                              <tr>
                                <td>{{ $t('drillcoreBox.depthStart') }}</td>
                                <td>{{ box.depth_start }}</td>
                              </tr>
                              <tr>
                                <td>{{ $t('drillcoreBox.depthEnd') }}</td>
                                <td>{{ box.depth_end }}</td>
                              </tr>
                              <tr>
                                <td>
                                  {{ $t('drillcoreBox.stratigraphyTop') }}
                                </td>
                                <td>
                                  {{
                                    $translate({
                                      et: box.stratigraphy_top__stratigraphy,
                                      en: box.stratigraphy_top__stratigraphy_en,
                                    })
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {{ $t('drillcoreBox.stratigraphyBase') }}
                                </td>
                                <td>
                                  {{
                                    $translate({
                                      et: box.stratigraphy_base__stratigraphy,
                                      en:
                                        box.stratigraphy_base__stratigraphy_en,
                                    })
                                  }}
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
}
</script>
