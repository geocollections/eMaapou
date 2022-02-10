<template>
  <search>
    <template #title>
      <base-header
        :title="$t('photo.pageTitle')"
        icon="mdi-file-image-outline"
        class="title-photo"
      />
    </template>

    <template #form>
      <search-form-photo :markers="mapMarkers" />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card class="mt-0">
        <v-radio-group
          v-model="currentView"
          row
          dense
          hide-details
          class="mt-0 px-4 pt-3 pb-2"
          mandatory
        >
          <v-radio
            v-for="entity in listOfViews"
            :key="entity"
            class="montserrat"
            :label="$t(`common.${entity}`)"
            :value="entity"
            color="header"
          ></v-radio>
        </v-radio-group>

        <data-table-photo
          v-if="currentView === 'table'"
          flat
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          dynamic-headers
          stateful-headers
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
import BaseHeader from '~/components/base/BaseHeader.vue'
import Search from '~/templates/Search'
import SearchFormPhoto from '~/components/search/forms/SearchFormPhoto'
import DataTablePhoto from '~/components/data-table/DataTablePhoto'
import ImageViewWrapper from '~/components/ImageViewWrapper'
import GalleryViewWrapper from '~/components/GalleryViewWrapper'

export default {
  components: {
    GalleryViewWrapper,
    ImageViewWrapper,
    DataTablePhoto,
    SearchFormPhoto,
    Search,
    BaseHeader,
  },
  head() {
    return {
      title: this.$t('photo.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('photo.pageTitle'),
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
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
