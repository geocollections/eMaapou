<template>
  <client-only>
    <l-map
      ref="map"
      style="z-index: 0"
      :options="options"
      :zoom="13"
      :center="[center.latitude, center.longitude]"
    >
      <l-control-layers />
      <l-control-fullscreen position="topleft" />
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
        :key="`marker-${idx}`"
        :lat-lng="[marker.latitude, marker.longitude]"
        :radius="4"
      >
        <l-popup>{{ marker.text }}</l-popup>
      </l-circle-marker>
    </l-map>
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
export default {
  name: 'LeafletMap',
  props: {
    height: {
      type: Number,
      default: 500,
    },
    center: {
      type: Object,
      default() {
        return { latitude: 0, longitude: 0 }
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
      layers: {
        base: [
          {
            id: 'carto-base',
            name: 'CartoDB',
            url:
              'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            visible: false,
            options: {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          {
            id: 'open-steet-base',
            name: 'OpenStreetMap',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

            visible: !this.isEstonian,
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
            visible: false,
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
    tileOverlays() {
      return this.layers.overlay.filter((item) => !item.isWMS)
    },

    wmsOverlays() {
      return this.layers.overlay.filter((item) => item.isWMS)
    },
  },
}
</script>
