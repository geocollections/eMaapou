<template>
  <div class="px-3">
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
              $openNuxtWindow('drillcore-box-id', { id: box.drillcore_box })
            "
          >
            <v-card-text class="drillcore-box__card">
              <v-row align="start">
                <v-col cols="12" sm="8" align-self="center">
                  <!-- TODO: #74 Add placeholder, for case when box does not have a picture -->
                  <client-only>
                    <v-img
                      class="mx-auto rounded transition-swing"
                      :class="{
                        'elevation-8': hover,
                        'elevation-4': !hover,
                      }"
                      contain
                      max-width="1000"
                      max-height="800"
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
                  <v-simple-table
                    v-if="boxHasInfo(box)"
                    dense
                    class="custom-table"
                  >
                    <template #default>
                      <tbody>
                        <data-row
                          :title="$t('drillcoreBox.depthStart')"
                          :value="box.drillcore_box__depth_start"
                        />
                        <data-row
                          :title="$t('drillcoreBox.depthEnd')"
                          :value="box.drillcore_box__depth_end"
                        />
                        <link-data-row
                          v-if="box.drillcore_box__stratigraphy_top"
                          :title="$t('drillcoreBox.stratigraphyTop')"
                          :value="
                            $translate({
                              et:
                                box.drillcore_box__stratigraphy_top__stratigraphy,
                              en:
                                box.drillcore_box__stratigraphy_top__stratigraphy_en,
                            })
                          "
                          nuxt
                          :href="
                            localePath({
                              name: 'stratigraphy-id',
                              params: {
                                id: box.drillcore_box__stratigraphy_top,
                              },
                            })
                          "
                        />
                        <link-data-row
                          v-if="box.drillcore_box__stratigraphy_base"
                          :title="$t('drillcoreBox.stratigraphyBase')"
                          :value="
                            $translate({
                              et:
                                box.drillcore_box__stratigraphy_base__stratigraphy,
                              en:
                                box.drillcore_box__stratigraphy_base__stratigraphy_en,
                            })
                          "
                          nuxt
                          :href="
                            localePath({
                              name: 'stratigraphy-id',
                              params: {
                                id: box.drillcore_box__stratigraphy_base,
                              },
                            })
                          "
                        />
                        <data-row
                          :title="$t('drillcoreBox.depthOther')"
                          :value="box.drillcore_box__depth_other"
                        />
                        <data-row
                          :title="$t('drillcoreBox.remarks')"
                          :value="box.drillcore_box__remarks"
                        />
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
              <v-progress-circular color="primary darken-2" indeterminate />
            </template>
            <template #no-more>{{ $t('infinite.noMore') }}</template>
            <template #error="{ trigger }">
              <div>
                {{ $t('infinite.error') }}
              </div>
              <br />
              <v-btn outlined color="primary darken-2" @click="trigger">
                {{ $t('infinite.retry') }}
              </v-btn>
            </template>
          </infinite-loading>
        </client-only>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { isNull, debounce } from 'lodash'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import { DRILLCORE_BOX } from '~/constants'

export default {
  components: { DataRow, LinkDataRow },
  props: {
    drillcore: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      page: 1,
      boxes: [],
      search: '',
    }
  },
  methods: {
    isNull,
    boxHasInfo(box) {
      return (
        box.drillcore_box__depth_start ||
        box.drillcore_box__depth_end ||
        box.drillcore_box__stratigraphy_top ||
        box.drillcore_box__stratigraphy_base ||
        box.drillcore_box__depth_other ||
        box.drillcore_box__remarks
      )
    },
    infiniteHandler($state) {
      if (this.drillcore) {
        const paginateBy = 5
        this.$services.sarvREST
          .getResourceList('attachment_link', {
            defaultParams: {
              order_by: 'drillcore_box__depth_start,drillcore_box',
              drillcore_box__drillcore: this.drillcore,
              attachment__is_preferred: true,
              page: this.page,
              paginate_by: paginateBy,
              distinct: true,
              fields:
                'id,drillcore_box,attachment__filename,drillcore_box__number,drillcore_box__stratigraphy_top,drillcore_box__stratigraphy_top__stratigraphy,drillcore_box__stratigraphy_top__stratigraphy_en,drillcore_box__stratigraphy_base,drillcore_box__stratigraphy_base__stratigraphy,drillcore_box__stratigraphy_base__stratigraphy_en,drillcore_box__depth_start,drillcore_box__depth_end,drillcore_box__depth_other,drillcore_box__remarks,attachment__is_preferred',
            },
            search: this.search,
            queryFields: this.$getQueryFields(DRILLCORE_BOX.queryFields),
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
      } else {
        $state.error()
      }
    },
    handleSearch: debounce(function () {
      this.boxes = []
      if (this.page !== 1) this.page = 1

      this.$refs.infiniteLoading.status = 1
      this.$refs.infiniteLoading.$emit(
        'infinite',
        this.$refs.infiniteLoading.stateChanger
      )
    }, 500),
  },
}
</script>
