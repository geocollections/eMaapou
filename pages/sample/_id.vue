<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ sampleTitle }}
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
              <v-card-title class="pl-md-0 pr-md-4 px-0">{{
                $t('common.general')
              }}</v-card-title>
              <v-card-text class="pl-md-0 pr-md-4 px-0">
                <v-simple-table dense class="custom-table">
                  <template #default>
                    <tbody>
                      <tr>
                        <td>{{ $t('sample.number') }}</td>
                        <td>
                          {{ sampleTitle }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('sample.locality') }}</td>
                        <td v-if="isNil(sample.locality)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            :href="
                              localePath({
                                name: 'locality-id',
                                params: { id: sample.locality_id },
                              })
                            "
                          >
                            {{
                              $translate({
                                et: sample.locality__locality,
                                en: sample.locality__locality_en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr v-if="isNil(sample.locality)">
                        <td>{{ $t('drillcore.boxNumbers') }}</td>
                        <td
                          v-if="isNil(sample.locality__latitude)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ sample.locality__latitude }}
                        </td>
                      </tr>
                      <tr v-if="isNil(sample.locality)">
                        <td>{{ $t('drillcore.boxNumbers') }}</td>
                        <td
                          v-if="isNil(sample.locality__longitude)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ sample.locality__longitude }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('sample.depth') }}</td>
                        <td v-if="isNil(sample.depth)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ sample.depth }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('sample.depth_interval') }}</td>
                        <td
                          v-if="isNil(sample.depth_interval)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ sample.depth_interval }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('sample.stratigraphy') }}</td>
                        <td v-if="isNil(sample.stratigraphy)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click="
                              $openGeoDetail(
                                'stratigraphy',
                                sample.stratigraphy
                              )
                            "
                          >
                            {{
                              $translate({
                                et: sample.stratigraphy__stratigraphy,
                                en: sample.stratigraphy__stratigraphy_en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('sample.date_collected') }}</td>
                        <td
                          v-if="isNil(sample.date_collected)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ sample.date_collected }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
              <div v-if="drillcore.remarks">
                <v-card-title class="pt-0 pl-md-0 pr-md-4 px-0">{{
                  $t('drillcore.remarks')
                }}</v-card-title>
                <v-card-text class="pl-md-0 pr-md-4 px-0">{{
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
              <v-card-title class="pr-md-0 pl-md-4 px-0">{{
                $t('locality.locality')
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
                                params: { id: drillcore.locality_id },
                              })
                            "
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
                            isNil(
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
                          v-if="isNil(drillcore.locality__latitude)"
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
                          v-if="isNil(drillcore.locality__longitude)"
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
                          v-if="isNil(drillcore.locality__elevation)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ drillcore.locality__elevation }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.depth') }}</td>
                        <td
                          v-if="isNil(drillcore.locality__depth)"
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
                        text: $translate({
                          et: drillcore.drillcore,
                          en: drillcore.drillcore_en,
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
        <tabs :tabs="tabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil } from 'lodash'
import Tabs from '~/components/Tabs.vue'

export default {
  components: { Tabs },
  layout: 'detail',
  async asyncData({ params, route, error, app }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'sample',
        params.id
      )
      const sample = detailViewResponse.results[0]

      const tabs = [
        {
          id: 'analysis',
          isSolr: true,
          routeName: 'sample-id',
          title: 'sample.analyses',
          count: 0,
          props: {},
        },
        {
          id: 'preparation',
          routeName: 'sample-id-preparations',
          title: 'sample.preparations',
          count: 0,
          props: {},
        },
        {
          id: 'taxon_list',
          routeName: 'sample-id-taxa',
          title: 'sample.taxa',
          count: 0,
          props: {},
        },
        {
          id: 'attachment_link',
          routeName: 'sample-id-attachments',
          title: 'sample.attachments',
          count: 0,
          props: {},
        },
        {
          id: 'sample_reference',
          routeName: 'sample-id-references',
          title: 'sample.references',
          count: 0,
          props: {},
        },
      ]

      if (sample?.id) {
        const solrParams = { fq: `sample_id:${sample.id}` }
        const apiParams = { sample: sample.id }

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
              sample: sample.id,
            }
          }
        }
        await forLoop()
      }

      return {
        sample,
        initActiveTab: route.path,
        tabs,
      }
    } catch (err) {
      error({
        message: `Could not find sample ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title:
        this.sample.number ||
        this.sample.number_additional ||
        this.sample.number_field ||
        this.sample.id,
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    sampleTitle() {
      return (
        this.sample.number ||
        this.sample.number_additional ||
        this.sample.number_field ||
        this.sample.id
      )
    },
  },
  methods: {
    isNil,
  },
}
</script>
