<template>
  <detail>
    <template #title>
      <title-card-detail :ids="ids" class="title-specimen">
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
      </title-card-detail>
    </template>
    <template #column-left>
      <v-card-title class="subsection-title">
        {{ $t('common.general') }}
      </v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <link-data-row
                v-if="coll"
                :title="$t('specimen.collectionNr')"
                :value="coll.number"
                @link-click="$openGeoDetail('collection', coll.id)"
              />

              <data-row
                :title="$t('specimen.number')"
                :value="`${specimen.specimen_id}`"
              />
              <data-row
                :title="$t('specimen.oldNumber')"
                :value="`${specimen.specimen_nr}`"
              />
              <data-row
                v-if="type"
                :title="$t('specimen.type')"
                :value="
                  $translate({
                    et: type.value,
                    en: type.value_en,
                  })
                "
              />
              <data-row
                v-if="classification"
                :title="$t('specimen.group')"
                :value="
                  $translate({
                    et: classification.class_field,
                    en: classification.class_en,
                  })
                "
              />
              <data-row :title="$t('specimen.part')" :value="specimen.part" />
              <link-data-row
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
              <data-row :title="$t('specimen.depth')" :value="specimen.depth" />
              <link-data-row
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
              <link-data-row
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
              <data-row
                :title="$t('specimen.stratigraphyRemarks')"
                :value="specimen.stratigraphy_free"
              />

              <data-row
                :title="$t('specimen.remarks')"
                :value="specimen.remarks"
              />
              <data-row
                :title="$t('specimen.dateCollected')"
                :value="dateCollected"
              />
              <data-row
                v-if="agent_collected"
                :title="$t('specimen.collector')"
                :value="agent_collected.agent"
              />
              <link-data-row
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
              <link-data-row
                v-if="database"
                :title="$t('specimen.institution')"
                :value="
                  $translate({
                    et: database.name,
                    en: database.name_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: `institution-${database.acronym.toLowerCase()}`,
                  })
                "
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
    <template v-if="locality" #column-right>
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card
          v-if="locality.latitude && locality.longitude"
          id="map-wrap"
          elevation="0"
        >
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
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Detail from '~/components/templates/Detail.vue'
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
import Tabs from '~/components/Tabs.vue'
import ImageBar from '~/components/ImageBar.vue'
import { TABS_SPECIMEN } from '~/constants'
export default {
  components: {
    Detail,
    TitleCardDetail,
    DataRow,
    LinkDataRow,
    LeafletMap,
    Tabs,
    ImageBar,
  },
  async asyncData({ params, route, error, $services }) {
    try {
      const detailViewResponse = await $services.sarvREST.getResource(
        'specimen',
        params.id,
        { params: { nest: 2 } }
      )
      const ids = detailViewResponse?.ids
      const specimen = detailViewResponse

      const specimenNameResponse = await $services.sarvSolr.getResource(
        'specimen',
        params.id
      )

      const specimenAlt = specimenNameResponse?.[0]

      return {
        specimen,
        specimenAlt,
        ids,
      }
    } catch (err) {
      error({
        message: `Could not find specimen ${route.params.id}`,
        path: route.path,
      })
    }
  },
  data() {
    return {
      images: [],
      initActiveTab: '',
      tabs: [],
    }
  },
  async fetch() {
    const attachmentResponse = await this.$services.sarvSolr.getResourceList(
      'attachment',
      {
        defaultParams: {
          fq: `specimen_id:${this.specimen?.id} AND specimen_image_attachment:1`,
          sort: 'date_created_dt desc,date_created_free desc,stars desc,id desc',
        },
      }
    )

    this.images = attachmentResponse.items ?? []

    const tabs = TABS_SPECIMEN.allIds.map((id) => TABS_SPECIMEN.byIds[id])

    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await this.$hydrateTab(tab, {
            countParams: {
              solr: { default: { fq: `specimen_id:${this.specimen?.id}` } },
              api: {
                default: { specimen: this.specimen?.id },
                specimen_reference: { specimen: this.specimen?.id },
              },
            },
          })
      )
    )

    const slugRoute = this.$createSlugRoute(
      this.$route,
      `${this.specimen.database.acronym} ${this.specimen.specimen_id}`
    )
    const validPath = this.$validateTabRoute(slugRoute, hydratedTabs)

    this.tabs = hydratedTabs
    this.initActiveTab = validPath
    if (validPath !== this.$route.path) await this.$router.replace(validPath)
  },
  fetchOnServer: false,
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
    title() {
      return `${this.specimen.database.acronym} ${this.specimen.specimen_id}`
    },
    titleAlt() {
      if (this.specimenAlt?.rock) {
        const defaultName = this.$translate({
          et: this.specimenAlt.rock,
          en: this.specimenAlt.rock_en,
        })
        return this.specimenAlt.rock_txt && this.specimenAlt.rock_txt.length > 0
          ? this.specimenAlt.rock_txt[0]
          : defaultName
      }
      if (this.specimenAlt?.taxon) {
        return this.specimenAlt.taxon
      }
      return null
    },
    isRock() {
      return !!this.specimenAlt?.rock
    },
    isTaxon() {
      return !!this.specimenAlt?.taxon
    },
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    dateCollected() {
      if (this.specimen.date_collected) return this.specimen.date_collected
      return this.specimen.date_collected_free
    },
    coll() {
      return this.specimen?.coll
    },
    type() {
      return this.specimen?.type
    },
    classification() {
      return this.specimen?.classification
    },
    locality() {
      return this.specimen?.locality
    },
    stratigraphy() {
      return this.specimen?.stratigraphy
    },
    lithostratigraphy() {
      return this.specimen?.lithostratigraphy
    },
    agent_collected() {
      return this.specimen?.agent_collected
    },
    database() {
      return this.specimen?.database
    },
    sample() {
      return this.specimen?.sample
    },
  },
}
</script>
