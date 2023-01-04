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
import {
  computed,
  defineComponent,
  PropType,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
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
      type: Array as PropType<MapMarker[]>,
      required: false,
      default: () => [],
    },
    maxPermanent: {
      type: Number,
      default: 5,
    },
  },
  setup(props) {
    const { localePath } = useContext()
    const router = useRouter()
    const tooltipOptions = computed(() => {
      return {
        permanent: props.markers.length <= props.maxPermanent,
        direction: 'top',
        offset: [1, -7],
      }
    })
    const handleClick = (
      event: Leaflet.LeafletMouseEvent,
      marker: MapMarker
    ) => {
      L.DomEvent.stopPropagation(event)
      if (marker.id && marker.routeName) {
        router.push(
          localePath({
            name: `${marker.routeName}-id`,
            params: { id: marker.id.toString() },
          })
        )
      }
    }
    return {
      tooltipOptions,
      handleClick,
    }
  },
})
</script>

<style scoped></style>
