<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.photosCount')"
        icon="mdi-file-image-outline"
        class="title-photo"
      />
    </template>

    <template #form>
      <photo-search-form :markers="mapMarkers" />
    </template>

    <template #result>
      <div class="text-h6 pl-2 py-1">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card class="mt-0">
        <v-radio-group
          v-model="currentView"
          row
          hide-details
          class="pa-4 mt-0"
          mandatory
        >
          <v-radio
            v-for="entity in listOfViews"
            :key="entity"
            :label="$t(`common.${entity}`)"
            :value="entity"
            color="header"
          ></v-radio>
        </v-radio-group>

        <photo-table
          v-if="currentView === 'table'"
          flat
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          use-dynamic-headers
          @update="handleUpdate"
        />

        <image-view-wrapper
          v-if="currentView === 'image'"
          :items="items"
          :count="count"
          :options="options"
          @update="handleUpdate"
        />

        <gallery-view-wrapper
          v-if="currentView === 'gallery'"
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
import TitleCard from '~/components/TitleCard.vue'
import Search from '~/components/templates/Search'
import PhotoSearchForm from '~/components/search/forms/PhotoSearchForm'
import PhotoTable from '~/components/tables/PhotoTable'
import ImageViewWrapper from '~/components/ImageViewWrapper'
import GalleryViewWrapper from '~/components/GalleryViewWrapper'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'

export default {
  components: {
    GalleryViewWrapper,
    ImageViewWrapper,
    PhotoTable,
    PhotoSearchForm,
    Search,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('photo.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('photo.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('search/image', ['options', 'items', 'count']),
    ...mapState('settings', ['listOfViews']),
    ...mapFields('search/image', ['currentView']),
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
    ...mapActions('search/image', ['searchImages']),
    async handleUpdate(tableState) {
      await this.searchImages(tableState?.options)
    },
  },
}
</script>
