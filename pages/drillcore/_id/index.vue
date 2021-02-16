<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- HACK: Should make infinite loader wrapper -->
        <v-text-field
          v-model="search"
          class="ma-4"
          append-icon="mdi-magnify"
          :label="$t('common.search')"
          single-line
          hide-details
          clearable
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(box, i) in boxes" :key="box.id" cols="12" class="pa-0">
        <v-divider v-if="i !== 0" />
        <v-hover v-slot="{ hover }">
          <v-card
            flat
            tile
            :ripple="false"
            @click="
              $openNuxtWindow('drillcore_box-id', { id: box.drillcore_box })
            "
          >
            <v-card-text class="drillcore-box__card">
              <v-row align="start">
                <v-col cols="12" sm="8" align-self="center">
                  <!-- TODO: #74 Add placeholder, for case when box does not have a picture -->
                  <client-only>
                    <v-img
                      class="rounded mx-auto transition-swing"
                      :class="{
                        'elevation-8': hover,
                        'elevation-4': !hover,
                      }"
                      contain
                      max-width="1000"
                      eager
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
                  </client-only>
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
                            v-if="isNull(box.drillcore_box__depth_start)"
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
                            v-if="isNull(box.drillcore_box__depth_end)"
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
                            v-if="isNull(box.drillcore_box__stratigraphy_top)"
                            class="no-value"
                          >
                            {{ $t('common.noValue') }}
                          </td>
                          <td v-else>
                            <a
                              class="text-link"
                              @click.stop="
                                $openGeoDetail(
                                  'stratigraphy',
                                  box.drillcore_box__stratigraphy_top
                                )
                              "
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
                            v-if="isNull(box.drillcore_box__stratigraphy_base)"
                            class="no-value"
                          >
                            {{ $t('common.noValue') }}
                          </td>
                          <td v-else>
                            <a
                              class="text-link"
                              @click.stop="
                                $openGeoDetail(
                                  'stratigraphy',
                                  box.drillcore_box__stratigraphy_base
                                )
                              "
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
                        <tr>
                          <td>{{ $t('drillcoreBox.depthOther') }}</td>
                          <td
                            v-if="isNull(box.drillcore_box__depth_other)"
                            class="no-value"
                          >
                            {{ $t('common.noValue') }}
                          </td>
                          <td v-else>
                            {{ box.drillcore_box__depth_other }}
                          </td>
                        </tr>
                        <tr>
                          <td>{{ $t('drillcoreBox.remarks') }}</td>
                          <td
                            v-if="isNull(box.drillcore_box__remarks)"
                            class="no-value"
                          >
                            {{ $t('common.noValue') }}
                          </td>
                          <td v-else>
                            {{ box.drillcore_box__remarks }}
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
        <client-only>
          <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
            <template #spinner>
              <v-progress-circular color="deep-orange darken-2" indeterminate />
            </template>
            <template #no-more>{{ $t('infinite.noMore') }}</template>
            <template #error="{ trigger }">
              <div>
                {{ $t('infinite.error') }}
              </div>
              <br />
              <v-btn outlined color="deep-orange darken-2" @click="trigger">
                {{ $t('infinite.retry') }}
              </v-btn>
            </template>
          </infinite-loading>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { isNull, debounce } from 'lodash'
export default {
  data() {
    return {
      page: 1,
      boxes: [],
      search: '',
    }
  },
  methods: {
    isNull,
    infiniteHandler($state) {
      const paginateBy = 5
      this.$services.sarvREST
        .getResourceList('attachment_link', {
          defaultParams: {
            order_by: 'drillcore_box__depth_start,drillcore_box',
            drillcore_box__drillcore: this.$route.params.id,
            attachment__is_preferred: true,
            page: this.page,
            paginate_by: paginateBy,
            distinct: true,
            fields:
              'id,drillcore_box,attachment__filename,drillcore_box__number,drillcore_box__stratigraphy_top,drillcore_box__stratigraphy_top__stratigraphy,drillcore_box__stratigraphy_top__stratigraphy_en,drillcore_box__stratigraphy_base,drillcore_box__stratigraphy_base__stratigraphy,drillcore_box__stratigraphy_base__stratigraphy_en,drillcore_box__depth_start,drillcore_box__depth_end,drillcore_box__depth_other,drillcore_box__remarks,attachment__is_preferred',
          },
          search: this.search,
          queryFields: {
            drillcore_box__number: () => 'drillcore_box__number',
          },
        })
        .then((res) => {
          if (!res.page) {
            this.boxes.push(...res.items)
            $state.loaded()
            $state.complete()
          } else if (parseInt(res.page.split(' ').pop()) >= this.page) {
            this.page += 1
            this.boxes.push(...res.items)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch(() => {
          $state.error()
        })
    },
    handleSearch: debounce(function () {
      this.boxes = []
      if (this.page !== 1) this.page = 1
      else {
        this.$refs.infiniteLoading.status = 1
        this.$refs.infiniteLoading.$emit(
          'infinite',
          this.$refs.infiniteLoading.stateChanger
        )
      }
    }, 500),
  },
}
</script>
