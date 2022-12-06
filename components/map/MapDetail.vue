<template>
  <div>
    <client-only>
      <l-map
        id="map"
        ref="map"
        :class="{
          rounded: rounded,
        }"
        :style="{
          height: `${height}`,
          position: height === '100%' ? 'absolute' : 'relative',
        }"
        style="z-index: 0"
        :options="options"
        :zoom="mapZoom"
        :center="currentCenter"
        @update:center="updateCenter"
        @baselayerchange="handleBaseLayerChange"
        @overlayadd="handleOverlayAdd"
        @overlayremove="handleOverlayRemove"
        @ready="handleReady"
      >
        <l-control-layers ref="layerControl" />
        <l-control-scale
          position="bottomleft"
          :metric="true"
          :imperial="false"
        />
        <l-tile-layer
          v-for="layer in baseLayers"
          :key="layer.id"
          layer-type="base"
          :visible="layer.visible"
          :name="layer.name"
          :url="layer.url"
          :options="layer.options"
        />
        <l-tile-layer
          v-for="layer in tileOverlays"
          :key="layer.id"
          layer-type="overlay"
          :visible="layer.visible"
          :name="layer.name"
          :url="layer.url"
          :options="layer.options"
        />
        <l-wms-tile-layer
          v-for="layer in wmsOverlays"
          :key="layer.id"
          layer-type="overlay"
          :visible="layer.visible"
          :name="layer.name"
          :base-url="layer.url"
          :layers="layer.layers"
          :transparent="layer.transparent"
          :options="layer.options"
        />
        <v-marker-cluster-wrapper
          v-if="markers.length >= 250"
          :markers="markers"
        />
        <l-circle-marker-wrapper v-else :markers="markers" />
        <l-geo-json
          v-if="geojson"
          :geojson="geojson"
          :options-style="{
            color: $vuetify.theme.currentTheme.accent,
            fillColor: $vuetify.theme.currentTheme.accent,
          }"
        />

        <l-layer-group ref="popup">
          <map-click-popup :response="mapClickResponse" />
        </l-layer-group>
      </l-map>
      <template #placeholder>
        <div
          :style="`height: ${height}; width: 100%`"
          class="d-flex align-center justify-center rounded secondary"
        >
          <v-progress-circular
            indeterminate
            color="accent"
            :size="100"
            :width="6"
          />
        </div>
      </template>
    </client-only>
    <map-links
      v-if="showLinks"
      :latitude="currentCenter.lat"
      :longitude="currentCenter.lng"
    />
  </div>
</template>

<script lang="ts">
import { LControlLayers, LMap, LPopup } from 'vue2-leaflet'
import {
  computed,
  defineComponent,
  nextTick,
  PropType,
  reactive,
  ref,
  useContext,
  toRefs,
} from '@nuxtjs/composition-api'
import type Leaflet from 'types/leaflet'
import MapLinks from '~/components/map/MapLinks.vue'
import LCircleMarkerWrapper from '~/components/map/LCircleMarkerWrapper.vue'
import VMarkerClusterWrapper from '~/components/map/VMarkerClusterWrapper.vue'
import MapClickPopup from '~/components/map/MapClickPopup.vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import 'leaflet.fullscreen/Control.FullScreen.css'
import { MapMarker } from '~/types/map'
import { MapState, useLeafletMap } from '~/composables/useLeafletMap'
let Vue2Leaflet: any = {}
let L: typeof Leaflet
if (process.client) {
  Vue2Leaflet = require('vue2-leaflet')
  L = require('leaflet')
  require('leaflet-gesture-handling')
  require('leaflet.fullscreen')
  require('@geoman-io/leaflet-geoman-free')
  type D = L.Icon.Default & {
    _getIconUrl?: string
  }
  delete (L.Icon.Default.prototype as D)._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  })
}
export default defineComponent({
  name: 'MapDetail',
  components: {
    MapClickPopup,
    VMarkerClusterWrapper,
    LCircleMarkerWrapper,
    MapLinks,
    'l-control-layers': Vue2Leaflet.LControlLayers,
    'l-control-scale': Vue2Leaflet.LControlScale,
    'l-geo-json': Vue2Leaflet.LGeoJson,
    'l-layer-group': Vue2Leaflet.LLayerGroup,
    'l-map': Vue2Leaflet.LMap,
    'l-tile-layer': Vue2Leaflet.LTileLayer,
    'l-wms-tile-layer': Vue2Leaflet.LWMSTileLayer,
  },
  props: {
    zoom: {
      type: Number,
      default: null,
    },
    height: {
      type: String,
      default: '500px',
    },
    center: {
      type: Object,
      default() {
        return {
          latitude: 58.5,
          longitude: 25.5,
        }
      },
    },
    markers: {
      type: Array as PropType<MapMarker[]>,
      default: () => [],
    },
    estonianMap: {
      type: Boolean,
      default: false,
    },
    estonianBedrockOverlay: {
      type: Boolean,
      default: false,
    },
    estonianBasementOverlay: {
      type: Boolean,
      default: false,
    },
    estonianHybridOverlay: {
      type: Boolean,
      default: false,
    },
    invalidateSize: Boolean,
    // Adds rounded class to leaflet
    rounded: Boolean,
    gestureHandling: {
      type: Boolean,
      default: true,
    },
    showLinks: {
      type: Boolean,
      default: true,
    },
    geojson: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  // @ts-ignore
  setup(props) {
    const { i18n } = useContext()
    const state: MapState = reactive({
      map: undefined,
      mapClickResponse: null as any,
      activeOverlays: [] as string[],
      currentCenter: {
        lat: props.center.latitude,
        lng: props.center.longitude,
      },
      options: {
        fullscreenControl: true,
        gestureHandling: props.gestureHandling,
        gestureHandlingOptions: {
          text: {
            touch: i18n.t('gestureHandling.touch'),
            scroll: i18n.t('gestureHandling.scroll'),
            scrollMac: i18n.t('gestureHandling.scrollMac'),
          },
          duration: 1000,
        },
      },
      nearMeRadius: 5,
    })
    const popup = ref<LPopup>()
    const layerControl = ref<LControlLayers>()
    const map = ref<LMap>()
    const {
      ready,
      updateCenter,
      handleBaseLayerChange,
      handleOverlayAdd,
      handleOverlayRemove,
      baseLayers,
      estonianOverlays,
    } = useLeafletMap({ map, props, state: toRefs(state) })

    const handleReady = () => {
      ready()
      fitBounds()
    }
    const mapZoom = computed(() => {
      return props.zoom ?? (props.estonianBedrockOverlay ? 9 : 11)
    })
    const markersAsFitBoundsObject = computed(() => {
      return props.markers.map((m: MapMarker) => [m.latitude, m.longitude])
    })
    const fitBounds = () => {
      nextTick(() => {
        if (props.geojson) {
          state.map?.fitBounds(L.geoJSON(props.geojson).getBounds(), {
            padding: [50, 50],
          })
        } else if (markersAsFitBoundsObject.value.length > 0) {
          state.map?.fitBounds(markersAsFitBoundsObject.value, {
            padding: [50, 50],
            maxZoom: mapZoom.value,
          })
        }
      })
    }
    const tileOverlays = computed(() => {
      return estonianOverlays.filter((overlay) => !overlay.isWMS)
    })
    const wmsOverlays = computed(() => {
      return estonianOverlays.filter((overlay: any) => overlay.isWMS)
    })
    const latLngMarkers = computed(() => {
      return props.markers.map((m: MapMarker) => {
        return [m.latitude, m.longitude]
      })
    })
    return {
      ...toRefs(state),
      handleReady,
      updateCenter,
      handleBaseLayerChange,
      handleOverlayAdd,
      handleOverlayRemove,
      baseLayers,
      tileOverlays,
      wmsOverlays,
      latLngMarkers,
      mapZoom,
      map,
      layerControl,
      popup,
    }
  },
})
</script>

<style lang="scss" scoped>
.leaflet-container {
  font-family: 'Open Sans', sans-serif;

  ::v-deep .leaflet-control-layers-toggle {
    width: 30px;
    height: 30px;
    background-size: 20px;
  }
}
</style>
