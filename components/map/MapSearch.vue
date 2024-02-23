<script setup lang="ts">
import debounce from "lodash/debounce";
import intersection from "lodash/intersection";
import {
  LControlLayers,
  LControlScale,
  LLayerGroup,
  LMap,
  LMarker,
  LPopup,
  LTileLayer,
  LTooltip,
  LWmsTileLayer,
} from "@vue-leaflet/vue-leaflet";
import type Leaflet from "leaflet";
import type { MapMarker, MapState } from "~/types/map";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet.fullscreen/Control.FullScreen.css";

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
    type: Array as PropType<MapMarker[]>, // TODO:  this is not working
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
  value: {
    type: Object as PropType<any>,
    default: () => null,
  },
});
const emit = defineEmits(["update", "input"]);
let L: typeof Leaflet;
if (process.client) {
  L = await import("leaflet");
  import("@geoman-io/leaflet-geoman-free");
  import("leaflet-gesture-handling");
  import("leaflet.fullscreen");
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

interface State extends MapState {
  activeGeomanLayer: L.GeoJSON | L.Circle | null;
  nearMeRadius: number;
  gpsLocation: any;
}

const { t } = useI18n();

const gpsID = ref<number | null>(null);
const map = ref<typeof LMap>();
const mapClickResponse = ref(null as any);
const activeGeomanLayer = ref<any>();
const gpsLocation = ref<any>(null);
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
// const state: State = reactive({
//   gpsID: null as null | number,
//   map: undefined,
//   mapClickResponse: null as any,
//   activeGeomanLayer: null,
//   gpsLocation: null as any,
//   activeOverlays: [] as string[],
//   currentCenter: {
//     lat: props.center.latitude,
//     lng: props.center.longitude,
//   },
//   options: {
//     fullscreenControl: true,
//     gestureHandling: props.gestureHandling,
//     gestureHandlingOptions: {
//       text: {
//         touch: t("gestureHandling.touch"),
//         scroll: t("gestureHandling.scroll"),
//         scrollMac: t("gestureHandling.scrollMac"),
//       },
//       duration: 1000,
//     },
//   },
//   nearMeRadius: 5,
// });
const popup = ref<typeof LPopup>();
const layerControl = ref<typeof LControlLayers>();
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
const dataOverlays = useDataOverlays({
  localityOverlay: props.localityOverlay,
  boreholeOverlay: props.boreholeOverlay,
  siteOverlay: props.siteOverlay,
  sampleOverlay: props.sampleOverlay,
  summaryOverlay: props.summaryOverlay,
});
watch(
  activeOverlays,
  (newVal) => {
    if (!checkableLayers.value)
      return;

    if (document.getElementById("map")) {
      if (Object.keys(checkableLayers.value).some(el => newVal.includes(el)))
        document.getElementById("map")?.classList.add("cursor-crosshair");
      else document.getElementById("map")?.classList.remove("cursor-crosshair");
    }
  },
  { deep: true },
);
watch(
  () => props.value,
  (value) => {
    if (value === null) {
      activeGeomanLayer.value?.remove();
      activeGeomanLayer.value = null;
    }
  },
  { immediate: true },
);
watch(
  () => props.markers,
  () => {
    fitBounds();
  },
);
watch(
  () => props.invalidateSize,
  (newVal) => {
    if (newVal) {
      map.value?.invalidateSize();

      // HACK: This fixes initial bounds problem in search view (markers out of bounds)
      fitBounds();
    }
  },
);

const handleNearMeSliderChange = debounce((val: number) => {
  if (activeGeomanLayer.value)
    map.value?.removeLayer(activeGeomanLayer.value);

  const circle = L.circle(gpsLocation.value, { radius: val * 1000 }).addTo(
    map.value,
  );
  // circle.addTo(this.allGeomanLayers)
  activeGeomanLayer.value = circle;

  const json = activeGeomanLayer.value?.toGeoJSON();
  if (activeGeomanLayer.value instanceof L.Circle) {
    // @ts-expect-error
    json.properties.radius = activeGeomanLayer.value.getRadius();
  }
  emit("input", json);
}, 200);
const handlePmCreate: Leaflet.PM.CreateEventHandler = ({ layer }) => {
  if (activeGeomanLayer.value)
    map.value?.removeLayer(activeGeomanLayer.value);

  activeGeomanLayer.value = layer as State["activeGeomanLayer"];
  const json = activeGeomanLayer.value?.toGeoJSON();
  // Adding radius if Circle
  if (activeGeomanLayer.value instanceof L.Circle) {
    // @ts-expect-error
    json.properties.radius = activeGeomanLayer.value.getRadius();
  }
  emit("input", json);
};
const handlePmRemove: Leaflet.PM.RemoveEventHandler = () => {
  activeGeomanLayer.value?.remove();
  activeGeomanLayer.value = null;

  emit("input", null);
};
const handlePmGlobalDrawModeToggled: Leaflet.PM.GlobalDrawModeToggledEventHandler
  = (event) => {
    if (event.enabled)
      map.value?.off("click", handleMapClick);
    else map.value?.on("click", handleMapClick);
  };
const handlePmGlobalRemovalModeToggled: Leaflet.PM.GlobalRemovalModeToggledEventHandler
  = (event) => {
    if (event.enabled)
      map.value?.off("click", handleMapClick);
    else map.value?.on("click", handleMapClick);
  };
function initLeafletGeoman() {
  map.value?.pm.addControls({
    position: "topleft",
    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: false,
    editMode: false,
    dragMode: false,
    cutPolygon: false,
    rotateMode: false,
    drawText: false,
  });

  map.value?.pm.setGlobalOptions({
    allowSelfIntersection: false,
    finishOn: "dblclick",
    snappable: false,
  });

  map.value?.on("pm:globaldrawmodetoggled", handlePmGlobalDrawModeToggled);
  map.value?.on(
    "pm:globalremovalmodetoggled",
    handlePmGlobalRemovalModeToggled,
  );
  map.value?.on("pm:create", handlePmCreate);
  map.value?.on("pm:remove", handlePmRemove);
  map.value?.on("locationfound", successGeo);
}
const successGeo: Leaflet.LocationEventHandlerFn = (event) => {
  gpsLocation.value = event.latlng;
};
function handleReady() {
  ready();
  initLeafletGeoman();
  map.value?.on("click", handleMapClick);
  if (props.gpsEnabled)
    map.value?.locate({ watch: true, enableHighAccuracy: true });
  if (props.value) {
    activeGeomanLayer.value = L.geoJSON(props.value, {
      pointToLayer(feature, latlng) {
        return L.circle(latlng, feature.properties.radius);
      },
    });
    map.value?.addLayer(activeGeomanLayer.value);
  }
  if (isMapClickEnabled) {
    map.value?.on("click", handleMapClick);
    document.getElementById("map")?.classList.add("cursor-crosshair");
  }
  fitBounds();
}
const mapZoom = computed(() => {
  return props.zoom ?? (props.estonianBedrockOverlay ? 9 : 11);
});
const markersAsFitBoundsObject = computed((): Leaflet.LatLngBoundsLiteral => {
  return props.markers.map((m: MapMarker) => [m.latitude, m.longitude]);
});
function fitBounds() {
  nextTick(() => {
    const geoJSON = props.value;
    if (geoJSON) {
      map.value?.fitBounds(
        (activeGeomanLayer.value as Leaflet.FeatureGroup).getBounds(),
        {
          padding: [50, 50],
          maxZoom: geoJSON.type === "Point" ? mapZoom.value : undefined,
        },
      );
    }
    else if (markersAsFitBoundsObject.value.length > 0) {
      map.value?.fitBounds(markersAsFitBoundsObject.value, {
        padding: [50, 50],
        maxZoom: mapZoom.value,
      });
    }
  });
}
const checkableLayers = computed((): { [K: string]: Leaflet.Layer } => {
  const layerNames = dataOverlays.map((overlay: any) => overlay.name);

  // @ts-expect-error
  return layerControl.value?.leafletObject._layers.reduce(
    (layers: any, item: any) => {
      if (layerNames.includes(item.name))
        layers[item.name] = item.layer;

      return layers;
    },
    {},
  );
});
const isMapClickEnabled = computed(() => {
  const layerNames = dataOverlays.map((overlay: any) => overlay.name);
  return intersection(layerNames, activeOverlays.value).length > 0;
});
function terminateLeafletGeoman() {
  map.value?.off("pm:create", handlePmCreate);
  map.value?.off("pm:remove", handlePmRemove);
}
const queryLayers = computed(() => {
  const queryLayers = [];
  if (activeOverlays.value.includes("Uuringupunktid / Sites"))
    queryLayers.push("sarv:site_summary");

  if (activeOverlays.value.includes("Puursüdamikud / Drillcores"))
    queryLayers.push("sarv:locality_drillcores");

  if (activeOverlays.value.includes("Lokaliteedid / Localities"))
    queryLayers.push("sarv:locality_summary1");

  if (activeOverlays.value.includes("Proovid / Samples"))
    queryLayers.push("sarv:sample_summary");

  if (activeOverlays.value.includes("Üldine / Summary"))
    queryLayers.push("sarv:locality_summary_front");

  return queryLayers.join(",");
});
async function handleMapClick(event: Leaflet.LeafletMouseEvent) {
  if (!map.value)
    return;
  if (!isMapClickEnabled.value)
    return;
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
  }
  else { mapClickResponse.value = null; }
}
onUnmounted(() => {
  if (gpsID.value)
    navigator.geolocation.clearWatch(gpsID.value);
  if (props.activateSearch)
    terminateLeafletGeoman();
});

const tileOverlays = computed(() => {
  return [...estonianOverlays, ...dataOverlays].filter(
    (overlay: any) => !overlay.isWMS,
  );
});
const wmsOverlays = computed(() => {
  return [...estonianOverlays, ...dataOverlays].filter(
    (overlay: any) => overlay.isWMS,
  );
});
const latLngMarkers = computed(() => {
  return props.markers.map((m: MapMarker) => {
    return [m.latitude, m.longitude];
  });
});
</script>

<template>
  <div>
    <client-only>
      <LMap
        id="map"
        ref="map"
        :class="{
          rounded,
        }"
        :style="{
          height,
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
        <LControlLayers ref="layerControl" />
        <LControlScale
          position="bottomleft"
          :metric="true"
          :imperial="false"
        />
        <LTileLayer
          v-for="layer in baseLayers"
          :key="layer.id"
          layer-type="base"
          :visible="layer.visible"
          :name="layer.name"
          :url="layer.url"
          :options="layer.options"
        />
        <LTileLayer
          v-for="layer in tileOverlays"
          :key="layer.id"
          layer-type="overlay"
          :visible="layer.visible"
          :name="layer.name"
          :url="layer.url"
          :options="layer.options"
        />
        <LWmsTileLayer
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
        <l-circle-marker-wrapper
          v-else
          :markers="markers"
          :max-permanent="0"
        />
        <LMarker
          v-if="gpsEnabled && gpsLocation"
          :lat-lng="gpsLocation"
          @click="handleNearMeSliderChange(nearMeRadius)"
        >
          <LTooltip :options="{ direction: 'top', offset: [-15, -15] }">
            <b>GPS</b> ({{ $t("map.clickToSearchNearMe") }})
          </LTooltip>
          <LPopup>
            <div class="d-flex flex-row">
              <div class="align-self-center text-no-wrap">
                1 km
              </div>
              <v-slider
                v-model="nearMeRadius"
                style="width: 150px"
                :min="1"
                :max="20"
                hide-details
                thumb-label="always"
                color="header"
                @update:model-value="handleNearMeSliderChange"
              />
              <div class="align-self-center text-no-wrap">
                20 km
              </div>
            </div>
          </LPopup>
        </LMarker>

        <LLayerGroup ref="popup">
          <map-click-popup :response="mapClickResponse" />
        </LLayerGroup>
      </LMap>
      <template #placeholder>
        <div
          :style="`height: ${height}; width: 100%`"
          class="d-flex align-center justify-center rounded bg-secondary"
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
  font-family: "Open Sans", sans-serif;

  :deep(.leaflet-control-layers-toggle) {
    width: 30px;
    height: 30px;
    background-size: 20px;
  }
}
</style>
