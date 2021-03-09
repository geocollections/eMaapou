<template>
  <client-only>
    <div :style="{ height: `${height}px` }">
      <l-map
        ref="map"
        style="z-index: 0"
        :options="options"
        :zoom="11"
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
          color="red"
        >
          <l-popup>{{ marker.text }}</l-popup>
        </l-circle-marker>
      </l-map>
      <div class="text-right">
        <span class="google-map">
          <a
            :href="`https://www.google.com/maps/?q=${center.latitude},${center.longitude}`"
            :title="`https://www.google.com/maps/?q=${center.latitude},${center.longitude}`"
            target="_blank"
            >Google Maps</a
          >
        </span>
        <span> | </span>
        <span class="xgis2">
          <a
            :href="`https://xgis.maaamet.ee/xgis2/page/app/geoloogia400k?punkt=${geoToLest(
              center.latitude,
              center.longitude
            )}&moot=20000&tooltip=test`"
            title="Estonian Geoportal"
            target="_blank"
            >Estonian Geoportal</a
          >
        </span>
      </div>
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
            visible: true,
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
  methods: {
    geoToLest(north, east) {
      const LAT = north * (Math.PI / 180)
      const LON = east * (Math.PI / 180)
      const a = 6378137.0
      let F = 298.257222100883
      const RF = F
      F = 1 / F
      const B0 = (57.0 + 31.0 / 60.0 + 3.194148 / 3600.0) * (Math.PI / 180)
      const L0 = 24.0 * (Math.PI / 180)
      const FN = 6375000.0
      const FE = 500000.0
      const B1 = (59.0 + 20.0 / 60.0) * (Math.PI / 180)
      const B2 = 58.0 * (Math.PI / 180)
      // let xx = north - FN;
      // let yy = east - FE;
      const f1 = 1 / RF
      const er = 2.0 * f1 - f1 * f1
      let e = Math.sqrt(er)
      const t1 = Math.sqrt(
        ((1.0 - Math.sin(B1)) / (1.0 + Math.sin(B1))) *
          Math.pow((1.0 + e * Math.sin(B1)) / (1.0 - e * Math.sin(B1)), e)
      )
      const t2 = Math.sqrt(
        ((1.0 - Math.sin(B2)) / (1.0 + Math.sin(B2))) *
          Math.pow((1.0 + e * Math.sin(B2)) / (1.0 - e * Math.sin(B2)), e)
      )
      const t0 = Math.sqrt(
        ((1.0 - Math.sin(B0)) / (1.0 + Math.sin(B0))) *
          Math.pow((1.0 + e * Math.sin(B0)) / (1.0 - e * Math.sin(B0)), e)
      )
      const t = Math.sqrt(
        ((1.0 - Math.sin(LAT)) / (1.0 + Math.sin(LAT))) *
          Math.pow((1.0 + e * Math.sin(LAT)) / (1.0 - e * Math.sin(LAT)), e)
      )
      const m1 =
        Math.cos(B1) / Math.pow(1.0 - er * Math.sin(B1) * Math.sin(B1), 0.5)
      const m2 =
        Math.cos(B2) / Math.pow(1.0 - er * Math.sin(B2) * Math.sin(B2), 0.5)
      let n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2))
      const FF = m1 / (n * Math.pow(t1, n))
      const p0 = a * FF * Math.pow(t0, n)
      const FII = n * (LON - L0)
      const p = a * FF * Math.pow(t, n)
      n = p0 - p * Math.cos(FII) + FN
      e = p * Math.sin(FII) + FE

      return [n, e]
    },
  },
}
</script>
