<template>
  <detail :loading="$fetchState.pending" :error="$fetchState.error">
    <template #title>
      <header-detail :ids="ids">
        <div>
          {{ title }}
        </div>
        <v-divider v-if="titleAlt" class="mx-4" vertical />
        <a
          v-if="isRock && titleAlt"
          target="_blank"
          style="text-decoration: none"
          :href="`https://kivid.info/${specimenAlt.rock_id}`"
          >{{ titleAlt }}</a
        >
        <a
          v-if="isTaxon && titleAlt"
          target="_blank"
          style="text-decoration: none"
          :href="`https://fossiilid.info/${specimenAlt.taxon_id}`"
          >{{ titleAlt }}</a
        >
      </header-detail>
    </template>
    <template #column-left>
      <v-card-title class="subsection-title">
        {{ $t('common.general') }}
      </v-card-title>
      <v-card-text>
        <base-table>
          <table-row-link
            v-if="coll"
            :title="$t('specimen.collectionNr')"
            :value="coll.number"
            nuxt
            :href="
              localePath({
                name: 'collection-id',
                params: { id: coll.id },
              })
            "
          />

          <table-row
            :title="$t('specimen.number')"
            :value="`${specimen.specimen_id}`"
          />
          <table-row-link
            v-if="parent"
            :title="$t('specimen.parent')"
            nuxt
            :href="localePath('specimen-id', { id: parent.id })"
            :value="parent.specimen_id"
          />
          <table-row
            :title="$t('specimen.oldNumber')"
            :value="`${specimen.specimen_nr}`"
          />
          <table-row
            v-if="type"
            :title="$t('specimen.type')"
            :value="
              $translate({
                et: type.value,
                en: type.value_en,
              })
            "
          />
          <table-row
            v-if="classification"
            :title="$t('specimen.group')"
            :value="
              $translate({
                et: classification.class_field,
                en: classification.class_en,
              })
            "
          />
          <table-row :title="$t('specimen.part')" :value="specimen.part" />
          <table-row-link
            v-if="locality"
            :title="$t('specimen.locality')"
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
          <table-row :title="$t('specimen.depth')" :value="specimen.depth" />
          <table-row-link
            v-if="stratigraphy"
            :title="$t('specimen.stratigraphy')"
            :value="
              $translate({
                et: stratigraphy.stratigraphy,
                en: stratigraphy.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: stratigraphy.id },
              })
            "
          />
          <table-row-link
            v-if="lithostratigraphy"
            :title="$t('specimen.lithostratigraphy')"
            :value="
              $translate({
                et: lithostratigraphy.stratigraphy,
                en: lithostratigraphy.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: lithostratigraphy.id },
              })
            "
          />
          <table-row
            :title="$t('specimen.stratigraphyRemarks')"
            :value="specimen.stratigraphy_free"
          />

          <table-row
            :title="$t('specimen.remarks')"
            :value="specimen.remarks"
          />
          <table-row
            :title="$t('specimen.dateCollected')"
            :value="dateCollected"
          />
          <table-row
            v-if="agentCollected"
            :title="$t('specimen.collector')"
            :value="agentCollected.agent"
          />
          <table-row-link
            v-if="sample"
            :title="$t('specimen.sample')"
            :value="
              $translate({
                et: sample.number,
                en: sample.number,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'sample-id',
                params: { id: sample.id },
              })
            "
          />
          <table-row-link
            v-if="database"
            :title="$t('specimen.institution')"
            :value="
              $translate({
                et: database.name,
                en: database.name_en,
              })
            "
            :href="database.url"
            target="DatabaseWindow"
          />
        </base-table>
      </v-card-text>
    </template>
    <template
      v-if="locality && locality.latitude && locality.longitude"
      #column-right
    >
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card id="map-wrap" elevation="0">
          <leaflet-map
            rounded
            :estonian-map="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            :estonian-bedrock-overlay="
              locality.country ? locality.country.value === 'Eesti' : false
            "
            height="300px"
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
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import Detail from '~/templates/Detail.vue'
import HeaderDetail from '~/components/HeaderDetail.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import Tabs from '~/components/Tabs.vue'
import ImageBar from '~/components/ImageBar.vue'
import { Tab, TABS_SPECIMEN } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'
import { useSlugRoute } from '~/composables/useSlugRoute'
export default defineComponent({
  components: {
    Detail,
    HeaderDetail,
    TableRow,
    TableRowLink,
    LeafletMap,
    Tabs,
    ImageBar,
    BaseTable,
  },
  setup() {
    const { $services, $hydrateTab, $translate } = useContext()
    const route = useRoute()
    const state = reactive({
      specimen: null as any,
      specimenAlt: null as any,
      ids: {} as any,
      validRoute: {} as Location,
      images: [] as any[],
      tabs: [] as Tab[],
    })
    const isRock = computed(() => !!state.specimenAlt?.rock)
    const isTaxon = computed(() => !!state.specimenAlt?.taxon)
    const dateCollected = computed(() =>
      state.specimen?.date_collected
        ? state.specimen.date_collected
        : state.specimen.date_collected_free
    )
    const coll = computed(() => state.specimen?.coll)
    const type = computed(() => state.specimen?.type)
    const classification = computed(() => state.specimen?.classification)
    const locality = computed(() => state.specimen?.locality)
    const stratigraphy = computed(() => state.specimen?.stratigraphy)
    const lithostratigraphy = computed(() => state.specimen?.lithostratigraphy)
    const agentCollected = computed(() => state.specimen?.agent_collected)
    const database = computed(() => state.specimen?.database)
    const sample = computed(() => state.specimen?.sample)
    const parent = computed(() => state.specimen?.parent)

    const { fetchState } = useFetch(async () => {
      const specimenPromise = $services.sarvREST.getResource(
        'specimen',
        parseInt(route.value.params.id),
        { params: { nest: 2 } }
      )

      const specimenNamePromise = $services.sarvSolr.getResource(
        'specimen',
        parseInt(route.value.params.id)
      )

      const attachmentPromise = $services.sarvSolr.getResourceList(
        'attachment',
        {
          defaultParams: {
            fq: `specimen_id:${route.value.params.id} AND specimen_image_attachment:1`,
            sort: 'date_created_dt desc,date_created_free desc,stars desc,id desc',
            rows: 25,
          },
        }
      )
      const tabs = TABS_SPECIMEN.allIds.map((id) => TABS_SPECIMEN.byIds[id])
      const hydratedTabsPromise = Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              solr: { default: { fq: `specimen_id:${route.value.params.id}` } },
              api: {
                default: { specimen: route.value.params.id },
                specimen_reference: { specimen: route.value.params.id },
              },
            },
          })
        )
      )
      const [
        specimenResponse,
        specimenNameResponse,
        attachmentResponse,
        hydratedTabs,
      ] = await Promise.all([
        specimenPromise,
        specimenNamePromise,
        attachmentPromise,
        hydratedTabsPromise,
      ])

      state.ids = specimenResponse?.ids
      state.specimen = specimenResponse
      state.specimenAlt = specimenNameResponse?.[0]
      state.images = attachmentResponse.items ?? []
      state.tabs = hydratedTabs.filter((item) => item.count > 0)
    })
    const title = computed(
      () =>
        `${state.specimen?.database?.acronym} ${state.specimen?.specimen_id}`
    )
    const titleAlt = computed(() => {
      if (state.specimenAlt?.rock) {
        const defaultName = $translate({
          et: state.specimenAlt.rock,
          en: state.specimenAlt.rock_en,
        })
        return state.specimenAlt.rock_txt &&
          state.specimenAlt.rock_txt.length > 0
          ? state.specimenAlt.rock_txt[0]
          : defaultName
      }
      if (state.specimenAlt?.taxon) {
        return state.specimenAlt.taxon
      }
      return null
    })
    useSlugRoute({
      slug: title,
      pending: toRef(fetchState, 'pending'),
      tabs: toRef(state, 'tabs'),
      watchableObject: toRef(state, 'specimen'),
      validRoute: toRef(state, 'validRoute'),
    })

    return {
      ...toRefs(state),
      title,
      titleAlt,
      isRock,
      isTaxon,
      dateCollected,
      coll,
      type,
      classification,
      locality,
      stratigraphy,
      lithostratigraphy,
      agentCollected,
      database,
      sample,
      parent,
    }
  },
  // @ts-ignore
  head() {
    return {
      title: `${this.title} | ${this.$t('specimen.pageTitle')}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.title} | ${this.$t('specimen.pageTitle')}`,
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
})
</script>
