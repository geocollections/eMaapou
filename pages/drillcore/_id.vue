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
                      <tr>
                        <td>{{ $t('drillcore.id') }}</td>
                        <td>{{ drillcore.id }}</td>
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
                        <td>{{ $t('locality.elevation') }}</td>
                        <td
                          v-if="isNull(drillcore.locality__elevation)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__elevation }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordx') }}</td>
                        <td
                          v-if="isNull(drillcore.locality__coordx)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__coordx }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordy') }}</td>
                        <td
                          v-if="isNull(drillcore.locality__coordy)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__coordy }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.epsg') }}</td>
                        <td
                          v-if="isNull(drillcore.locality__epsg)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__epsg }}
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
                  height="300"
                >
                  <leaflet-map
                    :is-estonian="
                      drillcore.locality__country__value === 'Eesti'
                    "
                    :height="300"
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
        <v-tabs
          v-model="activeTab"
          background-color="grey lighten-3"
          color="deep-orange darken-2"
          show-arrows
        >
          <v-tab
            v-for="(item, index) in tabs"
            :key="index"
            nuxt
            exact
            :to="
              localePath({
                name: item.routeName,
                params: { id: $route.params.id },
              })
            "
            >{{ $t(item.title) }}</v-tab
          >
        </v-tabs>
        <v-tabs-items v-model="activeTab" @change="handleSwipeBetweenTabs">
          <v-tab-item
            v-for="(item, index) in tabs"
            :key="index"
            :value="
              localePath({
                name: item.routeName,
                params: { id: $route.params.id },
              })
            "
          >
            <nuxt-child
              :key="index"
              keep-alive
              :locality="drillcore.locality_id"
            />
          </v-tab-item>
        </v-tabs-items>
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
      activeTab: 1,
      tabs: [
        {
          routeName: 'drillcore-id',
          title: 'drillcore.drillcoreBoxesTitle',
        },
        {
          routeName: 'drillcore-id-locality_description',
          title: 'drillcore.localityDescriptions',
        },
        {
          routeName: 'drillcore-id-locality_reference',
          title: 'drillcore.localityReferences',
        },
        {
          routeName: 'drillcore-id-attachments',
          title: 'drillcore.attachments',
        },
        {
          routeName: 'drillcore-id-samples',
          title: 'drillcore.samples',
        },
        {
          routeName: 'drillcore-id-analyses',
          title: 'drillcore.analyses',
        },
        { routeName: 'drillcore-id-specimens', title: 'drillcore.specimens' },
      ],
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
    handleSwipeBetweenTabs(pathAsString) {
      this.$router.push(pathAsString)
    },
  },
}
</script>
