<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
    <template #title>
      <header-detail :ids="ids" :title="title" />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row
            :title="$t('site.name').toString()"
            :value="
              $translate({
                et: site.name,
                en: site.name_en,
              })
            "
          />
          <table-row
            v-if="area"
            :value="area"
            :title="$t('site.area').toString()"
          >
            <template #value>
              <a
                v-if="area.area_type === 2"
                class="text-link"
                @click="$openTurba('turbaala', site.area)"
              >
                {{
                  $translate({
                    et: area.name,
                    en: area.name_en,
                  })
                }}
                <v-icon small color="primary darken-2">{{
                  icons.mdiOpenInNew
                }}</v-icon>
              </a>
              <nuxt-link
                v-else
                class="text-link"
                :to="
                  localePath({
                    name: 'area-id',
                    params: { id: area.id },
                  })
                "
              >
                {{
                  $translate({
                    et: area.name,
                    en: area.name_en,
                  })
                }}
              </nuxt-link>
            </template>
          </table-row>

          <table-row
            v-if="area && area.area_type === 2"
            :value="area"
            :title="$t('site.areaText1').toString()"
          >
            <template #value>
              <span v-for="(item, index) in planArray" :key="index">
                <a
                  class="text-link"
                  :download="item.trim()"
                  @click="$openTurba('plaanid', item.trim(), false)"
                >
                  {{ item }}
                  <v-icon small color="primary darken-2">
                    {{ icons.mdiFileDownloadOutline }}
                  </v-icon>
                </a>
                <span v-if="index !== planArray.length - 1" class="mr-1"
                  >|</span
                >
              </span>
            </template>
          </table-row>
          <table-row
            v-if="site.project"
            :title="$t('site.project').toString()"
            :value="
              $translate({
                et: site.project.name,
                en: site.project.name_en,
              })
            "
          />
          <table-row
            :title="$t('site.coordx').toString()"
            :value="site.coordx"
          />
          <table-row
            :title="$t('site.coordy').toString()"
            :value="site.coordy"
          />
          <table-row
            :title="$t('site.extent').toString()"
            :value="site.extent"
          />
          <table-row :title="$t('site.depth').toString()" :value="site.depth" />

          <table-row-link
            v-if="locality"
            :title="$t('locality.locality').toString()"
            :value="
              $translate({
                et: locality.locality,
                en: locality.locality_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'locality-id',
                params: { id: locality.id },
              })
            "
          />
          <table-row
            v-if="locality && locality.country"
            :title="$t('locality.country').toString()"
            :value="
              isNil(
                $translate({
                  et: locality.country.value,
                  en: locality.country.value_en,
                })
              )
            "
          >
            <template #value>
              {{
                $t('locality.countryFormat', {
                  name: $translate({
                    et: locality.country.value,
                    en: locality.country.value_en,
                  }),
                  iso: locality.country.iso_code,
                })
              }}
            </template>
          </table-row>
          <!-- ???: What is this if statment? Why does this element have to be shown when there is a locality id?  -->
          <table-row
            v-if="site.latitude && site.longitude"
            :title="$t('locality.latitude').toString()"
            :value="site.latitude"
          />
          <table-row
            v-if="site.latitude && site.longitude"
            :title="$t('locality.longitude').toString()"
            :value="site.longitude"
          />
          <table-row
            v-if="elevation"
            :title="$t('site.elevation').toString()"
            :value="elevation"
          />
          <table-row
            v-if="locality"
            :title="$t('locality.depth').toString()"
            :value="locality.depth"
          />
          <table-row
            v-if="site.location_accuracy"
            :title="$t('site.locationAccuracy').toString()"
            :value="site.location_accuracy"
          />
          <table-row
            v-if="site.coord_det_method"
            :title="$t('site.coordDetMethod').toString()"
            :value="
              $translate({
                et: site.coord_det_method.value,
                en: site.coord_det_method.value_en,
              })
            "
          />
          <table-row
            :title="$t('site.description').toString()"
            :value="site.description"
          />
          <table-row
            v-if="site.remarks"
            :title="$t('site.remarks').toString()"
            :value="site.remarks"
          />
          <table-row
            v-if="site.remarks_location"
            :title="$t('site.remarksLocation').toString()"
            :value="site.remarks_location"
          />
          <table-row
            v-if="studied"
            :title="$t('site.studied').toString()"
            :value="studied"
          />
          <table-row
            v-if="site.date_added"
            :title="$t('site.dateAdded').toString()"
            :value="$formatDate(site.date_added)"
          />
          <table-row
            v-if="site.date_changed"
            :title="$t('site.dateChanged').toString()"
            :value="$formatDate(site.date_changed)"
          />
        </base-table>
      </v-card-text>
    </template>

    <template
      v-if="site && ((site.latitude && site.longitude) || site.locality_id)"
      #column-right
    >
      <v-card-text>
        <v-card
          v-if="site.latitude && site.longitude"
          id="map-wrap"
          elevation="0"
        >
          <map-detail
            rounded
            :estonian-map="
              locality && locality.country
                ? locality.country.value === 'Eesti'
                : false
            "
            :estonian-bedrock-overlay="
              locality && locality.country
                ? locality.country.value === 'Eesti'
                : false
            "
            site-overlay
            :center="{
              latitude: site.latitude,
              longitude: site.longitude,
            }"
            :markers="[
              {
                latitude: site.latitude,
                longitude: site.longitude,
                text: $translate({
                  et: site.name,
                  en: site.name_en,
                }),
              },
            ]"
          />
        </v-card>
      </v-card-text>
    </template>

    <template #bottom>
      <image-bar v-if="images.length > 0" class="mt-4" :images="images">
        <template #image="{ item, on, attrs }">
          <v-hover v-slot="{ hover }">
            <v-img
              v-bind="attrs"
              :src="
                $img(
                  `${item.attachment.uuid_filename}`,
                  { size: 'small' },
                  { provider: 'geocollections' }
                )
              "
              :lazy-src="
                $img(
                  `${item.attachment.uuid_filename}`,
                  { size: 'small' },
                  { provider: 'geocollections' }
                )
              "
              max-width="200"
              max-height="200"
              width="200"
              height="200"
              :class="{
                'elevation-4': hover,
                'elevation-2': !hover,
              }"
              class="rounded cursor-pointer grey lighten-2 transition-swing"
              v-on="on"
              @click="
                $router.push(
                  localePath({
                    name: 'file-id',
                    params: { id: item.attachment.id },
                  })
                )
              "
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
        </template>
        <template #info="{ item }">
          <div v-if="item.attachment.author">
            <span class="font-weight-bold"
              >{{ $t('attachment.author') }}:
            </span>
            <span>{{ item.attachment.author.agent }}</span>
          </div>
          <div
            v-if="
              item.attachment.date_created || item.attachment.date_created_free
            "
          >
            <span class="font-weight-bold">{{ $t('locality.date') }}: </span>
            <span v-if="item.attachment.date_created">
              {{ $formatDate(item.attachment.date_created) }}
            </span>
            <span v-else>{{ item.attachment.date_created_free }}</span>
          </div>
          <div v-else>{{ $t('common.clickToOpen') }}</div>
        </template>
      </image-bar>
      <v-card v-if="tabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="tabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script lang="ts">
import { mdiOpenInNew, mdiFileDownloadOutline } from '@mdi/js'
import isNil from 'lodash/isNil'
import {
  computed,
  defineComponent,
  reactive,
  toRef,
  toRefs,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import MapDetail from '~/components/map/MapDetail.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import Tabs from '~/components/Tabs.vue'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import ImageBar from '~/components/ImageBar.vue'
import { Tab, TABS_SITE } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: {
    HeaderDetail,
    Tabs,
    MapDetail,
    TableRow,
    TableRowLink,
    Detail,
    ImageBar,
    BaseTable,
  },
  setup() {
    const { $services, $hydrateTab, $translate, $formatDate, i18n, $img } =
      useContext()
    const route = useRoute()
    const state = reactive({
      site: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
      images: [] as any[],
    })
    const planArray = computed(() => {
      return state.site?.area?.text1 ? state.site?.area?.text1.split(',') : []
    })
    const elevation = computed(() => {
      return state.site?.elevation_accuracy
        ? `${state.site?.elevation} (± ${state.site?.elevation_accuracy})`
        : state.site?.elevation
    })
    const studied = computed(() => {
      return state.site?.date_start
        ? $formatDate(state.site?.date_start)
        : state.site?.date_free
    })
    const locality = computed(() => state.site?.locality)
    const area = computed(() => state.site?.area)

    const icons = computed(() => {
      return {
        mdiOpenInNew,
        mdiFileDownloadOutline,
      }
    })
    const { fetchState } = useFetch(async () => {
      const sitePromise = $services.sarvREST.getResource(
        'site',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 2,
          },
        }
      )
      const attachmentPromise = $services.sarvREST.getResourceList(
        'attachment_link',
        {
          defaultParams: {
            site: route.value.params.id,
            attachment__attachment_format__value__istartswith: 'image',
            nest: 1,
          },
          fields: {},
        }
      )

      const tabs = TABS_SITE.allIds.map((id) => TABS_SITE.byIds[id])
      const hydratedTabsPromise = Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              solr: { default: { fq: `site_id:${route.value.params.id}` } },
              api: { default: { site: route.value.params.id } },
            },
          })
        )
      )
      const [siteResponse, attachmentResponse, hydratedTabs] =
        await Promise.all([sitePromise, attachmentPromise, hydratedTabsPromise])

      state.ids = siteResponse?.ids
      state.site = siteResponse
      state.images = attachmentResponse.items ?? []
      state.tabs = hydratedTabs.filter((item) => item.count > 0)
    })

    const title = computed(() =>
      $translate({ et: state.site?.name, en: state.site?.name_en })
    )
    useSlugRoute({
      slug: title,
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'site'),
      pending: toRef(fetchState, 'pending'),
      validRoute: toRef(state, 'validRoute'),
    })
    useMeta(() => {
      return {
        title: `${title.value} | ${i18n.t('site.pageTitle')}`,
        meta: [
          {
            property: 'og:title',
            hid: 'og:title',
            content: `${title.value} | ${i18n.t('site.pageTitle')}`,
          },
          {
            property: 'description',
            hid: 'description',
            content: state.site?.description ?? undefined,
          },
          {
            property: 'og:description',
            hid: 'og:description',
            content: state.site?.description ?? undefined,
          },
          {
            property: 'og:image',
            hid: 'og:image',
            content: state.images[0]?.attachment.filename
              ? $img(
                  `${state.images[0]?.attachment.filename}`,
                  { size: 'small' },
                  {
                    provider: 'geocollections',
                  }
                )
              : undefined,
          },
        ],
      }
    })
    return {
      ...toRefs(state),
      title,
      planArray,
      elevation,
      studied,
      locality,
      area,
      icons,
      isNil,
    }
  },
  head: {},
  computed: {},
})
</script>
