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
import type { LControlLayers, LMap, LPopup } from 'vue2-leaflet'
import {
  computed,
  defineComponent,
  nextTick,
  PropType,
  reactive,
  ref,
  useContext,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'
import { GeoJsonObject } from 'geojson'
import intersection from 'lodash/intersection'
import type Leaflet from 'types/leaflet'
import MapLinks from '~/components/map/MapLinks.vue'
import LCircleMarkerWrapper from '~/components/map/LCircleMarkerWrapper.vue'
import VMarkerClusterWrapper from '~/components/map/VMarkerClusterWrapper.vue'
import MapClickPopup from '~/components/map/MapClickPopup.vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import 'leaflet.fullscreen/Control.FullScreen.css'
import { MapMarker } from '~/types/map'
import {
  MapState,
  useDataOverlays,
  useLeafletMap,
} from '~/composables/useLeafletMap'
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
    VMarkerClusterWrapper,
    LCircleMarkerWrapper,
    MapLinks,
    MapClickPopup,
    'l-control-layers': Vue2Leaflet.LControlLayers,
    'l-layer-group': Vue2Leaflet.LLayerGroup,
    'l-control-scale': Vue2Leaflet.LControlScale,
    'l-geo-json': Vue2Leaflet.LGeoJson,
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
      default: () => {
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
      type: Object as PropType<GeoJsonObject>,
      required: false,
      default: () => {},
    },
  },
  setup(props) {
    const { i18n, $services } = useContext()
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

    const dataOverlays = useDataOverlays()
    const handleReady = () => {
      ready()
      if (isMapClickEnabled) {
        state.map?.on('click', handleMapClick)
        document.getElementById('map')?.classList.add('cursor-crosshair')
      }
      fitBounds()
    }
    const mapZoom = computed(() => {
      return props.zoom ?? (props.estonianBedrockOverlay ? 9 : 11)
    })
    const markersAsFitBoundsObject = computed(
      (): Leaflet.LatLngBoundsLiteral => {
        return props.markers.map((m: MapMarker) => [m.latitude, m.longitude])
      }
    )
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
      return [...estonianOverlays, ...dataOverlays].filter(
        (overlay) => !overlay.isWMS
      )
    })
    const wmsOverlays = computed(() => {
      return [...estonianOverlays, ...dataOverlays].filter(
        (overlay: any) => overlay.isWMS
      )
    })
    const latLngMarkers = computed(() => {
      return props.markers.map((m: MapMarker) => {
        return [m.latitude, m.longitude]
      })
    })
    const isMapClickEnabled = computed(() => {
      const layerNames = dataOverlays.map((overlay: any) => overlay.name)
      return intersection(layerNames, state.activeOverlays).length > 0
    })
    const queryLayers = computed(() => {
      const queryLayers = []
      if (state.activeOverlays.includes('Uuringupunktid / Sites')) {
        queryLayers.push('sarv:site_summary')
      }
      if (state.activeOverlays.includes('Puursüdamikud / Drillcores')) {
        queryLayers.push('sarv:locality_drillcores')
      }
      if (state.activeOverlays.includes('Lokaliteedid / Localities')) {
        queryLayers.push('sarv:locality_summary1')
      }
      if (state.activeOverlays.includes('Proovid / Samples')) {
        queryLayers.push('sarv:sample_summary')
      }
      if (state.activeOverlays.includes('Üldine / Summary')) {
        queryLayers.push('sarv:locality_summary_front')
      }
      return queryLayers.join(',')
    })
    const handleMapClick = async (event: Leaflet.LeafletMouseEvent) => {
      if (!state.map) return
      if (!isMapClickEnabled.value) return
      const MAX_ZOOM = 21
      const radius = (MAX_ZOOM + 0.25 - state.map.getZoom()) * 1000
      const circle = L.circle(event.latlng, { radius })
      state.map.addLayer(circle)
      const bbox = circle.getBounds().toBBoxString()
      circle.remove()

      const wmsResponse = await $services.geoserver.getWMSData({
        QUERY_LAYERS: queryLayers.value,
        LAYERS:
          'sarv:locality_summary1,sarv:locality_drillcores,sarv:site_summary,sarv:sample_summary,sarv:locality_summary_front',
        BBOX: bbox,
      })

      if (wmsResponse?.features?.length > 0) {
        state.mapClickResponse = {
          latlng: event.latlng,
          features: wmsResponse.features,
        }
        popup.value?.mapObject.openPopup(event.latlng)
      } else state.mapClickResponse = null
    }

    const checkableLayers = computed((): { [K: string]: Leaflet.Layer } => {
      const layerNames = dataOverlays.map((overlay: any) => overlay.name)
      // @ts-ignore
      return layerControl.value?.mapObject._layers.reduce(
        (layers: any, item: any) => {
          if (layerNames.includes(item.name)) {
            layers[item.name] = item.layer
          }
          return layers
        },
        {}
      )
    })
    watch(
      () => state.activeOverlays,
      (newVal) => {
        if (!checkableLayers.value) return
        if (document.getElementById('map')) {
          if (
            Object.keys(checkableLayers.value).some((el) => newVal.includes(el))
          )
            document.getElementById('map')?.classList.add('cursor-crosshair')
          else
            document.getElementById('map')?.classList.remove('cursor-crosshair')
        }
      },
      { deep: true }
    )
    return {
      ...toRefs(state),
      handleReady,
      updateCenter,
      handleBaseLayerChange,
      handleOverlayAdd,
      handleOverlayRemove,
      handleMapClick,
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
.cursor-crosshair {
  cursor: crosshair;
}

.cursor-crosshair:active {
  cursor: grabbing;
}

.leaflet-container {
  font-family: 'Open Sans', sans-serif;

  ::v-deep .leaflet-control-layers-toggle {
    width: 30px;
    height: 30px;
    background-size: 20px;
  }
}
</style>
