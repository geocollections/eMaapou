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
            v-if="vald"
            :title="$t('locality.parish')"
            :value="
              $translate({
                et: vald.vald,
                en: vald.vald_en,
              })
            "
          />
          <table-row
            v-if="asustusyksus"
            :title="$t('locality.settlement')"
            :value="
              $translate({
                et: asustusyksus.asustusyksus,
                en: asustusyksus.asustusyksus_en,
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
            v-if="coord_det_precision"
            :title="$t('locality.coordinatePrecision')"
            :value="coord_det_precision.value"
          />
          <table-row
            v-if="coord_det_method"
            :title="$t('locality.coordinateMethod')"
            :value="
              $translate({
                et: coord_det_method.value,
                en: coord_det_method.value_en,
              })
            "
          />
          <table-row
            v-if="coord_det_agent"
            :title="$t('locality.coordinateAgent')"
            :value="coord_det_agent.agent"
          />
          <table-row
            :title="$t('locality.locationRemarks')"
            :value="locality.remarks_location"
          />
          <table-row-link
            v-if="stratigraphy_top"
            :title="$t('locality.stratigraphyTop')"
            :value="
              $translate({
                et: stratigraphy_top.stratigraphy,
                en: stratigraphy_top.stratigraphy_en,
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
            v-if="stratigraphy_base"
            :title="$t('locality.stratigraphyBase')"
            :value="
              $translate({
                et: stratigraphy_base.stratigraphy,
                en: stratigraphy_base.stratigraphy_en,
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
          <v-icon left>mdi-screw-machine-flat-top</v-icon>
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
          <v-icon left>mdi-chart-scatter-plot</v-icon>
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
          <v-icon left>mdi-book-open-page-variant-outline</v-icon>
          {{ $t('locality.linkGeoscienceLiterature') }}
          <v-icon right>mdi-open-in-new</v-icon>
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
      <v-card v-if="filteredTabs.length > 0" class="mt-4 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="validRoute" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import { mapFields } from 'vuex-map-fields'
import HeaderDetail from '~/components/HeaderDetail.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import TableRow from '~/components/table/TableRow.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import Tabs from '~/components/Tabs.vue'
import Detail from '~/templates/Detail.vue'
import ImageBar from '~/components/ImageBar.vue'
import { TABS_LOCALITY } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'

export default {
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
  data() {
    return {
      locality: null,
      ids: [],
      drillcore: null,
      validRoute: {},
      tabs: [],
      attachments: [],
    }
  },
  async fetch() {
    const localityPromise = this.$services.sarvREST.getResource(
      'locality',
      this.$route.params.id,
      {
        params: {
          nest: 1,
        },
      }
    )
    const drillcorePromise = this.$services.sarvREST.getResourceList(
      'drillcore',
      {
        defaultParams: {
          locality: this.$route.params.id,
        },
      }
    )
    const attachmentPromise = this.$services.sarvSolr.getResourceList(
      'attachment',
      {
        defaultParams: {
          fq: `locality_id:${this.$route.params.id} AND specimen_image_attachment:2`,
          sort: 'date_created_dt desc,date_created_free desc,stars desc,id desc',
        },
      }
    )

    // Checking if locality has a related .las file to show in graph tab
    const lasFilePromise = this.$services.sarvREST.getResourceList(
      'attachment_link',
      {
        defaultParams: {
          attachment__uuid_filename__iendswith: '.las',
          locality: this.$route.params.id,
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
        this.$hydrateTab(tab, {
          countParams: {
            solr: {
              default: {
                fq:
                  tab.id === 'graphs'
                    ? `locality_id:${this.$route.params.id} AND (depth:[* TO *] OR depth_interval:[* TO *])`
                    : `locality_id:${this.$route.params.id}`,
              },
            },
            api: { default: { locality: this.$route.params.id } },
          },
        })
      )
    ).then((res) => {
      return res.reduce((prev, tab) => {
        return { ...prev, [tab.objectId]: tab }
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
    this.ids = localityResponse?.ids
    this.locality = localityResponse

    this.drillcore = drillcoreResponse.items ? drillcoreResponse.items[0] : null

    hydratedTabsByIds.boxes.count = this.drillcore?.boxes || 0
    hydratedTabsByIds.boxes.props.drillcore = this.drillcore?.id
    hydratedTabsByIds.analysis_results.props = {
      localityObject: this.locality,
      attachment: lasFileResponse?.items?.[0]?.attachment?.toString(),
      analysisResultsCount: hydratedTabsByIds.analysis_results.count,
    }
    hydratedTabsByIds.analysis_results.count =
      hydratedTabsByIds.analysis_results.count +
      hydratedTabsByIds.locality_description.count +
      hydratedTabsByIds.sample.count +
      (lasFileResponse?.items?.[0]?.attachment ? 1 : 0)

    this.tabs = TABS_LOCALITY.allIds.map((id) => hydratedTabsByIds[id])
    this.attachments = attachmentResponse?.items ?? []

    const slugRoute = this.$createSlugRoute(
      this.$route,
      this.$translate({
        et: this.locality.locality,
        en: this.locality.locality_en,
      })
    )
    this.validRoute = this.localeLocation(
      this.$validateTabRoute(slugRoute, this.tabs)
    )
    if (this.$router.resolve(this.validRoute).href !== this.$route.path)
      this.$nuxt.context.redirect(this.validRoute)
  },
  head() {
    return {
      title: `${this.$translate({
        et: this.locality?.locality,
        en: this.locality?.locality_en,
      })} | ${this.$t('locality.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.$translate({
            et: this.locality?.locality,
            en: this.locality?.locality_en,
          })} | ${this.$t('locality.pageTitle')}`,
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
        {
          property: 'og:image',
          hid: 'og:image',
          content: this.images[0]?.filename
            ? this.$img(
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
    ...mapFields('analyticalData', {
      analyticalDataLocality: 'filters.byIds.locality.value',
    }),
    filteredTabs() {
      return this.tabs.filter((item) => {
        if (item.id === 'graphs') {
          // Todo: also add taxa check
          return (
            item.props.attachment ||
            item.props.analysisResultsCount > 0 ||
            item.props.sampleCount > 0 ||
            item.props.localityDescriptionCount > 0
          )
        } else return item.count > 0
      })
    },

    images() {
      // return this.attachmentsOutcrop.concat(this.attachments)
      return this.attachments
    },

    analysisResultsCount() {
      return this.tabs?.find((tab) => tab.id === 'graphs')?.count
    },
    referenceCount() {
      return this.tabs?.find((tab) => tab.id === 'locality_reference')?.count
    },
    type() {
      return this.locality?.type
    },
    country() {
      return this.locality?.country
    },
    vald() {
      return this.locality?.vald
    },
    asustusyksus() {
      return this.locality?.asustusyksus
    },
    coord_det_precision() {
      return this.locality?.coord_det_precision
    },
    coord_det_method() {
      return this.locality?.coord_det_method
    },
    coord_det_agent() {
      return this.locality?.coord_det_agent
    },
    stratigraphy_top() {
      return this.locality?.stratigraphy_top
    },
    stratigraphy_base() {
      return this.locality?.stratigraphy_base
    },
  },
  methods: {
    isNil,
    isEmpty,
    goToGeoscienceLiterature() {
      const name = this.$translate({
        et: this.locality.locality,
        en: this.locality.locality_en,
      })

      window.open(
        `https://kirjandus.geoloogia.info/reference/?localities=${name}`,
        '_blank',
        'height=800, width=800'
      )
    },
    goToAnalyticalData() {
      this.analyticalDataLocality = this.$translate({
        et: this.locality.locality,
        en: this.locality.locality_en,
      })
      this.$router.push(this.localePath({ name: 'analytical-data' }))
    },
  },
}
</script>
