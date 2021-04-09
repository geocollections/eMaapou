<template>
  <v-card class="mb-4">
    <v-card-title>Map</v-card-title>
    <v-card-text class="px-0 pb-6">
      <leaflet-map :markers="mapMarkers" :is-estonian="isEstonian" />
    </v-card-text>
  </v-card>
</template>

<script>
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
    mapMarkers() {
      return this.items.reduce((filtered, item) => {
        if (item.latitude && item.longitude) {
          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              this.$translate({ et: item.locality, en: item.locality_en }) ??
              `ID: ${item.id}`,
            isEstonian: item.country === 'Eesti',
          }
          filtered.push(newItem)
        }
        return filtered
      }, [])
    },

    isEstonian() {
      return this.mapMarkers.every((item) => item.isEstonian)
    },
  },
}
</script>

<style scoped></style>
