<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ $t('analysis.title', { id: analysis.id }) }}
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
                        <td>{{ $t('analysis.method') }}</td>
                        <td
                          v-if="
                            isEmpty(
                              $translate({
                                et: analysis.analysis_method__analysis_method,
                                en: analysis.analysis_method__method_en,
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
                              et: analysis.analysis_method__analysis_method,
                              en: analysis.analysis_method__method_en,
                            })
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.analysedBy') }}</td>
                        <td
                          v-if="isEmpty(analysis.agent__agent)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ analysis.agent__agent }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.sampleNumber') }}</td>
                        <td
                          v-if="isEmpty(analysis.sample__number)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click="$openGeoDetail('sample', analysis.sample)"
                          >
                            {{ analysis.sample }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.remarks') }}</td>
                        <td v-if="isEmpty(analysis.remarks)" class="no-value">
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ analysis.remarks }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.reference') }}</td>
                        <td
                          v-if="isEmpty(analysis.reference__reference)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click="
                              $openGeoDetail('reference', analysis.reference)
                            "
                          >
                            {{ analysis.reference__reference }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.dataset') }}</td>
                        <td
                          v-if="
                            isEmpty(
                              $translate({
                                et: analysis.dataset__name,
                                en: analysis.dataset__name__en,
                              })
                            )
                          "
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click="$openGeoDetail('dataset', analysis.dataset)"
                            >{{
                              $translate({
                                et: analysis.dataset__name,
                                en: analysis.dataset__name__en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.locality') }}</td>
                        <td
                          v-if="
                            isEmpty(
                              $translate({
                                et: analysis.sample__locality__locality,
                                en: analysis.sample__locality__locality__en,
                              })
                            )
                          "
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click="
                              $openNuxtWindow('locality-id', {
                                id: analysis.sample__locality_id,
                              })
                            "
                            >{{
                              $translate({
                                et: analysis.sample__locality__locality,
                                en: analysis.sample__locality__locality__en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.depth') }}</td>
                        <td
                          v-if="isNil(analysis.sample__depth)"
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          {{ analysis.sample__depth }}
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.stratigraphy') }}</td>
                        <td
                          v-if="
                            isEmpty(
                              $translate({
                                et: analysis.sample__stratigraphy__stratigraphy,
                                en:
                                  analysis.sample__stratigraphy__stratigraphy__en,
                              })
                            )
                          "
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click="
                              $openGeoDetail(
                                'stratigraphy',
                                analysis.sample__stratigraphy_id
                              )
                            "
                            >{{
                              $translate({
                                et: analysis.sample__stratigraphy__stratigraphy,
                                en:
                                  analysis.sample__stratigraphy__stratigraphy__en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ $t('analysis.lithostratigraphy') }}</td>
                        <td
                          v-if="
                            isEmpty(
                              $translate({
                                et:
                                  analysis.sample__lithostratigraphy__stratigraphy,
                                en:
                                  analysis.sample__lithostratigraphy__stratigraphy__en,
                              })
                            )
                          "
                          class="no-value"
                        >
                          {{ $t('common.noValue') }}
                        </td>
                        <td v-else>
                          <a
                            class="text-link"
                            @click="
                              $openGeoDetail(
                                'stratigraphy',
                                analysis.sample__lithostratigraphy_id
                              )
                            "
                            >{{
                              $translate({
                                et:
                                  analysis.sample__lithostratigraphy__stratigraphy,
                                en:
                                  analysis.sample__lithostratigraphy__stratigraphy__en,
                              })
                            }}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isEmpty, isNil } from 'lodash'
export default {
  layout: 'detail',
  async asyncData({ params, route, error, app }) {
    try {
      const analysisResponse = await app.$services.sarvREST.getResource(
        'analysis',
        params.id,
        {
          params: {
            fields:
              'agent__agent,analysis_method__analysis_method,analysis_method__method_en,database__name,database__name_en,dataset,dataset__name,dataset__name_en,date,date_added,date_changed,date_free,id,instrument,instrument__instrument,instrument__instrument_en,instrument_txt,lab,lab__lab,lab__lab_en,lab_analysis_number,lab_txt,mass,material,method_details,method_details_en,owner__agent,reference,reference__reference,sample,sample__depth,sample__depth_interval,sample__lithostratigraphy__stratigraphy,sample__lithostratigraphy__stratigraphy_en,sample__lithostratigraphy_id,sample__locality__depth,sample__locality__locality,sample__locality__locality_en,sample__locality_free,sample__locality_id,sample__number,sample__parent_sample,sample__stratigraphy__stratigraphy,sample__stratigraphy__stratigraphy_en,sample__stratigraphy_bed,sample__stratigraphy_free,sample__stratigraphy_id',
          },
        }
      )
      const analysis = analysisResponse.results[0]

      return { analysis }
    } catch (err) {
      error({
        message: `Could not find analysis ${route.params.id}`,
        path: route.path,
      })
    }
  },
  methods: {
    isEmpty,
    isNil,
  },
}
</script>
