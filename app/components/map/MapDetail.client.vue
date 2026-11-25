<script setup lang="ts">
import type { GeoJsonObject } from "geojson";
import L from "leaflet";
import { useMapWheelZoom } from "~/composables/useMapWheelZoom";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet-gesture-handling";
import "leaflet.fullscreen";
import "leaflet.fullscreen/dist/Control.FullScreen.css";

export type MapBaseLayer = keyof typeof baseLayers;
export type MapOverlay = keyof typeof overlays;

const props = withDefaults(defineProps<{
  height?: string;
  center?: { latitude: number; longitude: number };
  baseLayer?: MapBaseLayer;
  overlays?: MapOverlay[];
  gestureHandling?: boolean;
  clickToZoom?: boolean;
  showLinks?: boolean;
  markers?: MapMarker[];
  geojson?: GeoJsonObject;
}>(), {
  height: "500px",
  center: () => ({ latitude: 58.5, longitude: 25.5 }),
  baseLayer: "OpenStreetMap",
  overlays: () => [],
  ...{ gestureHandling: true },
  clickToZoom: false,
  showLinks: true,
  markers: () => [],
});

const colors = usePortalColors();
const { t } = useI18n();
const currentCenter = ref({
  lat: props.center.latitude,
  lng: props.center.longitude,
});

const container = useTemplateRef<HTMLDivElement>("container");
const map = shallowRef<L.Map>();
const wheelZoomPosition = shallowRef<L.Point>();
const {
  options: wheelZoomOptions,
  active: wheelZoomActive,
  instruction: wheelZoomInstruction,
  activate: activateWheelZoom,
} = useMapWheelZoom();
let mapResizeObserver: ResizeObserver | undefined;

const landBoardLink = `<a href="http://www.maaamet.ee/">${t("portal.map.landBoard")}</a>`;
const sarvLink = "<a href=\"https://geoloogia.info\">SARV</a>";

const baseLayers = {
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
    attribution: t("portal.map.attributionLandBoard", { link: landBoardLink }),
    tms: true,
    detectRetina: true,
    zIndex: 1,
  }),
  "Estonian map": L.tileLayer("https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV", {
    maxNativeZoom: 18,
    maxZoom: 21,
    attribution: t("portal.map.attributionLandBoard", { link: landBoardLink }),
    tms: true,
    detectRetina: true,
    zIndex: 1,
  }),
};

const overlays = {
  "Estonian hybrid": L.tileLayer.wms("https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV", {
    layers: "EESTI_ALUSKAART",
    format: "image/png",
    transparent: true,
    maxNativeZoom: 18,
    maxZoom: 21,
    tms: true,
    detectRetina: true,
    attribution: t("portal.map.attributionLandBoard", { link: landBoardLink }),
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
    attribution: t("portal.map.attributionGeology", { link: landBoardLink }),
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
    attribution: t("portal.map.attributionGeology", { link: landBoardLink }),
    zIndex: 20,
  }),
  "Lokaliteedid / Localities": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
    layers: "sarv:locality_summary",
    format: "image/png",
    transparent: true,
    detectRetina: true,
    updateWhenIdle: true,
    attribution: t("portal.map.attributionLocalities", { link: sarvLink }),
    zIndex: 30,
  }),
  "Puursüdamikud / Drillcores": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
    layers: "sarv:locality_drillcores",
    format: "image/png",
    transparent: true,
    detectRetina: true,
    updateWhenIdle: true,
    attribution: t("portal.map.attributionDrillcores", { link: sarvLink }),
    zIndex: 40,
  }),
  "Uuringupunktid / Sites": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
    layers: "sarv:site_summary",
    format: "image/png",
    transparent: true,
    detectRetina: true,
    updateWhenIdle: true,
    attribution: t("portal.map.attributionSites", { link: sarvLink }),
    zIndex: 50,
  }),
  "Proovid / Samples": L.tileLayer.wms("https://gis.geocollections.info/geoserver/wms", {
    layers: "sarv:sample_summary",
    format: "image/png",
    transparent: true,
    detectRetina: true,
    updateWhenIdle: true,
    attribution: t("portal.map.attributionSamples", { link: sarvLink }),
    zIndex: 60,
  }),
};

const router = useRouter();
const route = useRoute();

const mapLayers = computed(() => {
  return [
    baseLayers[props.baseLayer],
    ...props.overlays.map(overlay => overlays[overlay]),
  ];
});

onMounted(() => {
  nextTick(() => {
    if (!container.value || map.value)
      return;
    map.value = L.map(container.value, {
      center: [58.5, 25.5],
      zoom: 5,

      ...(props.clickToZoom
        ? wheelZoomOptions
        : {}),
      ...{ gestureHandling: props.gestureHandling && !props.clickToZoom },
      ...{
        gestureHandlingOptions: {
          text: {
            touch: t("gestureHandling.touch"),
            scroll: t("gestureHandling.scroll"),
            scrollMac: t("gestureHandling.scrollMac"),
          },
          duration: 1000,
        },
      },
      layers: mapLayers.value,
      fullscreenControl: true,
    });

    if (props.clickToZoom)
      map.value.on("click", () => activateWheelZoom(map.value));

    L.control.layers({
      OpenStreetMap: baseLayers.OpenStreetMap,
      OpenTopoMap: baseLayers.OpenTopoMap,
      [t("portal.map.layers.estonianSatellite")]: baseLayers["Estonian satellite"],
      [t("portal.map.layers.estonianMap")]: baseLayers["Estonian map"],
    }, {
      [t("portal.map.layers.estonianHybrid")]: overlays["Estonian hybrid"],
      [t("portal.map.layers.estonianBedrock")]: overlays["Estonian bedrock"],
      [t("portal.map.layers.estonianBasement")]: overlays["Estonian basement"],
      [t("portal.map.layers.localities")]: overlays["Lokaliteedid / Localities"],
      [t("portal.map.layers.drillcores")]: overlays["Puursüdamikud / Drillcores"],
      [t("portal.map.layers.sites")]: overlays["Uuringupunktid / Sites"],
      [t("portal.map.layers.samples")]: overlays["Proovid / Samples"],
    }).addTo(map.value);

    const features = [];

    if (props.geojson)
      features.push(L.geoJSON(props.geojson));

    const markers = props.markers.map((marker) => {
      const markerInstance = L.circleMarker([marker.latitude, marker.longitude], {
        radius: marker.radius ?? 6,
        weight: 1.5,
        color: colors.background,
        fillColor: colors.primary,
        fillOpacity: 1,

      });

      markerInstance.on("click", (event) => {
        L.DomEvent.stopPropagation(event);

        if (marker.route === undefined) {
          return;
        }
        if (router.resolve(marker.route).fullPath === route.fullPath)
          return;

        router.push(marker.route);
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

    if (props.clickToZoom) {
      const instance = map.value;
      const positionInstruction = () => {
        if (!wheelZoomActive.value)
          wheelZoomPosition.value = instance.latLngToContainerPoint(currentCenter.value);
      };

      instance.on("move resize", positionInstruction);
      positionInstruction();
    }

    mapResizeObserver = new ResizeObserver(() => {
      map.value?.invalidateSize({ pan: false });
    });
    mapResizeObserver.observe(map.value.getContainer());
  });
});

onBeforeUnmount(() => {
  mapResizeObserver?.disconnect();
  map.value?.remove();
});
</script>

<template>
  <div :class="height === '100%' ? 'flex h-full min-h-0 flex-col' : undefined">
    <div
      ref="container"
      class="portal-detail-map"
      :class="height === '100%' ? 'relative min-h-0 flex-1' : 'relative'"
      :style="{
        '--map-height': height,

      }"
    >
      <button
        v-if="clickToZoom && wheelZoomPosition && !wheelZoomActive"
        type="button"
        class="specimen-map-zoom-instruction -mt-5 -translate-y-full!"
        :style="{
          left: `${wheelZoomPosition.x}px`,
          top: `${wheelZoomPosition.y}px`,
        }"
        @click.stop="activateWheelZoom(map)"
      >
        {{ wheelZoomInstruction }}
      </button>
    </div>
    <MapLinks
      v-if="showLinks"
      :latitude="currentCenter.lat"
      :longitude="currentCenter.lng"
    />
  </div>
</template>
