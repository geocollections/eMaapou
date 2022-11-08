<template>
  <detail v-if="!$fetchState.pending">
    <template #title>
      <header-detail :ids="ids" :title="pageTitle" />
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
            class="justify-center mx-8 d-flex flex-column justify-md-space-between flex-md-row"
          >
            <!-- eslint-enable prettier/prettier -->
            <div class="text-center text-md-left">
              <!-- <div
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
              </div> -->
              <!-- <div
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
              </div> -->
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
          <base-table>
            <table-row-link
              v-if="drillcore"
              nuxt
              :title="$t('drillcoreBox.drillcore')"
              :value="
                $translate({
                  et: drillcore.drillcore,
                  en: drillcore.drillcore_en,
                })
              "
              :href="
                localePath({
                  name: 'drillcore-id',
                  params: { id: drillcore.id },
                })
              "
            />
            <table-row
              :title="$t('drillcoreBox.depthStart')"
              :value="drillcoreBox.depth_start"
            />
            <table-row
              :title="$t('drillcoreBox.depthEnd')"
              :value="drillcoreBox.depth_end"
            />
            <table-row
              :title="$t('drillcoreBox.depthOther')"
              :value="drillcoreBox.depth_other"
            />
            <table-row
              :title="$t('drillcoreBox.diameter')"
              :value="drillcoreBox.diameter"
            />
            <table-row-link
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
            <table-row
              :title="$t('drillcoreBox.stratigraphyTopFree')"
              :value="drillcoreBox.stratigraphy_top_free"
            />
            <table-row-link
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
                  params: { id: drillcoreBox.stratigraphy_base.id },
                })
              "
            />
            <table-row
              :title="$t('drillcoreBox.stratigraphyBaseFree')"
              :value="drillcoreBox.stratigraphy_base_free"
            />

            <table-row
              v-if="drillcoreBox.date_added"
              :title="$t('drillcoreBox.dateAdded')"
              :value="$formatDate(drillcoreBox.date_added)"
            />
            <table-row
              v-if="drillcoreBox.date_changed"
              :title="$t('drillcoreBox.dateChanged')"
              :value="$formatDate(drillcoreBox.date_changed)"
            />
            <table-row
              :title="$t('drillcoreBox.remarks')"
              :value="drillcoreBox.remarks"
            />
          </base-table>
        </v-card-text>
      </v-card>
    </template>
    <template #bottom>
      <v-card v-if="tabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="tabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script lang="ts">
import isNil from 'lodash/isNil'
import isNull from 'lodash/isNull'

import {
  computed,
  defineComponent,
  reactive,
  toRef,
  toRefs,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import Tabs from '~/components/Tabs.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import { Tab, TABS_DRILLCORE_BOX } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: {
    Tabs,
    TableRow,
    TableRowLink,
    HeaderDetail,
    Detail,
    BaseTable,
  },
  setup() {
    const { $services, $hydrateTab, $translate, i18n } = useContext()
    const route = useRoute()
    const state = reactive({
      imageSizes: ['small', 'medium', 'large', 'original'],
      drillcoreBox: null as any,
      drillcoreBoxImages: [] as any[],
      activeImage: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
    })
    const drillcore = computed(() => state.drillcoreBox?.drillcore)

    const pageTitle = computed(
      () =>
        `${i18n.t('drillcoreBox.nr', {
          number: state.drillcoreBox?.number,
        })} - ${$translate({
          et: state.drillcoreBox?.drillcore?.drillcore,
          en: state.drillcoreBox?.drillcore?.drillcore_en,
        })}`
    )

    const { fetchState } = useFetch(async () => {
      const drillcoreBoxPromise = $services.sarvREST.getResource(
        'drillcore_box',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 1,
          },
        }
      )
      const attachmentLinkPromise = $services.sarvREST.getResourceList(
        'attachment_link',
        {
          defaultParams: {
            drillcore_box: route.value.params.id,
            nest: 2,
            ordering: '-attachment__is_preferred',
          },
        }
      )

      const [drillcoreBoxResponse, attachmentLinkResponse] = await Promise.all([
        drillcoreBoxPromise,
        attachmentLinkPromise,
      ])

      state.ids = drillcoreBoxResponse?.ids
      state.drillcoreBox = drillcoreBoxResponse

      state.drillcoreBoxImages = attachmentLinkResponse.items
      state.activeImage = state.drillcoreBoxImages?.[0]

      const tabs = TABS_DRILLCORE_BOX.allIds.map(
        (id) => TABS_DRILLCORE_BOX.byIds[id]
      )

      state.tabs = (
        !isNil(state.drillcoreBox?.drillcore?.locality) &&
        !isNil(state.drillcoreBox?.depth_start) &&
        !isNil(state.drillcoreBox?.depth_end)
          ? await Promise.all(
              tabs.map(
                async (tab) =>
                  await $hydrateTab(tab, {
                    props: {
                      locality: state.drillcoreBox.drillcore.locality,
                      depthStart: state.drillcoreBox.depth_start,
                      depthEnd: state.drillcoreBox.depth_end,
                    },
                    countParams: {
                      solr: {
                        default: {
                          fq: `locality_id:${state.drillcoreBox.drillcore.locality} AND (depth:[${state.drillcoreBox.depth_start} TO ${state.drillcoreBox.depth_end}] OR depth_interval:[${state.drillcoreBox.depth_start} TO ${state.drillcoreBox.depth_end}])`,
                        },
                      },
                      api: {},
                    },
                  })
              )
            )
          : tabs
      ).filter((item) => item.count > 0)
    })

    const title = computed(
      () =>
        `${$translate({
          et: state.drillcoreBox?.drillcore?.drillcore,
          en: state.drillcoreBox?.drillcore?.drillcore_en,
        })}-${state.drillcoreBox?.number}`
    )
    state.validRoute = useSlugRoute({
      slug: title,
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'drillcoreBox'),
      pending: toRef(fetchState, 'pending'),
    }).value

    return { ...toRefs(state), drillcore, pageTitle }
  },
  head() {
    return {
      title: `${this.pageTitle} | ${this.$t('drillcoreBox.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.pageTitle} | ${this.$t('drillcoreBox.pageTitle')}`,
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
            // @ts-ignore
            `${this.activeImage?.attachment?.uuid_filename}`,
            { size: 'medium' },
            {
              provider: 'geocollections',
            }
          ),
        },
      ],
    }
  },
  methods: {
    isNull,
    isNil,
  },
})
</script>
