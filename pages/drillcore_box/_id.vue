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
                :lazy-src="`https://files.geocollections.info/small/${activeImage.attachment__uuid_filename}`"
                :src="`https://files.geocollections.info/large/${activeImage.attachment__uuid_filename}`"
                max-width="2000"
                @click="$openImage(activeImage.attachment__uuid_filename)"
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
              <div
                v-if="
                  activeImage.attachment__author__agent ||
                  activeImage.attachment__author_free
                "
              >
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.author') }}:
                </span>
                <span v-if="activeImage.attachment__author__agent">{{
                  activeImage.attachment__author__agent
                }}</span>
                <span v-else>{{ activeImage.attachment__author_free }}</span>
              </div>
              <div
                v-if="
                  activeImage.attachment__date_created ||
                  activeImage.attachment__date_created_free
                "
              >
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.date') }}:
                </span>
                <span v-if="activeImage.attachment__date_created">{{
                  activeImage.attachment__date_created
                }}</span>
                <span v-else>{{
                  activeImage.attachment__date_created_free
                }}</span>
              </div>
            </div>

            <div class="text-center">
              <span v-for="(size, index) in imageSizes" :key="index">
                <a
                  class="text-link underline"
                  @click="
                    $openImage(activeImage.attachment__uuid_filename, size)
                  "
                >
                  {{ $t(`common.${size}`) }}
                </a>
                <span v-if="index < imageSizes.length - 1">| </span>
              </span>
            </div>
          </div>
        </v-card-text>

        <!-- Todo: Thumbnails here #22-->
        <v-card-text
          v-if="drillcoreBoxImages && drillcoreBoxImages.length > 1"
          class="pt-0"
        >
          <div class="d-flex ma-2 align-center" style="overflow-x: auto">
            <div
              v-for="(item, index) in drillcoreBoxImages"
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
                  @click="activeImage = drillcoreBoxImages[index]"
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
                        $openGeoDetail(
                          'stratigraphy',
                          drillcoreBox.stratigraphy_top_id
                        )
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
                        $openGeoDetail(
                          'stratigraphy',
                          drillcoreBox.stratigraphy_base_id
                        )
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

      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNull, isNil } from 'lodash'
import BoxImageLoader from '@/components/BoxImageLoader'
import Tabs from '@/components/Tabs'

export default {
  components: { Tabs, BoxImageLoader },
  layout: 'detail',
  async asyncData({ $axios, params, route, error, app }) {
    try {
      const drillcoreBoxResponse = await app.$services.sarvREST.getResource(
        'drillcore_box',
        params.id
      )
      const drillcoreBox = drillcoreBoxResponse.results[0]

      const attachmentLinkResponse = await $axios.$get(
        `https://api.geocollections.info/attachment_link/?drillcore_box=${params.id}&order_by=-attachment__is_preferred&fields=attachment__author__agent,attachment__author_free,attachment__date_created,attachment__date_created_free,attachment__uuid_filename,attachment__is_preferred`
      )
      const drillcoreBoxImages = attachmentLinkResponse.results
      const activeImage = drillcoreBoxImages[0]

      const tabs = [
        {
          id: 'sample',
          routeName: 'drillcore_box-id',
          title: 'drillcore.samples',
          count: 0,
          props: {},
        },
        {
          id: 'analysis',
          routeName: 'drillcore_box-id-analyses',
          title: 'drillcore.analyses',
          count: 0,
          props: {},
        },
        {
          id: 'specimen',
          routeName: 'drillcore_box-id-specimens',
          title: 'drillcore.specimens',
          count: 0,
          props: {},
        },
      ]

      if (
        drillcoreBox?.drillcore__locality &&
        drillcoreBox?.depth_start &&
        drillcoreBox?.depth_end
      ) {
        const params = {
          fq: `locality_id:${drillcoreBox.drillcore__locality} AND (depth:[${drillcoreBox.depth_start} TO ${drillcoreBox.depth_end}] OR depth_interval:[${drillcoreBox.depth_start} TO ${drillcoreBox.depth_end}])`,
        }
        const forLoop = async () => {
          for (const item of tabs) {
            const countResponse = await app.$services.sarvSolr.getResourceCount(
              item.id,
              params
            )
            item.count = countResponse?.count ?? 0
            item.props = {
              locality: drillcoreBox.drillcore__locality,
              depthStart: drillcoreBox.depth_start,
              depthEnd: drillcoreBox.depth_end,
            }
          }
        }
        await forLoop()
      }

      return {
        drillcoreBox,
        drillcoreBoxImages,
        activeImage,
        initActiveTab: route.path,
        tabs,
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
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
  },
  methods: {
    isNull,
    isNil,
  },
}
</script>
