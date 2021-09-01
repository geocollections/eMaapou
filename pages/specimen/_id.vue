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
                :title="$t('specimen.collectionNr')"
                :value="specimen.coll__number"
                @link-click="$openGeoDetail('collection', specimen.coll)"
              />

              <data-row
                :title="$t('specimen.number')"
                :value="specimen.specimen_id"
              />
              <data-row
                :title="$t('specimen.type')"
                :value="
                  $translate({
                    et: specimen.type__value,
                    en: specimen.type__value_en,
                  })
                "
              />
              <data-row
                :title="$t('specimen.group')"
                :value="
                  $translate({
                    et: specimen.classification__class_field,
                    en: specimen.classification__class_en,
                  })
                "
              />
              <data-row :title="$t('specimen.part')" :value="specimen.part" />
              <link-data-row
                :title="$t('specimen.locality')"
                :value="
                  $translate({
                    et: specimen.locality__locality,
                    en: specimen.locality__locality_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'locality-id',
                    params: { id: specimen.locality },
                  })
                "
              />
              <data-row :title="$t('specimen.depth')" :value="specimen.depth" />
              <link-data-row
                :title="$t('specimen.stratigraphy')"
                :value="
                  $translate({
                    et: specimen.stratigraphy__stratigraphy,
                    en: specimen.stratigraphy__stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: specimen.stratigraphy_id },
                  })
                "
              />
              <link-data-row
                :title="$t('specimen.lithostratigraphy')"
                :value="
                  $translate({
                    et: specimen.lithostratigraphy__stratigraphy,
                    en: specimen.lithostratigraphy__stratigraphy_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: specimen.lithostratigraphy_id },
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
                :title="$t('specimen.collector')"
                :value="specimen.agent_collected__agent"
              />
              <link-data-row
                :title="$t('specimen.institution')"
                :value="
                  $translate({
                    et: specimen.database__name,
                    en: specimen.database__name_en,
                  })
                "
                nuxt
                :href="
                  localePath({
                    name: `institution-${specimen.database__acronym.toLowerCase()}`,
                  })
                "
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
    <template
      v-if="
        specimen.locality_id &&
        specimen.locality__latitude &&
        specimen.locality__longitude
      "
      #column-right
    >
      <v-card-title class="subsection-title">{{
        $t('locality.map')
      }}</v-card-title>
      <v-card-text>
        <v-card
          v-if="specimen.locality__latitude && specimen.locality__longitude"
          id="map-wrap"
          elevation="0"
        >
          <leaflet-map
            rounded
            :estonian-map="specimen.locality__country__value === 'Eesti'"
            :estonian-bedrock-overlay="
              specimen.locality__country__value === 'Eesti'
            "
            height="300px"
            :center="{
              latitude: specimen.locality__latitude,
              longitude: specimen.locality__longitude,
            }"
            :markers="[
              {
                latitude: specimen.locality__latitude,
                longitude: specimen.locality__longitude,
                text: $translate({
                  et: specimen.locality__locality,
                  en: specimen.locality__locality_en,
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
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'specimen',
        params.id
      )
      const ids = detailViewResponse?.ids
      const specimen = detailViewResponse.results[0]

      const specimenNameResponse = await app.$services.sarvSolr.getResource(
        'specimen',
        params.id
      )

      const specimenAlt = specimenNameResponse.results[0]

      const tabs = [
        {
          id: 'specimen_identification',
          table: 'specimen_identification',
          isSolr: false,
          routeName: 'specimen-id',
          title: 'specimen.identifications',
          count: 0,
          props: { specimen: specimen.id },
        },
        {
          id: 'specimen_reference',
          table: 'specimen_reference',
          isSolr: false,
          routeName: 'specimen-id-references',
          title: 'specimen.references',
          count: 0,
          props: { specimen: specimen.id },
        },
      ]

      const hydratedTabs = await Promise.all(
        tabs.map(
          async (tab) =>
            await app.$hydrateCount(tab, {
              solr: { default: { fq: `specimen_id:${specimen.id}` } },
              api: {
                default: { specimen_id: specimen.id },
                specimen_reference: { specimen: specimen.id },
              },
            })
        )
      )

      const validPath = app.$validateTabRoute(route, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)

      const specimenImagesResponse =
        await app.$services.sarvREST.getResourceList('specimen_image', {
          defaultParams: {
            specimen: specimen.id,
          },
        })
      const images = specimenImagesResponse.items ?? []

      return {
        specimen,
        specimenAlt,
        ids,
        images,
        initActiveTab: validPath,
        tabs: hydratedTabs,
      }
    } catch (err) {
      error({
        message: `Could not find specimen ${route.params.id}`,
        path: route.path,
      })
    }
  },

  head() {
    return {
      title: this.title,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.title,
        },
      ],
    }
  },
  computed: {
    title() {
      return `${this.specimen.database__acronym} ${this.specimen.specimen_id}`
    },
    titleAlt() {
      if (this.specimenAlt.rock) {
        const defaultName = this.$translate({
          et: this.specimenAlt.rock,
          en: this.specimenAlt.rock_en,
        })
        return this.specimenAlt.rock_txt && this.specimenAlt.rock_txt.length > 0
          ? this.specimenAlt.rock_txt[0]
          : defaultName
      }
      if (this.specimenAlt.taxon) {
        return this.specimenAlt.taxon
      }
      return null
    },
    isRock() {
      return !!this.specimenAlt.rock_id
    },
    isTaxon() {
      return !!this.specimenAlt.taxon_id
    },
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    dateCollected() {
      if (this.specimen.date_collected) return this.specimen.date_collected
      return this.specimen.date_collected_free
    },
  },
}
</script>
