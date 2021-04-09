<template>
  <v-card>
    <v-card-title class="py-1">
      <div class="card-title--clickable" @click="showMap = !showMap">
        <span v-html="$tc('common.map', mapMarkers.length)" />
        <v-icon class="pb-1">mdi-earth</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="showMap = !showMap">
        <v-icon>{{ showMap ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-show="showMap" class="px-0 pb-6">
      <leaflet-map :markers="mapMarkers" :invalidate-size="showMap" />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import LeafletMap from '~/components/map/LeafletMap'
export default {
  name: 'SearchViewMapWrapper',
  components: { LeafletMap },
  props: {
    items: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
  computed: {
    ...mapFields('settings', {
      showMap: 'showSearchViewMap',
    }),
    mapMarkers() {
      const routeName = this.$route.name.split('___')[0]
      return this.items.reduce((filtered, item) => {
        if (item.latitude && item.longitude) {
          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              this.$translate({ et: item.locality, en: item.locality_en }) ??
              (item.name || `ID: ${item.id}`),
            routeName: routeName === 'site' ? 'site' : 'locality',
            id: item.locality_id ?? item.id,
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

<style scoped lang="scss">
.card-title--clickable {
  transition: opacity 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
