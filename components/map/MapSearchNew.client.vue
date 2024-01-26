<template>
  <div id="map" style="height: 300px"></div>
</template>

<script setup lang="ts">
import intersection from "lodash/intersection";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";
const emit = defineEmits(["update:model-value"]);
const props = defineProps({
  modelValue: {
    type: Object as PropType<any | null>,
    default: null,
  },
});

const map = ref<L.Map | null>(null);
const mapClickResponse = ref(null as any);
const activeOverlays = ref([] as string[]);
const activeGeomanLayer = ref<L.Polygon | L.Circle>();
const gpsLocation = ref<L.LatLng>();
const dataOverlays = useDataOverlays({
  localityOverlay: true,
  boreholeOverlay: true,
  siteOverlay: true,
  sampleOverlay: true,
  summaryOverlay: true,
  // TODO: toggle ovrlays through props
  // localityOverlay: props.localityOverlay,
  // boreholeOverlay: props.boreholeOverlay,
  // siteOverlay: props.siteOverlay,
  // sampleOverlay: props.sampleOverlay,
  // summaryOverlay: props.summaryOverlay,
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

onMounted(() => {
  nextTick(() => {
    loadMap();
    initLeafletGeoman();
    map.value?.invalidateSize();

    if (props.modelValue) {
      activeGeomanLayer.value = L.geoJSON(props.modelValue, {
        pointToLayer: function (feature, latlng) {
          return L.circle(latlng, feature.properties.radius);
        },
      });
      if (map.value) {
        activeGeomanLayer.value?.addTo(map.value);
      }
    }
  });
});
function loadMap() {
  if (map.value) return;
  map.value = L.map("map", {
    center: [58.5, 25.5],
    zoom: 7,
    gestureHandling: true,
    fullscreenControl: true,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
  }).addTo(map.value);
}
function handlePmCreate(
  ...[{ layer }]: Parameters<L.PM.CreateEventHandler>
): ReturnType<L.PM.CreateEventHandler> {
  if (activeGeomanLayer.value) {
    map.value?.removeLayer(activeGeomanLayer.value);
  }
  activeGeomanLayer.value = layer as L.Polygon | L.Circle;

  if (activeGeomanLayer.value instanceof L.Polygon) {
    emit("update:model-value", activeGeomanLayer.value.toGeoJSON());
  } else if (activeGeomanLayer.value instanceof L.Circle) {
    emit(
      "update:model-value",
      L.PM.Utils.circleToPolygon(activeGeomanLayer.value).toGeoJSON()
    );
  }
}
function handlePmRemove(
  ..._args: Parameters<L.PM.RemoveEventHandler>
): ReturnType<L.PM.RemoveEventHandler> {
  activeGeomanLayer.value?.remove();
  activeGeomanLayer.value = undefined;

  emit("update:model-value", null);
}
//
function handlePmGlobalDrawModeToggled(
  ...[event]: Parameters<L.PM.GlobalDrawModeToggledEventHandler>
): ReturnType<L.PM.GlobalDrawModeToggledEventHandler> {
  // if (event.enabled) map.value?.off("click", handleMapClick);
  // else map.value?.on("click", handleMapClick);
}

// function handlePmGlobalRemovalModeToggled(event) {
//     if (event.enabled) map.value?.off("click", handleMapClick);
//     else map.value?.on("click", handleMapClick);
//   } as Leaflet.PM.GlobalRemovalModeToggledEventHandler;
function initLeafletGeoman() {
  map.value?.pm.addControls({
    position: "topleft",
    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: false,
    drawCircle: false,
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

  // map.value?.on("pm:globaldrawmodetoggled", handlePmGlobalDrawModeToggled);
  // map.value?.on(
  //   "pm:globalremovalmodetoggled",
  //   handlePmGlobalRemovalModeToggled
  // );
  map.value?.on("pm:create", handlePmCreate);
  map.value?.on("pm:remove", handlePmRemove);
  map.value?.on("locationfound", successGeo);
}
function successGeo(...[event]: Parameters<L.LocationEventHandlerFn>) {
  gpsLocation.value = event.latlng;
}
const isMapClickEnabled = computed(() => {
  const layerNames = dataOverlays.map((overlay: any) => overlay.name);
  return intersection(layerNames, activeOverlays.value).length > 0;
});
// const handleMapClick = async (event: L.LeafletMouseEvent) => {
//   if (!map.value) return;
//   if (!isMapClickEnabled.value) return;
//   const MAX_ZOOM = 21;
//   const radius = (MAX_ZOOM + 0.25 - map.value.getZoom()) * 1000;
//   const circle = L.circle(event.latlng, { radius });
//   map.value.addLayer(circle);
//   const bbox = circle.getBounds().toBBoxString();
//   circle.remove();
//
//   const { data: wmsResponse } = await useGeoserverFetch("/wms", {
//     query: {
//       QUERY_LAYERS: queryLayers.value,
//       LAYERS:
//         "sarv:locality_summary1,sarv:locality_drillcores,sarv:site_summary,sarv:sample_summary,sarv:locality_summary_front",
//       BBOX: bbox,
//     },
//   });
//
//   if (wmsResponse?.features?.length > 0) {
//     mapClickResponse.value = {
//       latlng: event.latlng,
//       features: wmsResponse.features,
//     };
//     L.popup()
//       .setLatLng(event.latlng)
//       .setContent("Loading...")
//       .openOn(map.value);
//   } else mapClickResponse.value = null;
// };
</script>
