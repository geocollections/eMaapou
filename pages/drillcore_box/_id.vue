<template>
  <v-row>
    <v-col>
      <h1 class="text-center py-3 page-title">
        {{ $t('drillcoreBox.nr', { number: drillcoreBox.number }) }}
      </h1>
      <div class="d-flex justify-space-between">
        <nuxt-link
          class="text-link"
          :to="
            localePath({
              params: { id: parseInt($route.params.id) - 1 },
            })
          "
        >
          {{ $t('common.previous') }}
        </nuxt-link>

        <nuxt-link
          class="text-link"
          :to="
            localePath({
              params: { id: parseInt($route.params.id) + 1 },
            })
          "
        >
          {{ $t('common.next') }}
        </nuxt-link>
      </div>
      <v-card class="my-2">
        <v-card-text>
          <client-only>
            <template #placeholder>
              <box-image-loader height="400" />
            </template>
            <v-hover v-slot="{ hover }">
              <!-- TODO: Add placeholder, for case when box does not have a picture (filename check) -->
              <v-img
                contain
                class="ma-4 transition-swing cursor-pointer"
                :class="{
                  'elevation-8': hover,
                  'elevation-4': !hover,
                }"
                :lazy-src="`https://files.geocollections.info/small/${activeBox.attachment__uuid_filename}`"
                :src="`https://files.geocollections.info/large/${activeBox.attachment__uuid_filename}`"
                max-width="2000"
                @click="
                  openImage(
                    activeBox.attachment__uuid_filename
                  )
                "
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
            </v-hover>
          </client-only>

          <div
            class="d-flex justify-center flex-column justify-md-space-between flex-md-row mx-8"
          >
            <div class="text-center text-md-left">
              <div v-if="activeBox.attachment__author__agent">
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.author') }}:
                </span>
                <span>{{ activeBox.attachment__author__agent }}</span>
              </div>
              <div
                v-if="
                  activeBox.attachment__date_created ||
                  activeBox.attachment__date_created_free
                "
              >
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.date') }}:
                </span>
                <span v-if="activeBox.attachment__date_created">{{
                  activeBox.attachment__date_created
                }}</span>
                <span v-else>{{
                  activeBox.attachment__date_created_free
                }}</span>
              </div>
            </div>

            <div class="text-center">
              <span v-for="(item, index) in imageSizes" :key="index">
                <a
                  class="text-link underline"
                  :href="`https://files.geocollections.info/${
                    item === 'original' ? '' : `${item}/`
                  }${activeBox.attachment__uuid_filename}`"
                  target="ImageWindow"
                >
                  {{ $t(`common.${item}`) }}
                </a>
                <span v-if="index < imageSizes.length - 1">| </span>
              </span>
            </div>
          </div>
        </v-card-text>

        <!-- Todo: Thumbnails here #22-->
        <v-card-text
          v-if="drillcoreBoxes && drillcoreBoxes.length > 1"
          class="pt-0"
        >
          <div class="d-flex ma-2 align-center" style="overflow-x: auto">
            <div
              v-for="(item, index) in drillcoreBoxes"
              :key="index"
              class="ma-2"
            >
              <v-hover v-slot="{ hover }">
                <v-img
                  :src="`https://files.geocollections.info/small/${item.attachment__uuid_filename}`"
                  :lazy-src="`https://files.geocollections.info/small/${item.attachment__uuid_filename}`"
                  max-width="200"
                  :class="{
                    'elevation-4': hover,
                    'elevation-2': !hover,
                  }"
                  class="grey lighten-2 rounded transition-swing cursor-pointer"
                  @click="activeBox = drillcoreBoxes[index]"
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
              </v-hover>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card flat tile>
        <v-card-title>{{ $t('common.general') }}</v-card-title>
        <v-card-text>
          <v-simple-table dense class="custom-table">
            <template #default>
              <tbody>
                <tr>
                  <td>{{ $t('drillcoreBox.drillcore') }}</td>
                  <td
                    v-if="isNull(drillcoreBox.drillcore__id)"
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <nuxt-link
                      class="text-link underline"
                      :to="
                        localePath({
                          name: 'drillcore-id',
                          params: { id: drillcoreBox.drillcore__id },
                        })
                      "
                    >
                      {{
                        $translate({
                          et: drillcoreBox.drillcore__drillcore,
                          en: drillcoreBox.drillcore__drillcore_en,
                        })
                      }}
                    </nuxt-link>
                  </td>
                </tr>

                <tr>
                  <td>{{ $t('drillcoreBox.depthStart') }}</td>

                  <td v-if="isNull(drillcoreBox.depth_start)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>{{ drillcoreBox.depth_start }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.depthEnd') }}</td>
                  <td v-if="isNull(drillcoreBox.depth_end)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>{{ drillcoreBox.depth_end }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.depthOther') }}</td>
                  <td v-if="isNull(drillcoreBox.depth_other)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>{{ drillcoreBox.depth_other }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.diameter') }}</td>
                  <td v-if="isNull(drillcoreBox.diameter)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>{{ drillcoreBox.diameter }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.stratigraphyTop') }}</td>

                  <td
                    v-if="isNull(drillcoreBox.stratigraphy_top_id)"
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <a
                      class="text-link underline"
                      @click="
                        openGeoDetail({
                          table: 'stratigraphy',
                          id: drillcoreBox.stratigraphy_top_id,
                        })
                      "
                    >
                      {{
                        $translate({
                          et: drillcoreBox.stratigraphy_top__stratigraphy,
                          en: drillcoreBox.stratigraphy_top__stratigraphy_en,
                        })
                      }}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.stratigraphyTopFree') }}</td>
                  <td
                    v-if="isNull(drillcoreBox.stratigraphy_top_free)"
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>{{ drillcoreBox.stratigraphy_top_free }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.stratigraphyBase') }}</td>
                  <td
                    v-if="isNull(drillcoreBox.stratigraphy_base_id)"
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <a
                      class="text-link underline"
                      @click="
                        openGeoDetail({
                          table: 'stratigraphy',
                          id: drillcoreBox.stratigraphy_base_id,
                        })
                      "
                    >
                      {{
                        $translate({
                          et: drillcoreBox.stratigraphy_base__stratigraphy,
                          en: drillcoreBox.stratigraphy_base__stratigraphy_en,
                        })
                      }}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.stratigraphyBaseFree') }}</td>
                  <td
                    v-if="isNull(drillcoreBox.stratigraphy_base_free)"
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>{{ drillcoreBox.stratigraphy_base_free }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.remarks') }}</td>
                  <td v-if="isNull(drillcoreBox.remarks)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>{{ drillcoreBox.remarks }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.id') }}</td>
                  <td>{{ drillcoreBox.id }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <v-card class="mt-2 pb-2">
        <tabs :items="tabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNull } from 'lodash'
import global from '@/mixins/global'
import BoxImageLoader from '@/components/BoxImageLoader'

export default {
  components: { BoxImageLoader },
  mixins: [global],
  async asyncData({ $axios, params, route, error }) {
    try {
      const drillcoreBoxResponse = await $axios.$get(
        `https://api.geocollections.info/drillcore_box/${params.id}`
      )

      const results = drillcoreBoxResponse.results
      const drillcoreBox = results[0]
      return {
        drillcoreBox,
        drillcoreBoxes: results,
        activeBox: drillcoreBox,
        initActiveTab: route.path,
        tabs: [
          {
            routeName: 'drillcore_box-id',
            title: 'drillcore.samples',
            props: {
              locality: drillcoreBox.drillcore__locality,
              depthStart: drillcoreBox.depth_start,
              depthEnd: drillcoreBox.depth_end,
            },
          },
          {
            routeName: 'drillcore_box-id-analyses',
            title: 'drillcore.analyses',
            props: {
              locality: drillcoreBox.drillcore__locality,
              depthStart: drillcoreBox.depth_start,
              depthEnd: drillcoreBox.depth_end,
            },
          },
          {
            routeName: 'drillcore_box-id-specimens',
            title: 'drillcore.specimens',
            props: {
              locality: drillcoreBox.drillcore__locality,
              depthStart: drillcoreBox.depth_start,
              depthEnd: drillcoreBox.depth_end,
            },
          },
        ],
      }
    } catch (err) {
      error({
        message: `Cannot find drillcore box ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      imageSizes: ['small', 'medium', 'large', 'original'],
    }
  },
  head() {
    return {
      title: `${this.$t('drillcoreBox.nr', {
        number: this.drillcoreBox.number,
      })} - ${this.$translate({
        et: this.drillcoreBox.drillcore__drillcore,
        en: this.drillcoreBox.drillcore__drillcore_en,
      })}`,
    }
  },
  methods: {
    isNull,
    openImage(filename, size = 'large') {
      if (filename && size) {
        window.open(
          `https://files.geocollections.info/${size}/${filename}`,
          'ImageWindow'
        )
      }
    },
  },
}
</script>
