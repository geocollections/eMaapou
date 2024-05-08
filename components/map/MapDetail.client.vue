<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoJsonObject } from "geojson";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet-gesture-handling";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";
import type { MapMarker } from "~/types/map";

export type MapBaseLayer = keyof typeof baseLayers.value;
export type MapOverlay = keyof typeof overlays.value;

const props = withDefaults(defineProps<{
  height?: string;
  center?: { latitude: number; longitude: number };
  baseLayer?: MapBaseLayer;
  overlays?: MapOverlay[];
  gestureHandling?: boolean;
  showLinks?: boolean;
  markers?: MapMarker[];
  geojson?: GeoJsonObject;
}>(), {
  height: "500px",
  center: () => ({ latitude: 58.5, longitude: 25.5 }),
  baseLayer: "OpenStreetMap",
  overlays: () => [],
  gestureHandling: true,
  showLinks: true,
  markers: () => [],
});

const theme = useTheme();
const { t } = useI18n();
const currentCenter = ref({
  lat: props.center.latitude,
  lng: props.center.longitude,
});

const map = ref<L.Map>();

const settingsStore = useSettings();
const { mapBaseLayer, isBaseLayerEstonian } = storeToRefs(settingsStore);

const baseLayers = computed(() => {
  return {
    "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxNativeZoom: 18,
      maxZoom: 21,
      attribution:
          "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
    }),
    "OpenTopoMap": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxNativeZoom: 18,
      maxZoom: 21,
      attribution:
          "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> | &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a>",
    }),
    "Estonian satellite": L.tileLayer("https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV", {
      maxNativeZoom: 18,
      maxZoom: 21,
      attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
      tms: true,
      detectRetina: true,
      zIndex: 1,
    }),
    "Estonian map": L.tileLayer("https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV", {
      maxNativeZoom: 18,
      maxZoom: 21,
      attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
      tms: true,
      detectRetina: true,
      zIndex: 1,
    }),
  };
});

const overlays = computed(() => {
  return {
    "Estonian hybrid": L.tileLayer.wms("https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV", {
      layers: "EESTI_ALUSKAART",
      format: "image/png",
      transparent: true,
      maxNativeZoom: 18,
      maxZoom: 21,
      tms: true,
      detectRetina: true,
      attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
      zIndex: 20,
    }),
    "Estonian bedrock": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
      layers: "geocollections:bedrock400k",
      format: "image/png",
      transparent: true,
      maxNativeZoom: 18,
      maxZoom: 21,
      tms: true,
      detectRetina: true,
      attribution: "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
      zIndex: 20,
    }),
    "Estonian basement": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
      layers: "sarv:basement",
      format: "image/png",
      transparent: true,
      maxNativeZoom: 18,
      maxZoom: 21,
      tms: true,
      detectRetina: true,
      attribution: "Geology: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
      zIndex: 20,
    }),
    "Lokaliteedid / Localities": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
      layers: "sarv:locality_summary",
      format: "image/png",
      transparent: true,
      detectRetina: true,
      updateWhenIdle: true,
      attribution: "Localities: <a  href='https://geoloogia.info'>SARV</a>",
      zIndex: 30,
    }),
    "Puursüdamikud / Drillcores": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
      layers: "sarv:locality_drillcores",
      format: "image/png",
      transparent: true,
      detectRetina: true,
      updateWhenIdle: true,
      attribution: "Drillcores: <a  href='https://geoloogia.info'>SARV</a>",
      zIndex: 40,
    }),
    "Uuringupunktid / Sites": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
      layers: "sarv:site_summary",
      format: "image/png",
      transparent: true,
      detectRetina: true,
      updateWhenIdle: true,
      attribution: "Sites: <a  href='https://geoloogia.info'>SARV</a>",
      zIndex: 50,
    }),
    "Proovid / Samples": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
      layers: "sarv:sample_summary",
      format: "image/png",
      transparent: true,
      detectRetina: true,
      updateWhenIdle: true,
      attribution: "Samples: <a  href='https://geoloogia.info'>SARV</a>",
      zIndex: 60,
    }),
  };
});

const router = useRouter();
const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();
const route = useRoute();

const mapLayers = computed(() => {
  return [
    baseLayers.value[props.baseLayer],
    ...props.overlays.map(overlay => overlays.value[overlay]),
  ];
});

onMounted(() => {
  nextTick(() => {
    if (map.value)
      return;
    map.value = L.map("map", {
      center: [58.5, 25.5],
      zoom: 5,
      gestureHandling: props.gestureHandling,
      gestureHandlingOptions: {
        text: {
          touch: t("gestureHandling.touch"),
          scroll: t("gestureHandling.scroll"),
          scrollMac: t("gestureHandling.scrollMac"),
        },
        duration: 1000,
      },
      layers: mapLayers.value,
      fullscreenControl: true,
    });

    L.control.layers(baseLayers.value, overlays.value).addTo(map.value);

    const features = [];

    if (props.geojson)
      features.push(L.geoJSON(props.geojson));

    const markers = props.markers.map((marker) => {
      const markerInstance = L.circleMarker([marker.latitude, marker.longitude], {
        radius: 6,
        weight: 1.5,
        color: "#fff",
        fillColor: theme.current.value.colors.warning,
        fillOpacity: 1,

      });

      const markerRouteName = `${marker.routeName}-id`;

      markerInstance.on("click", (event) => {
        L.DomEvent.stopPropagation(event);

        if (marker.id === route.params.id && markerRouteName === getRouteBaseName(route))
          return;

        if (marker.id && marker.routeName) {
          router.push(
            localePath({
              name: markerRouteName,
              params: { id: marker.id.toString() },
            }),
          );
        }
      });

      markerInstance.bindTooltip(marker.text, {
        direction: "top",
        offset: [1, -7],
      });

      return markerInstance;
    });

    features.push(...markers);

    const group = L.featureGroup(features);

    group.addTo(map.value);
    map.value?.invalidateSize();

    map.value.fitBounds(group.getBounds(), {
      padding: [10, 10],
      maxZoom: 10,
    });
  });
});
</script>

<template>
  <div>
    <div
      id="map"
      class="border rounded"
      :style="{
        height: `${height}`,
        position: height === '100%' ? 'absolute' : 'relative',
      }"
    />
    <MapLinks
      v-if="showLinks"
      :latitude="currentCenter.lat"
      :longitude="currentCenter.lng"
    />
  </div>
</template>

<style lang="scss" scoped>
.cursor-crosshair {
  cursor: crosshair;
}

.cursor-crosshair:active {
  cursor: grabbing;
}

.leaflet-container {
  font-family: "Open Sans", sans-serif;

  :deep(.leaflet-control-layers-toggle) {
    width: 30px;
    height: 30px;
    background-size: 20px;
  }
}
</style>
