<template>
  <detail v-if="!$fetchState.pending">
    <template #title>
      <header-detail
        :ids="ids"
        :title="$translate({ et: locality.locality, en: locality.locality_en })"
      />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <base-table>
          <table-row
            :title="$t('locality.name')"
            :value="
              $translate({
                et: locality.locality,
                en: locality.locality_en,
              })
            "
          />
          <table-row
            v-if="type"
            :title="$t('locality.type')"
            :value="
              $translate({
                et: type.value,
                en: type.value_en,
              })
            "
          />
          <table-row
            v-if="country"
            :title="$t('locality.country')"
            :value="
              $translate({
                et: country.value,
                en: country.value_en,
              })
            "
          />
          <table-row
            v-if="municipality"
            :title="$t('locality.parish')"
            :value="
              $translate({
                et: municipality.vald,
                en: municipality.vald_en,
              })
            "
          />
          <table-row
            v-if="settlementUnit"
            :title="$t('locality.settlement')"
            :value="
              $translate({
                et: settlementUnit.asustusyksus,
                en: settlementUnit.asustusyksus_en,
              })
            "
          />
          <table-row
            :title="$t('locality.elevation')"
            :value="locality.elevation"
          />
          <table-row
            :title="$t('locality.latitude')"
            :value="locality.latitude"
          />
          <table-row
            :title="$t('locality.longitude')"
            :value="locality.longitude"
          />
          <table-row
            :title="$t('locality.coordinateSystem')"
            :value="locality.coord_system"
          />
          <table-row
            :title="$t('locality.coordinateX')"
            :value="locality.coordx"
          />
          <table-row
            :title="$t('locality.coordinateY')"
            :value="locality.coordy"
          />
          <table-row
            v-if="coordinatePrecision"
            :title="$t('locality.coordinatePrecision')"
            :value="coordinatePrecision.value"
          />
          <table-row
            v-if="coordinateMethod"
            :title="$t('locality.coordinateMethod')"
            :value="
              $translate({
                et: coordinateMethod.value,
                en: coordinateMethod.value_en,
              })
            "
          />
          <table-row
            v-if="coordinateAgent"
            :title="$t('locality.coordinateAgent')"
            :value="coordinateAgent.agent"
          />
          <table-row
            :title="$t('locality.locationRemarks')"
            :value="locality.remarks_location"
          />
          <table-row-link
            v-if="stratigraphyTop"
            :title="$t('locality.stratigraphyTop')"
            :value="
              $translate({
                et: stratigraphyTop.stratigraphy,
                en: stratigraphyTop.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: locality.stratigraphy_top.id },
              })
            "
          />
          <table-row-link
            v-if="stratigraphyBase"
            :title="$t('locality.stratigraphyBase')"
            :value="
              $translate({
                et: stratigraphyBase.stratigraphy,
                en: stratigraphyBase.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: locality.stratigraphy_base.id },
              })
            "
          />
          <table-row
            :title="$t('locality.remarks')"
            :value="locality.remarks"
          />
          <table-row-link
            v-if="locality.maaamet_pa_id"
            :title="$t('locality.linkLandBoard')"
            :value="locality.maaamet_pa_id"
            :href="`https://geoportaal.maaamet.ee/index.php?lang_id=1&action=viewPA&pa_id=${locality.maaamet_pa_id}&fr=o&bk=1&page_id=382`"
          />
          <table-row
            v-if="locality.date_added"
            :title="$t('locality.dateAdded')"
            :value="$formatDate(locality.date_added)"
          />
          <table-row
            v-if="locality.date_changed"
            :title="$t('locality.dateChanged')"
            :value="$formatDate(locality.date_changed)"
          />
        </base-table>

        <v-btn
          v-if="drillcore"
          small
          rounded
          color="accent"
          class="mt-2 montserrat text-none"
          @click="
            $router.push(
              localePath({
                name: 'drillcore-id',
                params: { id: drillcore.id },
              })
            )
          "
        >
          <v-icon left>{{ icons.mdiScrewMachineFlatTop }}</v-icon>
          {{
            $translate({
              et: drillcore.drillcore,
              en: drillcore.drillcore_en,
            })
          }}
        </v-btn>
        <v-btn
          v-if="analysisResultsCount > 0"
          small
          rounded
          color="accent"
          class="mt-2 montserrat text-none"
          @click="goToAnalyticalData"
        >
          <v-icon left>{{ icons.mdiChartScatterPlot }}</v-icon>
          {{ $t('locality.linkToAnalyticalData') }}
        </v-btn>
        <v-btn
          v-if="referenceCount > 0"
          small
          rounded
          color="accent"
          class="mt-2 montserrat text-none"
          @click="goToGeoscienceLiterature"
        >
          <v-icon left>{{ icons.mdiBookOpenPageVariantOutline }}</v-icon>
          {{ $t('locality.linkGeoscienceLiterature') }}
          <v-icon right>{{ icons.mdiOpenInNew }}</v-icon>
        </v-btn>
      </v-card-text>
    </template>
    <template #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text v-if="locality.latitude && locality.longitude">
        <v-card id="map-wrap" elevation="0">
          <leaflet-map
            rounded
            :estonian-map="country ? country.value === 'Eesti' : false"
            :estonian-bedrock-overlay="
              country ? country.value === 'Eesti' : false
            "
            locality-overlay
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
    </template>

    <template #bottom>
      <image-bar v-if="images.length > 0" class="mt-4" :images="images" />
      <v-card v-if="tabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="tabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script lang="ts">
import {
  mdiScrewMachineFlatTop,
  mdiChartScatterPlot,
  mdiBookOpenPageVariantOutline,
  mdiOpenInNew,
} from '@mdi/js'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import {
  computed,
  defineComponent,
  reactive,
  toRef,
  toRefs,
  useContext,
  useFetch,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import HeaderDetail from '~/components/HeaderDetail.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import TableRow from '~/components/table/TableRow.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import Tabs from '~/components/Tabs.vue'
import Detail from '~/templates/Detail.vue'
import ImageBar from '~/components/ImageBar.vue'
import { Tab, TABS_LOCALITY } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: {
    HeaderDetail,
    TableRow,
    TableRowLink,
    LeafletMap,
    Tabs,
    Detail,
    ImageBar,
    BaseTable,
  },
  setup() {
    const { $services, $hydrateTab, $translate, localePath } = useContext()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      locality: null as any,
      ids: {} as any,
      drillcore: null as any,
      validRoute: {} as Location,
      tabs: [] as Tab[],
      images: [] as any[],
    })
    const analysisResultsCount = computed(
      () => state.tabs.find((tab) => tab.id === 'graphs')?.count
    )
    const referenceCount = computed(
      () => state.tabs.find((tab) => tab.id === 'locality_reference')?.count
    )
    const type = computed(() => state.locality?.type)
    const country = computed(() => state.locality?.country)
    const municipality = computed(() => state.locality?.vald)
    const settlementUnit = computed(() => state.locality?.asustusyksus)
    const coordinatePrecision = computed(
      () => state.locality?.coord_det_precision
    )
    const coordinateMethod = computed(() => state.locality?.coord_det_method)
    const coordinateAgent = computed(() => state.locality?.coord_det_agent)
    const stratigraphyTop = computed(() => state.locality?.stratigraphy_top)
    const stratigraphyBase = computed(() => state.locality?.stratigraphy_base)

    const { fetchState } = useFetch(async () => {
      const localityPromise = $services.sarvREST.getResource(
        'locality',
        parseInt(route.value.params.id),
        {
          params: {
            nest: 1,
          },
        }
      )
      const drillcorePromise = $services.sarvREST.getResourceList('drillcore', {
        defaultParams: {
          locality: route.value.params.id,
        },
      })
      const attachmentPromise = $services.sarvSolr.getResourceList(
        'attachment',
        {
          defaultParams: {
            fq: `locality_id:${route.value.params.id} AND specimen_image_attachment:2`,
            sort: 'date_created_dt desc,date_created_free desc,stars desc,id desc',
          },
        }
      )

      // Checking if locality has a related .las file to show in graph tab
      const lasFilePromise = $services.sarvREST.getResourceList(
        'attachment_link',
        {
          defaultParams: {
            attachment__uuid_filename__iendswith: '.las',
            locality: route.value.params.id,
            fields: 'attachment',
          },
        }
      )
      const tabsObject = TABS_LOCALITY
      const tabs = tabsObject.allIds.map((id) => {
        return { ...tabsObject.byIds[id], objectId: id }
      })
      const hydratedTabsByIdsPromise = Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              solr: {
                default: {
                  fq:
                    tab.id === 'graphs'
                      ? `locality_id:${route.value.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`
                      : `locality_id:${route.value.params.id}`,
                },
              },
              api: { default: { locality: route.value.params.id } },
            },
          })
        )
      ).then((res): { [K: string]: Tab } => {
        return res.reduce((prev, tab) => {
          return { ...prev, [tab.objectId as string]: tab }
        }, {})
      })
      const [
        localityResponse,
        drillcoreResponse,
        attachmentResponse,
        lasFileResponse,
        hydratedTabsByIds,
      ] = await Promise.all([
        localityPromise,
        drillcorePromise,
        attachmentPromise,
        lasFilePromise,
        hydratedTabsByIdsPromise,
      ])
      state.ids = localityResponse?.ids
      state.locality = localityResponse
      state.drillcore = drillcoreResponse.items
        ? drillcoreResponse.items[0]
        : null

      hydratedTabsByIds.boxes.count = state.drillcore?.boxes || 0
      hydratedTabsByIds.boxes.props.drillcore = state.drillcore?.id
      hydratedTabsByIds.analysis_results.props = {
        localityObject: state.locality,
        attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
        analysisResultsCount: hydratedTabsByIds.analysis_results.count,
      }
      hydratedTabsByIds.analysis_results.count =
        hydratedTabsByIds.analysis_results.count +
        hydratedTabsByIds.locality_description.count +
        hydratedTabsByIds.sample.count +
        (lasFileResponse?.items?.[0]?.attachment ? 1 : 0)

      state.tabs = TABS_LOCALITY.allIds
        .map((id) => hydratedTabsByIds[id])
        .filter((tab) => {
          if (tab.id === 'graphs') {
            // Todo: also add taxa check
            return (
              tab.props.attachment ||
              tab.props.analysisResultsCount > 0 ||
              tab.props.sampleCount > 0 ||
              tab.props.localityDescriptionCount > 0
            )
          } else return tab.count > 0
        })
      state.images = attachmentResponse?.items ?? []
    })
    const title = computed(() =>
      $translate({
        et: state.locality?.locality,
        en: state.locality?.locality_en,
      })
    )
    state.validRoute = useSlugRoute({
      slug: title,
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'locality'),
      pending: toRef(fetchState, 'pending'),
    }).value

    const goToGeoscienceLiterature = () => {
      window.open(
        `https://kirjandus.geoloogia.info/reference/?localities=${title.value}`,
        '_blank',
        'height=800, width=800'
      )
    }
    const goToAnalyticalData = () => {
      router.push(
        localePath({
          name: 'analytical-data',
          query: {
            locality: title.value,
          },
        })
      )
    }

    return {
      ...toRefs(state),
      title,
      analysisResultsCount,
      referenceCount,
      type,
      country,
      municipality,
      settlementUnit,
      coordinatePrecision,
      coordinateMethod,
      coordinateAgent,
      stratigraphyTop,
      stratigraphyBase,
      goToGeoscienceLiterature,
      goToAnalyticalData,
    }
  },
  // @ts-ignore
  head() {
    return {
      title: `${this.title} | ${this.$t('locality.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.title} | ${this.$t('locality.pageTitle')}`,
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
        {
          property: 'og:image',
          hid: 'og:image',
          // @ts-ignore
          content: this.images[0]?.filename
            ? this.$img(
                // @ts-ignore
                `${this.images[0]?.filename}`,
                { size: 'small' },
                {
                  provider: 'geocollections',
                }
              )
            : undefined,
        },
      ],
    }
  },
  computed: {
    icons() {
      return {
        mdiScrewMachineFlatTop,
        mdiChartScatterPlot,
        mdiBookOpenPageVariantOutline,
        mdiOpenInNew,
      }
    },
  },
  methods: {
    isNil,
    isEmpty,
  },
})
</script>
