<template>
  <client-only>
    <div>
      <l-map
        id="map"
        ref="map"
        :class="{ rounded: rounded }"
        :style="{ height: `${height}px` }"
        style="z-index: 0"
        :options="options"
        :zoom="mapZoom"
        :center="currentCenter"
        @update:center="updateCenter"
        @baselayerchange="handleBaseLayerChange"
        @overlayadd="handleOverlayAdd"
        @overlayremove="handleOverlayRemove"
        @ready="fitBounds"
        @click="handleClick"
      >
        <l-control-layers ref="layer-control" :auto-z-index="false" />
        <l-control-fullscreen position="topleft" />
        <l-control-scale
          position="bottomleft"
          :metric="true"
          :imperial="false"
        />
        <l-tile-layer
          v-for="layer in layers.base"
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

        <!-- <map-legend
          :active-base-layer="activeBaseLayer"
          :active-overlays="activeOverlays"
          :height="height"
        />-->
      </l-map>
      <map-links :latitude="currentCenter.lat" :longitude="currentCenter.lng" />
    </div>
    <template #placeholder>
      <div
        :style="`height: ${height}px; width: 100%`"
        class="d-flex align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          :size="100"
          :width="6"
        />
      </div>
    </template>
  </client-only>
</template>

<script>
// import MapLegend from '~/components/map/MapLegend'
import { debounce } from 'lodash'
import MapLinks from '~/components/map/MapLinks'
import LCircleMarkerWrapper from '~/components/map/LCircleMarkerWrapper'
import VMarkerClusterWrapper from '~/components/map/VMarkerClusterWrapper'

export default {
  name: 'LeafletMap',
  components: { VMarkerClusterWrapper, LCircleMarkerWrapper, MapLinks },
  props: {
    height: {
      type: Number,
      default: 500,
    },
    center: {
      type: Object,
      default() {
        return { latitude: 58.5, longitude: 25.5 }
      },
    },
    markers: {
      type: Array,
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
    estonianBedrockOverlay: {
      type: Boolean,
      default: false,
    },
    estonianHybridOverlay: {
      type: Boolean,
      default: false,
    },
    invalidateSize: Boolean,
    rounded: Boolean,
  },
  data() {
    return {
      currentCenter: { lat: this.center.latitude, lng: this.center.longitude },
      options: {
        gestureHandling: true,
        gestureHandlingOptions: {
          text: {
            touch: this.$t('gestureHandling.touch'),
            scroll: this.$t('gestureHandling.scroll'),
            scrollMac: this.$t('gestureHandling.scrollMac'),
          },
          duration: 1000,
        },
      },
      activeBaseLayer: this.estonianMap ? 'Estonian map' : 'CartoDB',
      activeOverlays: [],
      layers: {
        base: [
          {
            id: 'carto-base',
            name: 'CartoDB',
            url:
              'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
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
            url:
              'https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
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
            url:
              'https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
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
            url:
              'https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
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
            id: 'locs',
            isWMS: true,
            name: 'Localities',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:locality_summary',
            styles: 'point',
            visible: this.localityOverlay,
            transparent: true,
            zIndex: 30,
            options: {
              maxNativeZoom: 18,
              minZoom: 13,
              maxZoom: 21,
              attribution:
                "Localities: <a  href='https://geoloogia.info'>SARV</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 30,
            },
          },
          {
            id: 'locs_tms',
            name: 'Localities (overview)',
            url:
              'https://gis.geocollections.info/geoserver/gwc/service/tms/1.0.0/sarv:locality_summary@EPSG3857@png/{z}/{x}/{-y}.png',
            // 'https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV',
            visible: this.localityOverlay,
            zIndex: 30,
            options: {
              maxNativeZoom: 12,
              maxZoom: 12,
              attribution:
                "Localities: <a  href='https://geoloogia.info'>SARV</a>",
              tms: true,
              detectRetina: true,
              zIndex: 30,
            },
          },
          {
            id: 'drillcores',
            isWMS: true,
            name: 'Boreholes',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:locality_drillcores',
            visible: this.boreholeOverlay,
            transparent: true,
            zIndex: 40,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
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
            name: 'Sites',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'sarv:site_summary',
            visible: this.siteOverlay,
            transparent: true,
            zIndex: 50,
            options: {
              maxNativeZoom: 18,
              maxZoom: 21,
              attribution: "Sites: <a  href='https://geoloogia.info'>SARV</a>",
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
    mapZoom() {
      return this.estonianBedrockOverlay ? 9 : 11
    },

    tileOverlays() {
      return this.layers.overlay.filter((item) => !item.isWMS)
    },

    wmsOverlays() {
      return this.layers.overlay.filter((item) => item.isWMS)
    },
    latLngMarkers() {
      return [
        this.markers.map((marker) => marker.latitude),
        this.markers.map((marker) => marker.longitude),
      ]
    },
    tooltipOptions() {
      return {
        permanent: this.markers.length <= 5,
        direction: 'top',
        offset: [1, -7],
      }
    },

    markersAsFitBoundsObject() {
      return this.markers.map((m) => {
        return [m.latitude, m.longitude]
      })
    },

    checkableLayers() {
      const checkableLayerNames = [
        'Boreholes',
        'Sites',
        'Localities',
        'Localities (overview)',
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
  },
  watch: {
    markers() {
      this.fitBounds()
    },
    invalidateSize(newVal) {
      if (newVal) {
        this.$refs.map.mapObject.invalidateSize()
        // Fixes tooltip perminent positions when opeing map

        // HACK: This fixes initial bounds problem in search view (markers out of bounds)
        this.fitBounds()
        this.$refs.map.mapObject.setView(
          this.$refs.map.center,
          this.$refs.map.zoom
        )
      }
    },
    activeOverlays(newVal) {
      if (document.getElementById('map')) {
        if (Object.keys(this.checkableLayers).some((el) => newVal.includes(el)))
          document.getElementById('map').classList.add('cursor-crosshair')
        else document.getElementById('map').classList.remove('cursor-crosshair')
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isMapClickEnabled() && document.getElementById('map'))
        document.getElementById('map').classList.add('cursor-crosshair')
    })
  },
  methods: {
    updateCenter(center) {
      this.currentCenter = center
    },
    handleBaseLayerChange(event) {
      this.activeBaseLayer = event.name
    },

    handleOverlayAdd(event) {
      if (!this.activeOverlays.includes(event.name))
        this.activeOverlays.push(event.name)
    },

    handleOverlayRemove(event) {
      const index = this.activeOverlays.indexOf(event.name)
      if (index > -1) this.activeOverlays.splice(index, 1)
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
    },

    isMapClickEnabled() {
      if (this.$refs?.map?.mapObject) {
        return Object.values(this.checkableLayers).some((layer) =>
          this.$refs.map.mapObject.hasLayer(layer)
        )
      } else return false
    },

    handleClick: debounce(async function (event) {
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
            'sarv:locality_summary1,sarv:locality_drillcores,sarv:site_summary',
          // BBOX: `${bbox.minX},${bbox.minY},${bbox.maxX},${bbox.maxY}`,
          BBOX: bbox,
          // X: Math.floor(event.layerPoint.x),
          // Y: Math.floor(event.layerPoint.y),
          // HEIGHT: this.$refs.map.mapObject._size.y,
          // WIDTH: this.$refs.map.mapObject._size.x,
        })

        // console.log(wmsResponse)
        if (wmsResponse?.features?.length > 0) {
          if (wmsResponse?.features?.[0]?.properties?.url) {
            const url = wmsResponse.features[0].properties.url
            if (url.includes('/')) {
              const splitUrl = url.split('/')
              if (splitUrl.length >= 2) {
                const object = splitUrl[splitUrl.length - 2]
                const id = splitUrl[splitUrl.length - 1]
                if (object && id)
                  this.$router.push(
                    this.localePath({
                      name: `${object}-id`,
                      params: { id },
                    })
                  )
              }
            }
          }
        }
      }
    }, 400),

    buildQueryLayers() {
      const queryLayers = []
      if (this.activeOverlays.includes('Sites'))
        queryLayers.push('sarv:site_summary')
      if (this.activeOverlays.includes('Boreholes'))
        queryLayers.push('sarv:locality_drillcores')
      if (
        this.activeOverlays.includes('Localities') ||
        this.activeOverlays.includes('Localities (overview)')
      )
        queryLayers.push('sarv:locality_summary1')
      return queryLayers.join(',')
    },
  },
}
</script>

<style scoped>
.cursor-crosshair {
  cursor: crosshair;
}

.cursor-crosshair:active {
  cursor: grabbing;
}
</style>
