<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.photosCount')"
        :count="count"
        icon="mdi-file-image-outline"
      />
    </template>

    <template #form>
      <photo-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper
        locality-overlay
        use-custom-markers
        :items="mapMarkers"
        class="mb-6"
      />

      <v-card>
        <v-radio-group
          v-model="currentView"
          row
          hide-details
          class="pa-4"
          mandatory
        >
          <v-radio
            v-for="entity in listOfViews"
            :key="entity"
            :label="$t(`common.${entity}`)"
            :value="entity"
            color="light-blue darken-1"
          ></v-radio>
        </v-radio-group>

        <photo-table
          v-if="currentView === 'table'"
          flat
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          @update="handleUpdate"
        />

        <image-view-wrapper
          v-if="currentView === 'image'"
          :items="items"
          :count="count"
          :options="options"
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'
import PhotoSearchForm from '~/components/search/forms/PhotoSearchForm'
import PhotoTable from '~/components/tables/PhotoTable'
import ImageViewWrapper from '~/components/ImageViewWrapper'

export default {
  components: {
    ImageViewWrapper,
    PhotoTable,
    PhotoSearchForm,
    Search,
    SearchViewMapWrapper,
    PageTitleWrapper,
  },
  head() {
    return {
      title: this.$t('image.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('image', ['options', 'items', 'count']),
    ...mapState('settings', ['listOfViews']),
    ...mapFields('image', ['currentView']),
    mapMarkers() {
      if (this.items?.length > 0) {
        return this.items.reduce((filtered, item) => {
          if (
            (item.latitude && item.longitude) ||
            (item.image_latitude && item.image_latitude)
          ) {
            const newItem = {
              latitude: item.image_latitude ?? item.latitude,
              longitude: item.image_longitude ?? item.longitude,
              text:
                (this.$translate({
                  et: item.locality,
                  en: item.locality_en,
                }) ||
                  item.image_object) ??
                `ID: ${item.id}`,
              routeName: item.locality_id ? 'locality' : 'photo',
              id: item.locality_id ?? item.id,
            }

            const isItemInArray = !!filtered.find(
              (existingItem) =>
                existingItem.latitude === newItem.latitude &&
                existingItem.longitude === newItem.longitude
            )
            if (!isItemInArray) filtered.push(newItem)
          }
          return filtered
        }, [])
      }
      return []
    },
  },
  methods: {
    ...mapActions('image', ['searchImages']),
    async handleUpdate(tableState) {
      await this.searchImages(tableState?.options)
    },
  },
}
</script>
