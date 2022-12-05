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
        <l-control-layers ref="layerControl" position="topleft" />
        <l-control-scale
          position="bottomleft"
          :metric="true"
          :imperial="false"
        />
        <l-tile-layer
          v-for="layer in computedBaseLayers"
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
// import MapLegend from '~/components/map/MapLegend'
import debounce from 'lodash/debounce'
import { LControlLayers, LMap, LPopup } from 'vue2-leaflet'
import {
  computed,
  defineComponent,
  nextTick,
  onUnmounted,
  PropType,
  reactive,
  ref,
  useContext,
  useRoute,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'
import type Leaflet from 'types/leaflet'
import MapLinks from '~/components/map/MapLinks.vue'
import LCircleMarkerWrapper from '~/components/map/LCircleMarkerWrapper.vue'
import VMarkerClusterWrapper from '~/components/map/VMarkerClusterWrapper.vue'
import MapClickPopup from '~/components/map/MapClickPopup.vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import 'leaflet.fullscreen/Control.FullScreen.css'
import { MapMarker } from '~/types/map'
import { useAccessor } from '~/composables/useAccessor'
let Vue2Leaflet: any = {}
let L: typeof Leaflet
if (process.client) {
  Vue2Leaflet = require('vue2-leaflet')
  L = require('leaflet')
  require('@geoman-io/leaflet-geoman-free')
  // require('leaflet-fullscreen')
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
interface State {
  activeGeomanLayer: L.GeoJSON | L.Circle | null
  map: L.Map | undefined
  [K: string]: any
}
export default defineComponent({
  name: 'LeafletMap',
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
    geojson: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  // @ts-ignore
  setup(props, { emit }) {
    const { $services, i18n } = useContext()
    const accessor = useAccessor()
    const route = useRoute()
    const state: State = reactive({
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
      layers: {
        base: [
          {
            id: 'carto-base',
            name: 'CartoDB',
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            visible: !props.estonianMap,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          {
            id: 'open-steet-base',
            name: 'OpenStreetMap',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            visible: false,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            },
          },
          {
            id: 'open-topo-base',
            name: 'OpenTopoMap',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            visible: false,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            },
          },
          {
            id: 'est-sat-base',
            name: 'Estonian satellite',
            url: 'https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
            visible: false,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              detectRetina: true,
              zIndex: 1,
            },
          },
          {
            id: 'est-map-base',
            name: 'Estonian map',
            url: 'https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
            visible: props.estonianMap,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              detectRetina: true,
              zIndex: 1,
            },
          },
        ],
        overlay: [
          {
            id: 'est-hyb-overlay',
            name: 'Estonian hybrid',
            url: 'https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
            visible: props.estonianHybridOverlay,
            zIndex: 20,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
              tms: true,
              detectRetina: true,
              zIndex: 20,
            },
          },
          {
            id: 'est-bed-overlay',
            isWMS: true,
            name: 'Estonian bedrock',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'geocollections:bedrock400k',
            visible: props.estonianBedrockOverlay,
            transparent: true,
            zIndex: 10,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 10,
            },
          },
          {
            id: 'est-basement-overlay',
            isWMS: true,
            name: 'Estonian basement',
            url: 'https://gis.geoloogia.info/geoserver/sarv/wms',
            layers: 'sarv:basement',
            visible: props.estonianBasementOverlay,
            transparent: true,
            zIndex: 10,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution:
                "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 10,
            },
          },
          {
            id: 'locs',
            isWMS: true,
            name: 'Lokaliteedid / Localities',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:locality_summary',
            styles: 'point',
            visible: props.localityOverlay,
            transparent: true,
            zIndex: 30,
            options: {
              // maxNativeZoom: 18,
              // minZoom: 13,
              // maxZoom: 21,
              attribution:
                "Localities: <a  href='https://geoloogia.info'>SARV</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 30,
            },
          },
          // {
          //   id: 'locs_tms',
          //   name: 'Localities (overview)',
          //   url:
          //     'https://gis.geocollections.info/geoserver/gwc/service/tms/1.0.0/sarv:locality_summary@EPSG3857@png/{z}/{x}/{-y}.png',
          //   // 'https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
          //   visible: this.localityOverlay,
          //   zIndex: 30,
          //   options: {
          //     maxNativeZoom: 12,
          //     maxZoom: 12,
          //     attribution:
          //       "Localities: <a  href='https://geoloogia.info'>SARV</a>",
          //     tms: true,
          //     detectRetina: true,
          //     zIndex: 30,
          //   },
          // },
          {
            id: 'drillcores',
            isWMS: true,
            name: 'Puursüdamikud / Drillcores',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:locality_drillcores',
            visible: props.boreholeOverlay,
            transparent: true,
            zIndex: 40,
            options: {
              // maxNativeZoom: 18,
              // maxZoom: 21,
              attribution:
                "Boreholes: <a  href='https://geoloogia.info'>SARV</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 40,
            },
          },
          {
            id: 'sites',
            isWMS: true,
            name: 'Uuringupunktid / Sites',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:site_summary',
            visible: props.siteOverlay,
            transparent: true,
            zIndex: 50,
            options: {
              // maxNativeZoom: 18,
              // maxZoom: 21,
              attribution: "Sites: <a  href='https://geoloogia.info'>SARV</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 50,
            },
          },
          {
            id: 'samples',
            isWMS: true,
            name: 'Proovid / Samples',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:sample_summary',
            visible: props.sampleOverlay,
            transparent: true,
            zIndex: 50,
            options: {
              // maxNativeZoom: 18,
              // maxZoom: 21,
              attribution:
                "Samples: <a  href='https://geoloogia.info'>SARV</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 50,
            },
          },
          {
            id: 'summary',
            isWMS: true,
            name: 'Üldine / Summary',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:locality_summary_front',
            visible: props.summaryOverlay,
            transparent: true,
            zIndex: 50,
            options: {
              // maxNativeZoom: 18,
              // maxZoom: 21,
              attribution:
                "Summary: <a  href='https://geoloogia.info'>SARV</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 50,
            },
          },
        ],
      },
    })
    const popup = ref<LPopup>()
    const layerControl = ref<LControlLayers>()
    const map = ref<LMap>()
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
    }, 500)
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

      // this.allGeomanLayers = L.layerGroup()
      // this.allGeomanLayers.addTo(this.map)

      state.map?.on('pm:globaldrawmodetoggled', handlePmGlobalDrawModeToggled)
      state.map?.on(
        'pm:globalremovalmodetoggled',
        handlePmGlobalRemovalModeToggled
      )
      state.map?.on('pm:create', handlePmCreate)
      state.map?.on('pm:remove', handlePmRemove)
      state.map?.on('locationfound', successGeo)
      state.map?.on('locationerror', errorGeo)
    }

    const trackPosition = () => {
      state.map?.locate({ watch: true, enableHighAccuracy: true })
    }
    const successGeo: Leaflet.LocationEventHandlerFn = (event) => {
      state.gpsLocation = event.latlng
    }
    const errorGeo: Leaflet.ErrorEventHandlerFn = (error) => {
      // eslint-disable-next-line no-console
      console.error(`Error: ${error.message}`)
    }
    const handleReady = () => {
      state.map = map.value?.mapObject
      if (props.activateSearch) initLeafletGeoman()
      // @ts-ignore
      if (props.gestureHandling) state.map?.gestureHandling.enable()
      if (props.gpsEnabled && props.activateSearch) trackPosition()

      if (isMapClickEnabled && document.getElementById('map')) {
        state.map?.on('click', handleMapClick)
        document.getElementById('map')?.classList.add('cursor-crosshair')
      }
      const isDetailView = route.value.name?.includes('-id-') ?? false
      // Setting initial base layer for detail view
      if (isDetailView) {
        if (!props.estonianMap && accessor.map.isBaseLayerEstonian)
          accessor.map.setBaseLayer('CartoDB')
        if (props.estonianMap && !accessor.map.isBaseLayerEstonian)
          accessor.map.setBaseLayer('Estonian map')
      }
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
      const checkableLayerNames = [
        'Lokaliteedid / Localities',
        'Puursüdamikud / Drillcores',
        'Uuringupunktid / Sites',
        'Proovid / Samples',
        'Üldine / Summary',
      ]
      // @ts-ignore
      return layerControl.value?.mapObject._layers.reduce(
        (layers: any, item: any) => {
          if (checkableLayerNames.includes(item.name)) {
            layers[item.name] = item.layer
          }
          return layers
        },
        {}
      )
    })
    const isMapClickEnabled = computed(() => {
      if (state.map)
        return Object.values(checkableLayers).some((layer) =>
          state.map?.hasLayer(layer)
        )
      else return false
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
      if (!isMapClickEnabled) return
      if (!state.map) return
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

      // NOTE: Condition added because on specimen detail view
      // switching language when after refreshing the page would
      // result in TypeError: cannot read property 'mapObject' of undefined.
      // Tried with different detail views as well, there the issue did not seem to be present.
      state.map?.off('click', handleMapClick)
    })

    const updateCenter = (center: { lng: number; lat: number }) => {
      state.currentCenter = center
    }
    const handleBaseLayerChange = (event: Leaflet.LayersControlEvent) => {
      accessor.map.setBaseLayer(event.name)
    }

    const handleOverlayAdd = (event: Leaflet.LayersControlEvent) => {
      if (!state.activeOverlays.includes(event.name)) {
        state.activeOverlays.push(event.name)
      }
    }

    const handleOverlayRemove = (event: Leaflet.LayersControlEvent) => {
      const index = state.activeOverlays.indexOf(event.name)
      if (index > -1) {
        state.activeOverlays.splice(index, 1)
      }
    }

    const tileOverlays = computed(() => {
      return state.layers.overlay.filter((item: any) => !item.isWMS)
    })
    const wmsOverlays = computed(() => {
      return state.layers.overlay.filter((item: any) => item.isWMS)
    })
    const latLngMarkers = computed(() => {
      return props.markers.map((m: MapMarker) => {
        return [m.latitude, m.longitude]
      })
    })
    const tooltipOptions = computed(() => {
      return {
        permanent: props.markers.length <= 5,
        direction: 'top',
        offset: [1, -7],
      }
    })
    const computedBaseLayers = computed(() => {
      return state.layers.base.map((layer: any) => {
        return {
          ...layer,
          visible: layer.name === accessor.map.getBaseLayer,
        }
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
      tooltipOptions,
      computedBaseLayers,
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
