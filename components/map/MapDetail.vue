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
          :url="layer.url"
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
            color: theme.current.value.colors.accent,
            fillColor: theme.current.value.colors.accent,
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

<script setup lang="ts">
import {
  LControlLayers,
  LMap,
  LPopup,
  LWmsTileLayer,
  LTileLayer,
  LGeoJson,
  LControlScale,
  LLayerGroup,
} from "@vue-leaflet/vue-leaflet";
import type { GeoJsonObject } from "geojson";
import intersection from "lodash/intersection";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import type Leaflet from "leaflet";
import type { MapMarker } from "~/types/map";
import { useTheme } from "vuetify/lib/framework.mjs";

let VueLeaflet: any = {};
let L: typeof Leaflet;
if (process.client) {
  // VueLeaflet = await import("vue2-leaflet");
  L = await import("leaflet");
  import("leaflet-gesture-handling");
  import("leaflet.fullscreen");
  import("@geoman-io/leaflet-geoman-free");
  type D = L.Icon.Default & {
    _getIconUrl?: string;
  };
  delete (L.Icon.Default.prototype as D)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: await import("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: await import("leaflet/dist/images/marker-icon.png"),
    shadowUrl: await import("leaflet/dist/images/marker-shadow.png"),
  });
}
const props = defineProps({
  zoom: {
    type: Number,
    default: null,
  },
  height: {
    type: String,
    default: "500px",
  },
  center: {
    type: Object,
    default: () => {
      return {
        latitude: 58.5,
        longitude: 25.5,
      };
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
});

const theme = useTheme();
const { t } = useI18n();
const mapClickResponse = ref(null as any);
const activeOverlays = ref([] as string[]);
const currentCenter = ref({
  lat: props.center.latitude,
  lng: props.center.longitude,
});

const options = ref({
  fullscreenControl: true,
  gestureHandling: props.gestureHandling,
  gestureHandlingOptions: {
    text: {
      touch: t("gestureHandling.touch"),
      scroll: t("gestureHandling.scroll"),
      scrollMac: t("gestureHandling.scrollMac"),
    },
    duration: 1000,
  },
});

const nearMeRadius = ref(5);

const popup = ref<typeof LPopup>();
const layerControl = ref<typeof LControlLayers>();
const map = ref<typeof LMap>();
const {
  ready,
  updateCenter,
  handleBaseLayerChange,
  handleOverlayAdd,
  handleOverlayRemove,
  baseLayers,
  estonianOverlays,
} = useLeafletMap({
  map,
  props,
  state: { map, options, currentCenter, activeOverlays, mapClickResponse },
});

const dataOverlays = useDataOverlays();
const handleReady = () => {
  ready();
  if (isMapClickEnabled) {
    map.value?.on("click", handleMapClick);
    document.getElementById("map")?.classList.add("cursor-crosshair");
  }
  fitBounds();
};
const mapZoom = computed(() => {
  return props.zoom ?? (props.estonianBedrockOverlay ? 9 : 11);
});
const markersAsFitBoundsObject = computed((): Leaflet.LatLngBoundsLiteral => {
  return props.markers.map((m: MapMarker) => [m.latitude, m.longitude]);
});
const fitBounds = () => {
  nextTick(() => {
    if (props.geojson) {
      map.value?.fitBounds(L.geoJSON(props.geojson).getBounds(), {
        padding: [50, 50],
      });
    } else if (markersAsFitBoundsObject.value.length > 0) {
      map.value?.fitBounds(markersAsFitBoundsObject.value, {
        padding: [50, 50],
        maxZoom: mapZoom.value,
      });
    }
  });
};
const tileOverlays = computed(() => {
  return [...estonianOverlays, ...dataOverlays].filter(
    (overlay) => !overlay.isWMS
  );
});
const wmsOverlays = computed(() => {
  return [...estonianOverlays, ...dataOverlays].filter(
    (overlay: any) => overlay.isWMS
  );
});
const latLngMarkers = computed(() => {
  return props.markers.map((m: MapMarker) => {
    return [m.latitude, m.longitude];
  });
});
const isMapClickEnabled = computed(() => {
  const layerNames = dataOverlays.map((overlay: any) => overlay.name);
  return intersection(layerNames, activeOverlays.value).length > 0;
});
const queryLayers = computed(() => {
  const queryLayers = [];
  if (activeOverlays.value.includes("Uuringupunktid / Sites")) {
    queryLayers.push("sarv:site_summary");
  }
  if (activeOverlays.value.includes("Puursüdamikud / Drillcores")) {
    queryLayers.push("sarv:locality_drillcores");
  }
  if (activeOverlays.value.includes("Lokaliteedid / Localities")) {
    queryLayers.push("sarv:locality_summary1");
  }
  if (activeOverlays.value.includes("Proovid / Samples")) {
    queryLayers.push("sarv:sample_summary");
  }
  if (activeOverlays.value.includes("Üldine / Summary")) {
    queryLayers.push("sarv:locality_summary_front");
  }
  return queryLayers.join(",");
});
const handleMapClick = async (event: Leaflet.LeafletMouseEvent) => {
  if (!map.value) return;
  if (!isMapClickEnabled.value) return;
  const MAX_ZOOM = 21;
  const radius = (MAX_ZOOM + 0.25 - map.value.getZoom()) * 1000;
  const circle = L.circle(event.latlng, { radius });
  map.value.addLayer(circle);
  const bbox = circle.getBounds().toBBoxString();
  circle.remove();

  const { data: wmsResponse } = await useGeoserverFetch("/wms", {
    query: {
      QUERY_LAYERS: queryLayers.value,
      LAYERS:
        "sarv:locality_summary1,sarv:locality_drillcores,sarv:site_summary,sarv:sample_summary,sarv:locality_summary_front",
      BBOX: bbox,
    },
  });

  if (wmsResponse?.features?.length > 0) {
    mapClickResponse.value = {
      latlng: event.latlng,
      features: wmsResponse.features,
    };
    popup.value?.mapObject.openPopup(event.latlng);
  } else mapClickResponse.value = null;
};

const checkableLayers = computed((): { [K: string]: Leaflet.Layer } => {
  const layerNames = dataOverlays.map((overlay: any) => overlay.name);
  // @ts-ignore
  return layerControl.value?.leafletObject._layers.reduce(
    (layers: any, item: any) => {
      if (layerNames.includes(item.name)) {
        layers[item.name] = item.layer;
      }
      return layers;
    },
    {}
  );
});
watch(
  () => activeOverlays.value,
  (newVal) => {
    if (!checkableLayers.value) return;
    if (document.getElementById("map")) {
      if (Object.keys(checkableLayers.value).some((el) => newVal.includes(el)))
        document.getElementById("map")?.classList.add("cursor-crosshair");
      else document.getElementById("map")?.classList.remove("cursor-crosshair");
    }
  },
  { deep: true }
);
</script>

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
