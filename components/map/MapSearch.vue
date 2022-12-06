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
        <l-marker
          v-if="gpsEnabled && gpsLocation"
          :lat-lng="gpsLocation"
          @click="handleNearMeSliderChange(nearMeRadius)"
        >
          <l-tooltip :options="{ direction: 'top', offset: [-15, -15] }"
            ><b>GPS</b> ({{ $t('map.clickToSearchNearMe') }})</l-tooltip
          >
          <l-popup>
            <div class="d-flex flex-row">
              <div class="align-self-center text-no-wrap">1 km</div>
              <v-slider
                v-model="nearMeRadius"
                style="width: 150px"
                :min="1"
                :max="20"
                hide-details
                thumb-label="always"
                color="header"
                @input="handleNearMeSliderChange"
              />
              <div class="align-self-center text-no-wrap">20 km</div>
            </div>
          </l-popup>
        </l-marker>

        <l-layer-group ref="popup">
          <map-click-popup :response="mapClickResponse" />
        </l-layer-group>

        <!-- <map-legend
          :active-base-layer="activeBaseLayer"
          :active-overlays="activeOverlays"
          :height="height"
        />-->
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
import debounce from 'lodash/debounce'
import intersection from 'lodash/intersection'
import type { LControlLayers, LMap, LPopup } from 'vue2-leaflet'
import {
  computed,
  defineComponent,
  nextTick,
  onUnmounted,
  PropType,
  reactive,
  ref,
  useContext,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'
import type Leaflet from 'leaflet'
import MapLinks from '~/components/map/MapLinks.vue'
import LCircleMarkerWrapper from '~/components/map/LCircleMarkerWrapper.vue'
import VMarkerClusterWrapper from '~/components/map/VMarkerClusterWrapper.vue'
import MapClickPopup from '~/components/map/MapClickPopup.vue'
import { MapMarker } from '~/types/map'
import { useAccessor } from '~/composables/useAccessor'
import {
  MapState,
  useDataOverlays,
  useLeafletMap,
} from '~/composables/useLeafletMap'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import 'leaflet.fullscreen/Control.FullScreen.css'
let Vue2Leaflet: any = {}
let L: typeof Leaflet
if (process.client) {
  Vue2Leaflet = require('vue2-leaflet')
  L = require('leaflet')
  require('@geoman-io/leaflet-geoman-free')
  require('leaflet-gesture-handling')
  require('leaflet.fullscreen')
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
interface State extends MapState {
  activeGeomanLayer: L.GeoJSON | L.Circle | null
}
export default defineComponent({
  name: 'MapSearch',
  components: {
    MapClickPopup,
    VMarkerClusterWrapper,
    LCircleMarkerWrapper,
    MapLinks,
    'l-control-layers': Vue2Leaflet.LControlLayers,
    'l-control-scale': Vue2Leaflet.LControlScale,
    'l-layer-group': Vue2Leaflet.LLayerGroup,
    'l-map': Vue2Leaflet.LMap,
    'l-marker': Vue2Leaflet.LMarker,
    'l-popup': Vue2Leaflet.LPopup,
    'l-tile-layer': Vue2Leaflet.LTileLayer,
    'l-tooltip': Vue2Leaflet.LTooltip,
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
    boreholeOverlay: {
      type: Boolean,
      default: false,
    },
    localityOverlay: {
      type: Boolean,
      default: false,
    },
    siteOverlay: {
      type: Boolean,
      default: false,
    },
    sampleOverlay: {
      type: Boolean,
      default: false,
    },
    summaryOverlay: {
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
    // Enables search functionality: Drawing etc.
    activateSearch: Boolean,
    gpsEnabled: Boolean,
    gestureHandling: {
      type: Boolean,
      default: true,
    },
    showLinks: {
      type: Boolean,
      default: true,
    },
  },
  // @ts-ignore
  setup(props, { emit }) {
    const { $services, i18n } = useContext()
    const accessor = useAccessor()
    const state: MapState = reactive({
      gpsID: null as null | number,
      map: undefined,
      mapClickResponse: null as any,
      activeGeomanLayer: null,
      gpsLocation: null as any,
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
    const dataOverlays = useDataOverlays({
      localityOverlay: props.localityOverlay,
      boreholeOverlay: props.boreholeOverlay,
      siteOverlay: props.siteOverlay,
      sampleOverlay: props.sampleOverlay,
      summaryOverlay: props.summaryOverlay,
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
      }
    )

    watch(
      () => props.markers,
      () => {
        fitBounds()
      }
    )
    watch(
      () => props.invalidateSize,
      (newVal) => {
        if (newVal) {
          state.map?.invalidateSize()
          // HACK: This fixes initial bounds problem in search view (markers out of bounds)
          fitBounds()
        }
      }
    )

    const handleNearMeSliderChange = debounce((val: number) => {
      if (state.activeGeomanLayer)
        state.map?.removeLayer(state.activeGeomanLayer)
      // eslint-disable-next-line no-use-before-define
      const circle = L.circle(state.gpsLocation, { radius: val * 1000 }).addTo(
        state.map as L.Map
      )
      // circle.addTo(this.allGeomanLayers)
      state.activeGeomanLayer = circle

      const json = state.activeGeomanLayer?.toGeoJSON()
      if (state.activeGeomanLayer instanceof L.Circle) {
        // @ts-ignore
        json.properties.radius = state.activeGeomanLayer.getRadius()
      }
      accessor.search.SET_GLOBAL_FILTER_VALUE({
        key: 'geoJSON',
        value: json,
      })
      emit('update')
    }, 200)
    const handlePmCreate: Leaflet.PM.CreateEventHandler = ({ layer }) => {
      if (state.activeGeomanLayer) {
        state.map?.removeLayer(state.activeGeomanLayer)
      }
      state.activeGeomanLayer = layer as State['activeGeomanLayer']
      const json = state.activeGeomanLayer?.toGeoJSON()
      // Adding radius if Circle
      if (state.activeGeomanLayer instanceof L.Circle) {
        // @ts-ignore
        json.properties.radius = state.activeGeomanLayer.getRadius()
      }
      accessor.search.SET_GLOBAL_FILTER_VALUE({
        key: 'geoJSON',
        value: json,
      })
      emit('update')
    }
    const handlePmRemove: Leaflet.PM.RemoveEventHandler = () => {
      state.activeGeomanLayer?.remove()
      state.activeGeomanLayer = null

      accessor.search.SET_GLOBAL_FILTER_VALUE({ key: 'geoJSON', value: null })
      emit('update')
    }
    const handlePmGlobalDrawModeToggled: Leaflet.PM.GlobalDrawModeToggledEventHandler =
      (event) => {
        if (event.enabled) state.map?.off('click', handleMapClick)
        else state.map?.on('click', handleMapClick)
      }
    const handlePmGlobalRemovalModeToggled: Leaflet.PM.GlobalRemovalModeToggledEventHandler =
      (event) => {
        if (event.enabled) state.map?.off('click', handleMapClick)
        else state.map?.on('click', handleMapClick)
      }
    const initLeafletGeoman = () => {
      state.map?.pm.addControls({
        position: 'topleft',
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        editMode: false,
        dragMode: false,
        cutPolygon: false,
        rotateMode: false,
        drawText: false,
      })

      state.map?.pm.setGlobalOptions({
        allowSelfIntersection: false,
        finishOn: 'dblclick',
        snappable: false,
      })

      state.map?.on('pm:globaldrawmodetoggled', handlePmGlobalDrawModeToggled)
      state.map?.on(
        'pm:globalremovalmodetoggled',
        handlePmGlobalRemovalModeToggled
      )
      state.map?.on('pm:create', handlePmCreate)
      state.map?.on('pm:remove', handlePmRemove)
      state.map?.on('locationfound', successGeo)
    }
    const successGeo: Leaflet.LocationEventHandlerFn = (event) => {
      state.gpsLocation = event.latlng
    }
    const handleReady = () => {
      ready()
      initLeafletGeoman()
      state.map?.on('click', handleMapClick)
      if (props.gpsEnabled)
        state.map?.locate({ watch: true, enableHighAccuracy: true })
      if (accessor.search.globalFilters.byIds.geoJSON.value) {
        state.activeGeomanLayer = L.geoJSON(
          accessor.search.globalFilters.byIds.geoJSON.value,
          {
            pointToLayer: function (feature, latlng) {
              return L.circle(latlng, feature.properties.radius)
            },
          }
        )
        state.map?.addLayer(state.activeGeomanLayer)
      }
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
        const geoJSON = accessor.search.globalFilters.byIds.geoJSON.value
        if (geoJSON) {
          state.map?.fitBounds(
            (state.activeGeomanLayer as Leaflet.FeatureGroup).getBounds(),
            {
              padding: [50, 50],
              maxZoom: geoJSON.type === 'Point' ? mapZoom.value : undefined,
            }
          )
        } else if (markersAsFitBoundsObject.value.length > 0) {
          state.map?.fitBounds(markersAsFitBoundsObject.value, {
            padding: [50, 50],
            maxZoom: mapZoom.value,
          })
        }
      })
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
    const isMapClickEnabled = computed(() => {
      const layerNames = dataOverlays.map((overlay: any) => overlay.name)
      return intersection(layerNames, state.activeOverlays).length > 0
    })
    const terminateLeafletGeoman = () => {
      state.map?.off('pm:create', handlePmCreate)
      state.map?.off('pm:remove', handlePmRemove)
    }
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
    onUnmounted(() => {
      if (state.gpsID) navigator.geolocation.clearWatch(state.gpsID)
      if (props.activateSearch) terminateLeafletGeoman()
    })

    const tileOverlays = computed(() => {
      return [...estonianOverlays, ...dataOverlays].filter(
        (overlay: any) => !overlay.isWMS
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
    return {
      ...toRefs(state),
      handleReady,
      handleNearMeSliderChange,
      updateCenter,
      handleBaseLayerChange,
      handleOverlayAdd,
      handleOverlayRemove,
      tileOverlays,
      wmsOverlays,
      latLngMarkers,
      baseLayers,
      mapZoom,
      fitBounds,
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

.leaflet-draw-toolbar {
  padding-left: unset;
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
