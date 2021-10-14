<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="drillcoreBoxTitle"
        class="title-main"
      />
    </template>
    <template #top>
      <v-card v-if="activeImage" class="my-2">
        <v-card-text>
          <v-hover v-slot="{ hover }">
            <!-- TODO: Add placeholder, for case when box does not have a picture (filename check) -->
            <v-img
              contain
              class="rounded cursor-pointer ma-4 transition-swing"
              :class="{
                'elevation-8': hover,
                'elevation-4': !hover,
              }"
              :lazy-src="
                $img(
                  activeImage.attachment.uuid_filename,
                  { size: 'small' },
                  { provider: 'geocollections' }
                )
              "
              :src="
                $img(
                  activeImage.attachment.uuid_filename,
                  { size: 'large' },
                  { provider: 'geocollections' }
                )
              "
              max-width="2000"
              max-height="1000"
              @click="$openImage(activeImage.attachment.uuid_filename)"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-hover>

          <!-- eslint-disable prettier/prettier -->
          <div
            class="
              justify-center
              mx-8
              d-flex
              flex-column
              justify-md-space-between
              flex-md-row
            "
          >
            <!-- eslint-enable prettier/prettier -->
            <div class="text-center text-md-left">
              <div
                v-if="
                  activeImage.attachment.author ||
                  activeImage.attachment.author_free
                "
              >
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.author') }}:
                </span>
                <span v-if="activeImage.attachment.author.agent">{{
                  activeImage.attachment.author.agent
                }}</span>
                <span v-else>{{ activeImage.attachment.author_free }}</span>
              </div>
              <div
                v-if="
                  activeImage.attachment.date_created ||
                  activeImage.attachment.date_created_free
                "
              >
                <span class="font-weight-bold"
                  >{{ $t('drillcoreBox.date') }}:
                </span>
                <span v-if="activeImage.attachment.date_created">{{
                  activeImage.attachment.date_created
                }}</span>
                <span v-else>{{
                  activeImage.attachment.date_created_free
                }}</span>
              </div>
            </div>

            <div class="text-center">
              <span v-for="(size, index) in imageSizes" :key="index">
                <a
                  class="text-link"
                  @click="
                    $openImage(activeImage.attachment.uuid_filename, size)
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
                  :src="
                    $img(
                      item.attachment.uuid_filename,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
                  :lazy-src="
                    $img(
                      item.attachment.uuid_filename,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
                  max-width="200"
                  max-height="200"
                  :class="{
                    'elevation-4': hover,
                    'elevation-2': !hover,
                  }"
                  class="rounded cursor-pointer grey lighten-2 transition-swing"
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
    </template>
    <template #default>
      <v-card>
        <v-card-title class="subsection-title">{{
          $t('common.general')
        }}</v-card-title>
        <v-card-text>
          <v-simple-table dense class="custom-table">
            <template #default>
              <tbody>
                <link-data-row
                  v-if="drillcoreBox.drillcore"
                  nuxt
                  :title="$t('drillcoreBox.drillcore')"
                  :value="
                    $translate({
                      et: drillcoreBox.drillcore.drillcore,
                      en: drillcoreBox.drillcore.drillcore_en,
                    })
                  "
                  :href="
                    localePath({
                      name: 'drillcore-id',
                      params: { id: drillcoreBox.drillcore.id },
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
                  v-if="drillcoreBox.stratigraphy_top"
                  :title="$t('drillcoreBox.stratigraphyTop')"
                  :value="
                    $translate({
                      et: drillcoreBox.stratigraphy_top.stratigraphy,
                      en: drillcoreBox.stratigraphy_top.stratigraphy_en,
                    })
                  "
                  nuxt
                  :href="
                    localePath({
                      name: 'stratigraphy-id',
                      params: { id: drillcoreBox.stratigraphy_top.id },
                    })
                  "
                />
                <data-row
                  :title="$t('drillcoreBox.stratigraphyTopFree')"
                  :value="drillcoreBox.stratigraphy_top_free"
                />
                <link-data-row
                  v-if="drillcoreBox.stratigraphy_base"
                  :title="$t('drillcoreBox.stratigraphyBase')"
                  :value="
                    $translate({
                      et: drillcoreBox.stratigraphy_base.stratigraphy,
                      en: drillcoreBox.stratigraphy_base.stratigraphy_en,
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
                  v-if="drillcoreBox.date_added"
                  :title="$t('drillcoreBox.dateAdded')"
                  :value="$formatDate(drillcoreBox.date_added)"
                />
                <data-row
                  v-if="drillcoreBox.date_changed"
                  :title="$t('drillcoreBox.dateChanged')"
                  :value="$formatDate(drillcoreBox.date_changed)"
                />
                <data-row
                  :title="$t('drillcoreBox.remarks')"
                  :value="drillcoreBox.remarks"
                />
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </template>
    <template #bottom>
      <v-card
        v-if="filteredTabs.length > 0 && !$fetchState.pending"
        class="mt-4 mb-4"
      >
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNull, isNil } from 'lodash'

import Tabs from '~/components/Tabs.vue'
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Detail from '~/components/templates/Detail.vue'
import { TABS_DRILLCORE_BOX } from '~/constants'

export default {
  components: {
    Tabs,
    DataRow,
    LinkDataRow,
    TitleCardDetail,
    Detail,
  },
  async asyncData({ params, route, error, $services }) {
    try {
      const drillcoreBoxResponse = await $services.sarvREST.getResource(
        'drillcore_box',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = drillcoreBoxResponse?.ids
      const drillcoreBox = drillcoreBoxResponse

      const attachmentLinkResponse = await $services.sarvREST.getResourceList(
        'attachment_link',
        {
          defaultParams: {
            drillcore_box: params.id,
            nest: 2,
            ordering: '-attachment__is_preferred',
          },
        }
      )

      const drillcoreBoxImages = attachmentLinkResponse.items
      const activeImage = drillcoreBoxImages?.[0]

      return {
        drillcoreBox,
        drillcoreBoxImages,
        activeImage,
        ids,
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
      tabs: [],
      initActiveTab: '',
    }
  },
  async fetch() {
    const tabs = TABS_DRILLCORE_BOX.allIds.map(
      (id) => TABS_DRILLCORE_BOX.byIds[id]
    )

    const hydratedTabs =
      !isNil(this.drillcoreBox?.drillcore?.locality) &&
      !isNil(this.drillcoreBox?.depth_start) &&
      !isNil(this.drillcoreBox?.depth_end)
        ? await Promise.all(
            tabs.map(
              async (tab) =>
                await this.$hydrateTab(tab, {
                  props: {
                    locality: this.drillcoreBox.drillcore?.locality,
                    depthStart: this.drillcoreBox.depth_start,
                    depthEnd: this.drillcoreBox.depth_end,
                  },
                  countParams: {
                    solr: {
                      default: {
                        fq: `locality_id:${this.drillcoreBox.drillcore?.locality} AND (depth:[${this.drillcoreBox.depth_start} TO ${this.drillcoreBox.depth_end}] OR depth_interval:[${this.drillcoreBox.depth_start} TO ${this.drillcoreBox.depth_end}])`,
                      },
                    },
                    api: {},
                  },
                })
            )
          )
        : tabs

    const text = `${this.$translate({
      et: this.drillcoreBox.drillcore?.drillcore,
      en: this.drillcoreBox.drillcore?.drillcore_en,
    })}-${this.drillcoreBox.number}`
    const slugRoute = this.$createSlugRoute(this.$route, text)

    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath

    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
  head() {
    return {
      title: this.title,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.title,
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
        {
          property: 'og:image',
          hid: 'og:image',
          content: this.$img(
            `${this.activeImage.attachment.uuid_filename}`,
            { size: 'medium' },
            {
              provider: 'geocollections',
            }
          ),
        },
      ],
    }
  },
  computed: {
    title() {
      return `${this.$t('drillcoreBox.nr', {
        number: this.drillcoreBox.number,
      })} - ${this.$translate({
        et: this.drillcoreBox.drillcore?.drillcore,
        en: this.drillcoreBox.drillcore?.drillcore_en,
      })}`
    },
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },

    drillcoreBoxTitle() {
      let title = this.$translate({
        et: this.drillcoreBox.drillcore?.drillcore,
        en: this.drillcoreBox.drillcore?.drillcore_en,
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
