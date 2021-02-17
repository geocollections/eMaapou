<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ $translate({ et: locality.locality, en: locality.locality_en }) }}
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
                        <td>{{ $t('locality.name') }}</td>
                        <td>
                          {{
                            $translate({
                              et: locality.locality,
                              en: locality.locality_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.type') }}</td>
                        <td
                          v-if="
                            isNil(
                              $translate({
                                et: locality.type__value,
                                en: locality.type__value_en,
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
                              et: locality.type__value,
                              en: locality.type__value_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.country') }}</td>
                        <td
                          v-if="
                            isNil(
                              $translate({
                                et: locality.country__value,
                                en: locality.country__value_en,
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
                              et: locality.country__value,
                              en: locality.country__value_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.parish') }}</td>
                        <td
                          v-if="
                            isNil(
                              $translate({
                                et: locality.vald__vald,
                                en: locality.vald__vald_en,
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
                              et: locality.vald__vald,
                              en: locality.vald__vald_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.settlement') }}</td>
                        <td
                          v-if="
                            isNil(
                              $translate({
                                et: locality.asustusyksus__asustusyksus,
                                en: locality.asustusyksus__asustusyksus_en,
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
                              et: locality.asustusyksus__asustusyksus,
                              en: locality.asustusyksus__asustusyksus_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.elevation') }}</td>
                        <td v-if="isNil(locality.elevation)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.elevation }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.latitude') }}</td>
                        <td v-if="isNil(locality.latitude)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.latitude }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.longitude') }}</td>
                        <td v-if="isNil(locality.longitude)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.longitude }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordinateSystem') }}</td>
                        <td
                          v-if="isEmpty(locality.coord_system)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.coord_system }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordinateX') }}</td>
                        <td v-if="isNil(locality.coordx)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.coordx }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordinateY') }}</td>
                        <td v-if="isNil(locality.coordy)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.coordy }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordinatePrecision') }}</td>
                        <td
                          v-if="isNil(locality.coord_det_precision__value)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.coord_det_precision__value }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordinateMethod') }}</td>
                        <td
                          v-if="
                            isNil(
                              $translate({
                                et: locality.coord_det_method__value,
                                en: locality.coord_det_method__value_en,
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
                              et: locality.coord_det_method__value,
                              en: locality.coord_det_method__value_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.coordinateAgent') }}</td>
                        <td
                          v-if="isNil(locality.coord_det_agent__agent)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.coord_det_agent__agent }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.locationRemarks') }}</td>
                        <td
                          v-if="isNil(locality.remarks_location)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.remarks_location }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{ $t('locality.stratigraphyTop') }}
                        </td>
                        <td
                          v-if="isNil(locality.stratigraphy_top_id)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click.stop="
                              $openWindow(
                                `https://geocollections.info/stratigraphy/${locality.stratigraphy_top_id}`
                              )
                            "
                          >
                            {{
                              $translate({
                                et: locality.stratigraphy_top__stratigraphy,
                                en: locality.stratigraphy_top__stratigraphy_en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{ $t('locality.stratigraphyBase') }}
                        </td>
                        <td
                          v-if="isNil(locality.stratigraphy_base_id)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click.stop="
                              $openWindow(
                                `https://geocollections.info/stratigraphy/${locality.stratigraphy_base_id}`
                              )
                            "
                          >
                            {{
                              $translate({
                                et: locality.stratigraphy_base__stratigraphy,
                                en: locality.stratigraphy_base__stratigraphy_en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('locality.remarks') }}</td>
                        <td v-if="isNil(locality.remarks)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ locality.remarks }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-col>
            <v-col
              v-if="locality.latitude && locality.longitude"
              cols="12"
              md="6"
              class="pt-0 px-0"
            >
              <v-card-title class="pr-md-0 pl-md-4 px-0">{{
                $t('locality.map')
              }}</v-card-title>
              <v-card-text class="pr-md-0 pl-md-4 px-0">
                <v-card id="map-wrap" elevation="0" height="300">
                  <leaflet-map
                    :is-estonian="locality.country__value === 'Eesti'"
                    :height="400"
                    :center="{
                      latitude: locality.latitude,
                      longitude: locality.longitude,
                    }"
                    :markers="[
                      {
                        latitude: locality.latitude,
                        longitude: locality.longitude,
                        text: $translate({
                          et: locality.locality,
                          en: locality.locality_en,
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
      <v-card class="mt-2 pb-2">
        <tabs :tabs="tabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil, isEmpty } from 'lodash'
export default {
  async asyncData({ params, route, app, error }) {
    try {
      const localityResponse = await app.$services.sarvREST.getResource(
        'locality',
        params.id,
        {
          params: {
            fields:
              'asustusyksus__asustusyksus,asustusyksus__asustusyksus_en,coord_det_agent__agent,coord_det_method__value,coord_det_method__value_en,coord_det_precision__value,coord_system,coordx,coordy,country__iso_code,country__value,country__value_en,date_added,date_changed,depth,eelis,elevation,id,latitude,locality,locality_en,longitude,maaamet_pa_id,maakond__maakond,maakond__maakond_en,number,parent__locality,remarks,remarks_location,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en,stratigraphy_base_free,stratigraphy_base_id,stratigraphy_top__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top_free,stratigraphy_top_id,type__value,type__value_en,user_added,vald__vald,vald__vald_en',
          },
        }
      )
      const locality = localityResponse.results[0]
      const tabs = [
        {
          id: 'locality_synonym',
          routeName: 'locality-id',
          title: 'locality.synonyms',
          count: 0,
          props: {},
        },
        {
          id: 'specimen',
          routeName: 'locality-id-specimens',
          title: 'locality.specimens',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'locality_reference',
          routeName: 'locality-id-references',
          title: 'locality.references',
          count: 0,
          props: {},
        },
        {
          id: 'locality_description',
          routeName: 'locality-id-descriptions',
          title: 'locality.descriptions',
          count: 0,
          props: {},
        },
        {
          id: 'attachment_link',
          routeName: 'locality-id-attachments',
          title: 'locality.attachments',
          count: 0,
          props: {},
        },
        {
          id: 'sample',
          routeName: 'locality-id-samples',
          title: 'locality.samples',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'stratigraphy_stratotype',
          routeName: 'locality-id-stratotypes',
          title: 'locality.stratotypes',
          count: 0,
          props: {},
        },
      ]
      const solrParams = { fq: `locality_id:${params.id}` }
      const apiParams = { locality_id: locality.id }
      // Hack: fix count in API!!!
      const apiAttachmentLinkParams = {
        locality: locality.id,
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
            locality: locality.id,
          }
        }
      }
      await forLoop()
      return {
        locality,
        tabs,
        initActiveTab: route.path,
      }
    } catch (err) {
      error({
        message: `Could not find locality ${params.id}`,
        path: route.path,
      })
    }
  },
  methods: {
    isNil,
    isEmpty,
  },
}
</script>
