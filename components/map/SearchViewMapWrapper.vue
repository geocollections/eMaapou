<template>
  <card-expandable
    :active="active"
    :show-body="showMap"
    @click="showMap = $event"
  >
    <template #title="{ showBody }">
      <div @click="$emit('click', !showBody)">
        <span
          class="montserrat"
          style="font-size: 1rem"
          v-html="$tc('common.map', mapMarkers.length)"
        />
        <v-icon class="pb-1">mdi-earth</v-icon>
      </div>
    </template>

    <template #body="{ showBody }">
      <leaflet-map
        v-show="showBody"
        v-bind="$attrs"
        :markers="mapMarkers"
        :invalidate-size="showBody"
        activate-search
        gps-enabled
        :show-links="false"
        :gesture-handling="$vuetify.breakpoint.smAndDown"
        @update="$emit('update')"
      />
    </template>
  </card-expandable>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import CardExpandable from '../CardExpandable.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'
export default {
  name: 'SearchViewMapWrapper',
  components: { LeafletMap, CardExpandable },
  props: {
    items: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    useCustomMarkers: {
      type: Boolean,
      required: false,
      default() {
        return false
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapFields('settings', {
      showMap: 'showSearchViewMap',
    }),
    mapMarkers() {
      if (this.useCustomMarkers) return this.items

      const routeName = this.$route.name.split('___')[0]
      return this.items.reduce((filtered, item) => {
        if (item.latitude && item.longitude) {
          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              this.$translate({ et: item.locality, en: item.locality_en }) ??
              (this.$translate({
                et: item.site_name,
                en: item.site_name_en,
              }) ||
                item.name ||
                `ID: ${item.id}`),
            routeName:
              routeName === 'site'
                ? 'site'
                : item.site_id
                ? 'site'
                : 'locality',
            id: (item.locality_id || item.site_id) ?? item.id,
          }

          const isItemInArray = !!filtered.find(
            (existingItem) =>
              existingItem.latitude === item.latitude &&
              existingItem.longitude === item.longitude
          )
          if (!isItemInArray) filtered.push(newItem)
        }
        return filtered
      }, [])
    },
  },
}
</script>
