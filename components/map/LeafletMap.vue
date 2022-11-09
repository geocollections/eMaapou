<template>
  <client-only>
    <div>
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
        @ready="fitBounds"
      >
        <l-control-layers ref="layer-control" :auto-z-index="false" />
        <l-control-fullscreen position="topleft" />
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

        <l-geo-json v-if="geoJSON" :geojson="geoJSON" />
        <l-layer-group ref="popup">
          <map-click-popup :response="mapClickResponse" />
        </l-layer-group>

        <!-- <map-legend
          :active-base-layer="activeBaseLayer"
          :active-overlays="activeOverlays"
          :height="height"
        />-->
      </l-map>
      <map-links
        v-if="showLinks"
        :latitude="currentCenter.lat"
        :longitude="currentCenter.lng"
      />
    </div>
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
</template>

<script lang="ts">
// @ts-nocheck
// import MapLegend from '~/components/map/MapLegend'
import debounce from 'lodash/debounce'
import { mapFields } from 'vuex-map-fields'
import { mapActions, mapGetters } from 'vuex'
import Vue, { PropType } from 'vue'
import MapLinks from '~/components/map/MapLinks.vue'
import LCircleMarkerWrapper from '~/components/map/LCircleMarkerWrapper.vue'
import VMarkerClusterWrapper from '~/components/map/VMarkerClusterWrapper.vue'
import MapClickPopup from '~/components/map/MapClickPopup.vue'
export default Vue.extend({
  name: 'LeafletMap',
  components: {
    MapClickPopup,
    VMarkerClusterWrapper,
    LCircleMarkerWrapper,
    MapLinks,
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
      type: Array as PropType<{ latitude: number; longitude: number }[]>,
      required: false,
      default() {
        return []
      },
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
  data() {
    return {
      map: null,
      allGeomanLayers: null,
      activeGeomanLayer: null,
      gpsLocation: null,
      gpsID: null as null | number,
      nearMeRadius: 5,
      currentCenter: {
        lat: this.center.latitude,
        lng: this.center.longitude,
      },
      mapClickResponse: null,
      options: {
        gestureHandling: this.gestureHandling,
        gestureHandlingOptions: {
          text: {
            touch: this.$t('gestureHandling.touch'),
            scroll: this.$t('gestureHandling.scroll'),
            scrollMac: this.$t('gestureHandling.scrollMac'),
          },
          duration: 1000,
        },
      },
      activeOverlays: [],
      layers: {
        base: [
          {
            id: 'carto-base',
            name: 'CartoDB',
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            visible: !this.estonianMap,
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
            visible: this.estonianMap,
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
            visible: this.estonianHybridOverlay,
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
            visible: this.estonianBedrockOverlay,
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
            visible: this.estonianBasementOverlay,
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
            visible: this.localityOverlay,
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
            visible: this.boreholeOverlay,
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
            visible: this.siteOverlay,
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
            visible: this.sampleOverlay,
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
            visible: this.summaryOverlay,
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
    }
  },
  computed: {
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('map', ['isBaseLayerEstonian', 'getBaseLayer']),
    mapZoom(): number {
      return this.zoom ?? (this.estonianBedrockOverlay ? 9 : 11)
    },
    tileOverlays(): object[] {
      return this.layers.overlay.filter((item) => !item.isWMS)
    },
    wmsOverlays(): object[] {
      return this.layers.overlay.filter((item) => item.isWMS)
    },
    latLngMarkers(): [number, number][] {
      return this.markers.map((m) => {
        return [m.latitude, m.longitude]
      })
    },
    tooltipOptions(): object {
      return {
        permanent: this.markers.length <= 5,
        direction: 'top',
        offset: [1, -7],
      }
    },

    markersAsFitBoundsObject(): [number, number][] {
      return this.markers.map((m) => {
        return [m.latitude, m.longitude]
      })
    },

    checkableLayers(): any {
      const checkableLayerNames = [
        'Lokaliteedid / Localities',
        'Puursüdamikud / Drillcores',
        'Uuringupunktid / Sites',
        'Proovid / Samples',
        'Üldine / Summary',
      ]

      return this.$refs['layer-control'].mapObject._layers.reduce(
        (layers, item) => {
          if (checkableLayerNames.includes(item.name)) {
            layers[item.name] = item.layer
          }
          return layers
        },
        {}
      )
    },

    isDetailView(): boolean {
      return (this.$route.name as string)?.includes('-id-')
    },

    computedBaseLayers(): object[] {
      return this.layers.base.map((layer) => {
        return {
          ...layer,
          visible: layer.name === this.getBaseLayer,
        }
      })
    },
    isPolygonSet(): boolean {
      return this.polygon && this.polygon.length > 0
    },
  },
  // Todo: watch language update for leaflet geoman, this means pull request for et.json file should be made
  watch: {
    markers() {
      this.fitBounds()
    },
    invalidateSize(newVal) {
      if (newVal) {
        this.$refs.map.mapObject.invalidateSize()

        // HACK: This fixes initial bounds problem in search view (markers out of bounds)
        this.fitBounds()
      }
    },
    activeOverlays(newVal) {
      if (document.getElementById('map')) {
        if (Object.keys(this.checkableLayers).some((el) => newVal.includes(el)))
          document.getElementById('map').classList.add('cursor-crosshair')
        else document.getElementById('map').classList.remove('cursor-crosshair')
      }
    },

    activeGeomanLayer(newVal) {
      if (newVal) {
        const json = newVal.toGeoJSON()

        // Adding radius if Circle
        if (newVal instanceof this.$L.Circle) {
          json.properties.radius = newVal.getRadius()
        }

        if (json) this.geoJSON = json
      } else this.geoJSON = null

      // Updating activeGeomanLayer triggers search update
      this.$emit('update')
    },

    geoJSON(newVal) {
      if (!newVal) this.removeAllGeomanLayers()
    },
    gestureHandling(value) {
      if (!this.map) return
      if (!value) this.map.mapObject.gestureHandling.disable()
      else this.map.mapObject.gestureHandling.enable()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map

      if (this.activateSearch) this.initLeafletGeoman()

      if (this.gpsEnabled) this.trackPosition()

      if (this.isMapClickEnabled() && document.getElementById('map')) {
        this.map.mapObject.on('click', this.handleMapClick)
        document.getElementById('map').classList.add('cursor-crosshair')
      }

      // Setting initial base layer for detail view
      if (this.isDetailView) {
        if (!this.estonianMap && this.isBaseLayerEstonian)
          this.setBaseLayer('CartoDB')
        if (this.estonianMap && !this.isBaseLayerEstonian)
          this.setBaseLayer('Estonian map')
      }
    })
  },
  beforeDestroy() {
    if (this.gpsID) navigator.geolocation.clearWatch(this.gpsID)
    if (this.activateSearch) this.terminateLeafletGeoman()

    // NOTE: Condition added because on specimen detail view
    // switching language when after refreshing the page would
    // result in TypeError: cannot read property 'mapObject' of undefined.
    // Tried with different detail views as well, there the issue did not seem to be present.
    if (this.map) this.map.mapObject.off('click', this.handleMapClick)
  },
  methods: {
    ...mapActions('map', ['setBaseLayer']),
    updateCenter(center) {
      this.currentCenter = center
    },
    handleBaseLayerChange(event) {
      this.setBaseLayer(event.name)
    },

    handleOverlayAdd(event) {
      if (!this.activeOverlays.includes(event.name)) {
        this.activeOverlays.push(event.name)
      }
    },

    handleOverlayRemove(event) {
      const index = this.activeOverlays.indexOf(event.name)
      if (index > -1) {
        this.activeOverlays.splice(index, 1)
      }
    },

    fitBounds() {
      if (this.markersAsFitBoundsObject.length > 0) {
        this.$nextTick(() => {
          this.$refs.map.mapObject.fitBounds(this.markersAsFitBoundsObject, {
            padding: [50, 50],
            maxZoom: this.mapZoom,
          })
        })
      }
      if (this.geojson) {
        this.$nextTick(() => {
          const group = this.$L.featureGroup()
          this.$refs.map.mapObject.eachLayer(function (layer) {
            if (layer.feature !== undefined) group.addLayer(layer)
          })
          this.$refs.map.mapObject.fitBounds(group.getBounds(), {
            padding: [50, 50],
            maxZoom: this.geojson.type === 'Point' ? this.mapZoom : null,
          })
        })
      }
    },

    isMapClickEnabled() {
      if (this.$refs?.map?.mapObject)
        return Object.values(this.checkableLayers).some((layer) =>
          this.$refs.map.mapObject.hasLayer(layer)
        )
      else return false
    },

    handleMapClick: debounce(async function (this, event) {
      if (this.isMapClickEnabled()) {
        const MAX_ZOOM = 21
        const radius =
          (MAX_ZOOM + 0.25 - this.$refs.map.mapObject.getZoom()) * 1000
        const circle = this.$L
          .circle(event.latlng, { radius })
          .addTo(this.$refs.map.mapObject)
        const bbox = circle.getBounds().toBBoxString()

        // eslint-disable-next-line no-unused-vars
        // const rect = this.$L
        //   .rectangle(circle.getBounds(), { color: 'green', weight: 1 })
        //   .addTo(this.$refs.map.mapObject)
        circle.remove()

        const wmsResponse = await this.$services.geoserver.getWMSData({
          QUERY_LAYERS: this.buildQueryLayers(),
          LAYERS:
            'sarv:locality_summary1,sarv:locality_drillcores,sarv:site_summary,sarv:sample_summary,sarv:locality_summary_front',
          // BBOX: `${bbox.minX},${bbox.minY},${bbox.maxX},${bbox.maxY}`,
          BBOX: bbox,
          // X: Math.floor(event.layerPoint.x),
          // Y: Math.floor(event.layerPoint.y),
          // HEIGHT: this.$refs.map.mapObject._size.y,
          // WIDTH: this.$refs.map.mapObject._size.x,
        })

        // console.log(wmsResponse)
        if (wmsResponse?.features?.length > 0) {
          this.mapClickResponse = {
            latlng: event.latlng,
            features: wmsResponse.features,
          }
          this.$refs.popup.mapObject.openPopup(event.latlng)
        } else this.mapClickResponse = null
      }
    }, 400),

    buildQueryLayers() {
      const queryLayers = []
      if (this.activeOverlays.includes('Uuringupunktid / Sites')) {
        queryLayers.push('sarv:site_summary')
      }
      if (this.activeOverlays.includes('Puursüdamikud / Drillcores')) {
        queryLayers.push('sarv:locality_drillcores')
      }
      if (this.activeOverlays.includes('Lokaliteedid / Localities')) {
        queryLayers.push('sarv:locality_summary1')
      }
      if (this.activeOverlays.includes('Proovid / Samples')) {
        queryLayers.push('sarv:sample_summary')
      }
      if (this.activeOverlays.includes('Üldine / Summary')) {
        queryLayers.push('sarv:locality_summary_front')
      }
      return queryLayers.join(',')
    },

    initLeafletGeoman() {
      if (this.map?.mapObject) {
        this.map.mapObject.pm.addControls({
          position: 'topleft',
          drawMarker: false,
          drawCircleMarker: false,
          drawPolyline: false,
          editMode: false,
          dragMode: false,
          cutPolygon: false,
          rotateMode: false,
        })

        this.map.mapObject.pm.setGlobalOptions({
          allowSelfIntersection: false,
          finishOn: 'dblclick',
          snappable: false,
        })

        this.allGeomanLayers = this.$L.layerGroup()
        this.allGeomanLayers.addTo(this.map.mapObject)

        this.map.mapObject.on(
          'pm:globaldrawmodetoggled',
          this.handlePmGlobalDrawOrRemovalModeToggled
        )
        this.map.mapObject.on(
          'pm:globalremovalmodetoggled',
          this.handlePmGlobalDrawOrRemovalModeToggled
        )
        this.map.mapObject.on('pm:create', this.handlePmCreate)
        this.map.mapObject.on('pm:remove', this.handlePmRemove)
      }
    },

    terminateLeafletGeoman() {
      if (this.map?.mapObject) {
        this.map.mapObject.off('pm:create', this.handlePmCreate)
        this.map.mapObject.off('pm:remove', this.handlePmRemove)
      }
    },

    handlePmGlobalDrawOrRemovalModeToggled(event) {
      if (event.enabled) this.map.mapObject.off('click', this.handleMapClick)
      else this.map.mapObject.on('click', this.handleMapClick)
    },

    handlePmCreate({ layer }) {
      // layer.pm.enable({ allowSelfIntersection: false })
      // console.log(layer.pm.hasSelfIntersection())
      this.removeAllGeomanLayers()
      layer.addTo(this.allGeomanLayers)
      this.activeGeomanLayer = layer
    },

    handlePmRemove() {
      this.removeAllGeomanLayers()
      this.activeGeomanLayer = null
      this.geoJSON = null
      this.$emit('update')
    },

    removeAllGeomanLayers() {
      this.allGeomanLayers.eachLayer((layer) => layer.remove())
    },

    // GPS start
    trackPosition() {
      if (navigator.geolocation) {
        this.gpsID = navigator.geolocation.watchPosition(
          this.successGeo,
          this.errorGeo
        )
        // eslint-disable-next-line no-console
      } else console.error('Geolocation is not supported by this browser.')
    },

    successGeo(position: any) {
      if (position) {
        this.gpsLocation = {
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        }
      }
    },

    errorGeo(error: any) {
      // eslint-disable-next-line no-console
      console.error(`Error: ${error.message}`)
    },
    // GPS end

    handleNearMeSliderChange: debounce(function (this: any, val) {
      if (val) {
        this.removeAllGeomanLayers()
        const circle = this.$L.circle(this.gpsLocation, { radius: val * 1000 })
        circle.addTo(this.allGeomanLayers)
        this.activeGeomanLayer = circle
      }
    }, 500),
  },
})
</script>

<style scoped>
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
}
</style>
