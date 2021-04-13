<template>
  <client-only>
    <div :style="{ height: `${height}px` }">
      <l-map
        ref="map"
        style="z-index: 0"
        :options="options"
        :zoom="mapZoom"
        :center="[center.latitude, center.longitude]"
        @baselayerchange="handleBaseLayerChange"
        @overlayadd="handleOverlayAdd"
        @overlayremove="handleOverlayRemove"
        @ready="fitBounds"
      >
        <l-control-layers />
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
        <l-circle-marker
          v-for="(marker, idx) in markers"
          :key="`marker-${idx}-lat-${marker.latitude}-lon-${marker.latitude}`"
          :lat-lng="[marker.latitude, marker.longitude]"
          :radius="5"
          :weight="2"
          color="red"
          @click="
            marker.id && marker.routeName
              ? $router.push(
                  localePath({
                    name: `${marker.routeName}-id`,
                    params: { id: marker.id },
                  })
                )
              : ''
          "
        >
          <l-tooltip v-if="marker.text" :options="tooltipOptions">{{
            marker.text
          }}</l-tooltip>
        </l-circle-marker>

        <!-- <map-legend
          :active-base-layer="activeBaseLayer"
          :active-overlays="activeOverlays"
          :height="height"
        />-->
      </l-map>
      <map-links :latitude="center.latitude" :longitude="center.longitude" />
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
import MapLinks from '~/components/map/MapLinks'
export default {
  name: 'LeafletMap',
  components: { MapLinks },
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
    isEstonian: {
      type: Boolean,
      default: false,
    },
    invalidateSize: Boolean,
  },
  data() {
    return {
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
      activeBaseLayer: this.isEstonian ? 'Estonian map' : 'CartoDB',
      activeOverlays: [],
      layers: {
        base: [
          {
            id: 'carto-base',
            name: 'CartoDB',
            url:
              'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            visible: !this.isEstonian,
            options: {
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
            visible: this.isEstonian,
            options: {
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
            visible: false,
            options: {
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              detectRetina: true,
              zIndex: 2,
            },
          },
          {
            id: 'est-bed-overlay',
            isWMS: true,
            name: 'Estonian bedrock',
            url: 'https://gis.geocollections.info/geoserver/wms',
            layers: 'geocollections:bedrock400k',
            visible: this.isEstonian,
            transparent: true,
            options: {
              attribution:
                "Estonian maps: <a  href='https://ttu.ee/geoloogia-instituut'>Department of Geology</a>",
              format: 'image/png',
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true,
              zIndex: 2,
            },
          },
        ],
      },
    }
  },
  computed: {
    computedTileOverlays() {
      return this.layers.overlay.map((item) => {
        if (item.id === 'est-bed-overlay')
          return { ...item, visible: this.isEstonianBedrockVisibleAtAStart }
        else return item
      })
    },

    isEstonianBedrockVisibleAtAStart() {
      // HACK: Should probably be a prop
      return (
        this.isEstonian &&
        (this.$route.name.includes('drillcore-') ||
          this.$route.name.includes('locality-') ||
          this.$route.name.includes('stratigraphy-'))
      )
    },

    mapZoom() {
      return this.isEstonianBedrockVisibleAtAStart ? 9 : 11
    },

    tileOverlays() {
      return this.computedTileOverlays.filter((item) => !item.isWMS)
    },

    wmsOverlays() {
      return this.computedTileOverlays.filter((item) => item.isWMS)
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
  },
  methods: {
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
  },
}
</script>
