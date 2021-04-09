<template>
  <v-card>
    <v-card-title class="py-1">
      <div class="card-title--clickable" @click="showMap = !showMap">
        <span>{{ $t('common.map') }}</span>
        <v-icon>mdi-earth</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="showMap = !showMap">
        <v-icon>{{ showMap ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-show="!showMap" class="px-0 pb-6">
      <leaflet-map :markers="mapMarkers" />
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
    showMapAtStart: Boolean,
  },
  data() {
    return {
      showMap: this.showMapAtStart,
    }
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
          }
          filtered.push(newItem)
        }
        return filtered
      }, [])
    },
  },
  watch: {
    showMap(newVal) {
      console.log(newVal)
      console.log(this.$refs)
      if (newVal) {
        // setTimeout(() => {
        //   this.$refs.map[0].map.invalidateSize();
        // }, 100);
      }
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
