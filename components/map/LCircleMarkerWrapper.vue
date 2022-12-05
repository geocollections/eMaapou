<template>
  <div>
    <l-circle-marker
      v-for="(marker, idx) in markers"
      :key="`marker-${idx}-lat-${marker.latitude}-lon-${marker.latitude}`"
      :lat-lng="[marker.latitude, marker.longitude]"
      :radius="6"
      :weight="1.5"
      color="#fff"
      :fill-color="$vuetify.theme.currentTheme.warning"
      :fill-opacity="1"
      @click="handleClick($event, marker)"
    >
      <l-tooltip v-if="marker.text" :options="tooltipOptions">
        {{ marker.text }}
      </l-tooltip>
    </l-circle-marker>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import type * as Leaflet from 'leaflet'
import { MapMarker } from '~/types/map'
let Vue2Leaflet: any = {}
let L: typeof Leaflet
if (process.client) {
  Vue2Leaflet = require('vue2-leaflet')
  L = require('leaflet')
}
export default defineComponent({
  name: 'LCircleMarkerWrapper',
  components: {
    'l-circle-marker': Vue2Leaflet.LCircleMarker,
    'l-tooltip': Vue2Leaflet.LTooltip,
  },
  props: {
    markers: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
  computed: {
    tooltipOptions() {
      return {
        permanent: this.markers.length <= 5,
        direction: 'top',
        offset: [1, -7],
      }
    },
  },
  methods: {
    handleClick(event: Leaflet.LeafletMouseEvent, marker: MapMarker) {
      L.DomEvent.stopPropagation(event)
      if (marker.id && marker.routeName) {
        this.$router.push(
          this.localePath({
            name: `${marker.routeName}-id`,
            params: { id: marker.id.toString() },
          })
        )
      }
    },
  },
})
</script>

<style scoped></style>
