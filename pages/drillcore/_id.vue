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
import { isEmpty, isNull } from 'lodash'
import LeafletMap from '@/components/LeafletMap'
import Tabs from '~/components/Tabs.vue'

export default {
  components: { Tabs, LeafletMap },
  async asyncData({ params, route, error, app }) {
    try {
      const drillcoreResponse = await app.$services.sarvREST.getResource(
        'drillcore',
        params.id
      )
      const drillcore = drillcoreResponse.results[0]

      const tabs = [
        {
          routeName: 'drillcore-id',
          title: 'drillcore.drillcoreBoxesTitle',
          count: drillcore?.boxes,
          props: {},
        },
        {
          id: 'locality_description',
          routeName: 'drillcore-id-descriptions',
          title: 'drillcore.localityDescriptions',
          count: 0,
          props: {},
        },
        {
          id: 'locality_reference',
          routeName: 'drillcore-id-references',
          title: 'drillcore.localityReferences',
          count: 0,
          props: {},
        },
        {
          id: 'attachment_link',
          routeName: 'drillcore-id-attachments',
          title: 'drillcore.attachments',
          count: 0,
          props: {},
        },
        {
          id: 'sample',
          isSolr: true,
          routeName: 'drillcore-id-samples',
          title: 'drillcore.samples',
          count: 0,
          props: {},
        },
        {
          id: 'analysis',
          isSolr: true,
          routeName: 'drillcore-id-analyses',
          title: 'drillcore.analyses',
          count: 0,
          props: {},
        },
        {
          id: 'specimen',
          isSolr: true,
          routeName: 'drillcore-id-specimens',
          title: 'drillcore.specimens',
          count: 0,
          props: {},
        },
      ]

      if (drillcore?.locality_id) {
        const solrParams = { fq: `locality_id:${drillcore.locality_id}` }
        const apiParams = { locality: drillcore.locality_id }
        // Hack: fix count in API!!!
        const apiAttachmentLinkParams = {
          or_search: `drillcore:${drillcore.id};locality:${drillcore.locality_id}`,
        }

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
                item.id === 'attachment_link'
                  ? apiAttachmentLinkParams
                  : apiParams
              )
            item.count = countResponse?.count ?? 0
            item.props = {
              locality: drillcore.locality_id,
            }
          }
        }
        await forLoop()
      }

      return {
        drillcore,
        initActiveTab: route.path,
        tabs,
      }
    } catch (err) {
      error({
        message: `Could not find drillcore ${route.params.id}`,
        path: route.path,
      })
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
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
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
