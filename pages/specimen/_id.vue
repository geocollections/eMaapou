<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="specimen.specimen_id"
        class="title-sample"
      />
    </template>
    <template #column-left>
      <v-card-title class="subsection-title">
        {{ $t('common.general') }}
      </v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row
                :title="$t('specimen.collectionNr')"
                :value="specimen.coll__number"
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
                  localePath('locality-id', {
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
                  localePath('stratigraphy-id', {
                    params: { id: specimen.stratigraphy_id },
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
                :title="$t('specimen.collector')"
                :value="specimen.agent_collected__agent"
              />
              <data-row
                :title="$t('specimen.institution')"
                :value="
                  $translate({
                    et: specimen.database__name,
                    en: specimen.database__name_en,
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
        <v-card elevation="0">
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
  </detail>
</template>

<script>
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
import Detail from '~/components/templates/Detail.vue'
import TitleCardDetail from '~/components/TitleCardDetail.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
export default {
  components: {
    Detail,
    TitleCardDetail,
    DataRow,
    LinkDataRow,
    LeafletMap,
  },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'specimen',
        params.id
      )
      const ids = detailViewResponse?.ids
      const specimen = detailViewResponse.results[0]

      // const tabs = [
      //   // {
      //   //   id: 'analysis',
      //   //   isSolr: true,
      //   //   routeName: 'sample-id',
      //   //   title: 'sample.analyses',
      //   //   count: 0,
      //   //   props: { sample: specimen.id },
      //   // },
      // ]

      // const hydratedTabs = await Promise.all(
      //   tabs.map(
      //     async (tab) =>
      //       await app.$hydrateCount(tab, {
      //         solr: { default: { fq: `specimen_id:${specimen.id}` } },
      //         api: { default: { sample: specimen.id } },
      //       })
      //   )
      // )

      // const validPath = app.$validateTabRoute(route, hydratedTabs)
      // if (validPath !== route.path) redirect(validPath)

      return {
        specimen,
        ids,
        // initActiveTab: validPath,
        // tabs: hydratedTabs,
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
      return this.specimen.specimen_id
    },
  },
}
</script>
