<template>
  <v-row>
    <v-col>
      <prev-next-nav-title :ids="ids" :title="drillcoreBoxTitle" />
      <v-card v-if="activeImage" class="my-2 mx-4">
        <v-card-text>
          <client-only>
            <template #placeholder>
              <box-image-loader height="400" />
            </template>
            <v-hover v-slot="{ hover }">
              <!-- TODO: Add placeholder, for case when box does not have a picture (filename check) -->
              <v-img
                contain
                class="ma-4 transition-swing cursor-pointer rounded"
                :class="{
                  'elevation-8': hover,
                  'elevation-4': !hover,
                }"
                :lazy-src="`https://files.geocollections.info/small/${activeImage.attachment__uuid_filename}`"
                :src="`https://files.geocollections.info/large/${activeImage.attachment__uuid_filename}`"
                max-width="2000"
                max-height="1000"
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
                  class="text-link"
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
                  max-height="200"
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
                <link-data-row
                  nuxt
                  :title="$t('drillcoreBox.drillcore')"
                  :value="
                    $translate({
                      et: drillcoreBox.drillcore__drillcore,
                      en: drillcoreBox.drillcore__drillcore_en,
                    })
                  "
                  :href="
                    localePath({
                      name: 'drillcore-id',
                      params: { id: drillcoreBox.drillcore__id },
                    })
                  "
                />
                <data-row
                  :title="$t('drillcoreBox.depthStart')"
                  :value="drillcoreBox.depth_start"
                />
                <data-row
                  :title="$t('drillcoreBox.depthEnd')"
                  :value="drillcoreBox.depth_end"
                />
                <data-row
                  :title="$t('drillcoreBox.depthOther')"
                  :value="drillcoreBox.depth_other"
                />
                <data-row
                  :title="$t('drillcoreBox.diameter')"
                  :value="drillcoreBox.diameter"
                />
                <link-data-row
                  :title="$t('drillcoreBox.stratigraphyTop')"
                  :value="
                    $translate({
                      et: drillcoreBox.stratigraphy_top__stratigraphy,
                      en: drillcoreBox.stratigraphy_top__stratigraphy_en,
                    })
                  "
                  nuxt
                  :href="
                    localePath({
                      name: 'stratigraphy-id',
                      params: { id: drillcoreBox.stratigraphy_top_id },
                    })
                  "
                />
                <data-row
                  :title="$t('drillcoreBox.stratigraphyTopFree')"
                  :value="drillcoreBox.stratigraphy_top_free"
                />
                <link-data-row
                  :title="$t('drillcoreBox.stratigraphyBase')"
                  :value="
                    $translate({
                      et: drillcoreBox.stratigraphy_base__stratigraphy,
                      en: drillcoreBox.stratigraphy_base__stratigraphy_en,
                    })
                  "
                  nuxt
                  :href="
                    localePath({
                      name: 'stratigraphy-id',
                      params: { id: drillcoreBox.stratigraphy_base_id },
                    })
                  "
                />
                <data-row
                  :title="$t('drillcoreBox.stratigraphyBaseFree')"
                  :value="drillcoreBox.stratigraphy_base_free"
                />
                <data-row
                  :title="$t('drillcoreBox.remarks')"
                  :value="drillcoreBox.remarks"
                />
                <data-row
                  :title="$t('drillcoreBox.id')"
                  :value="drillcoreBox.id"
                />
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
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import PrevNextNavTitle from '~/components/PrevNextNavTitle.vue'

export default {
  components: { Tabs, BoxImageLoader, DataRow, LinkDataRow, PrevNextNavTitle },
  async asyncData({ $axios, params, route, error, app }) {
    try {
      const drillcoreBoxResponse = await app.$services.sarvREST.getResource(
        'drillcore_box',
        params.id
      )
      const ids = drillcoreBoxResponse?.ids
      const drillcoreBox = drillcoreBoxResponse.results[0]

      const attachmentLinkResponse = await $axios.$get(
        `https://api.geocollections.info/attachment_link/?drillcore_box=${params.id}&order_by=-attachment__is_preferred&fields=attachment__author__agent,attachment__author_free,attachment__date_created,attachment__date_created_free,attachment__uuid_filename,attachment__is_preferred`
      )
      const drillcoreBoxImages = attachmentLinkResponse.results
      const activeImage = drillcoreBoxImages?.[0]

      const tabs = [
        {
          id: 'sample',
          routeName: 'drillcore_box-id',
          isSolr: true,
          title: 'drillcore.samples',
          count: 0,
          props: {
            locality: drillcoreBox.drillcore__locality,
            depthStart: drillcoreBox.depth_start,
            depthEnd: drillcoreBox.depth_end,
          },
        },
        {
          id: 'analysis',
          routeName: 'drillcore_box-id-analyses',
          title: 'drillcore.analyses',
          isSolr: true,
          count: 0,
          props: {
            locality: drillcoreBox.drillcore__locality,
            depthStart: drillcoreBox.depth_start,
            depthEnd: drillcoreBox.depth_end,
          },
        },
        {
          id: 'specimen',
          routeName: 'drillcore_box-id-specimens',
          title: 'drillcore.specimens',
          isSolr: true,
          count: 0,
          props: {
            locality: drillcoreBox.drillcore__locality,
            depthStart: drillcoreBox.depth_start,
            depthEnd: drillcoreBox.depth_end,
          },
        },
      ]

      return {
        drillcoreBox,
        drillcoreBoxImages,
        activeImage,
        ids,
        initActiveTab: route.path,
        tabs:
          !isNil(drillcoreBox?.drillcore__locality) &&
          !isNil(drillcoreBox?.depth_start) &&
          !isNil(drillcoreBox?.depth_end)
            ? await Promise.all(
                tabs.map(
                  async (tab) =>
                    await app.$hydrateCount(tab, {
                      solr: {
                        default: {
                          fq: `locality_id:${drillcoreBox.drillcore__locality} AND (depth:[${drillcoreBox.depth_start} TO ${drillcoreBox.depth_end}] OR depth_interval:[${drillcoreBox.depth_start} TO ${drillcoreBox.depth_end}])`,
                        },
                      },
                      api: {},
                    })
                )
              )
            : tabs,
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

    drillcoreBoxTitle() {
      let title = this.$translate({
        et: this.drillcoreBox.drillcore__drillcore,
        en: this.drillcoreBox.drillcore__drillcore_en,
      })
      if (this.drillcoreBox.number)
        title += `, ${this.$t('drillcoreBox.nr', {
          number: this.drillcoreBox.number,
        })}`
      return title
    },
  },
  methods: {
    isNull,
    isNil,
  },
}
</script>
