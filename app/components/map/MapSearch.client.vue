<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/dist/Control.FullScreen.css";

const props = defineProps<{ modelValue: Nullable<any> }>();
const emit = defineEmits<{
  "update:modelValue": [value: any];
}>();
const { t } = useI18n();
const map = ref<L.Map>();
const activeGeomanLayer = ref<L.GeoJSON | L.Polygon | L.Circle>();
const gpsLocation = ref<L.LatLng>();

const nearMe = ref(false);
const nearMeRadius = ref(5);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null) {
      activeGeomanLayer.value?.remove();
      activeGeomanLayer.value = undefined;
    }
  },
);

onMounted(() => {
  nextTick(() => {
    loadMap();
    initLeafletGeoman();
    map.value?.invalidateSize();

    if (props.modelValue) {
      activeGeomanLayer.value = L.geoJSON(props.modelValue);
      if (map.value)
        activeGeomanLayer.value?.addTo(map.value);
    }
  });
});
function loadMap() {
  if (map.value)
    return;
  map.value = L.map("map", {
    center: [58.5, 25.5],
    zoom: 5,
    ...{ gestureHandling: true },
    fullscreenControl: true,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: t("portal.map.attributionOpenStreetMap", { link: "<a href='https://www.openstreetmap.org/'>OpenStreetMap</a>" }),
  })
    .addTo(map.value);

  const nearMeControl = new L.Control({ position: "topleft" });
  nearMeControl.onAdd = (map) => {
    const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

    const button = L.DomUtil.create("a", "icon-near-me", container);
    button.href = "#";
    button.id = "near-me";
    button.style.fontSize = "1.5em";
    button.style.color = "#333";
    button.title = t("portal.map.nearMe");
    container.onclick = function () {
      if (nearMe.value) {
        nearMe.value = false;
        activeGeomanLayer.value?.remove();
        activeGeomanLayer.value = undefined;
        emit("update:modelValue", null);
        return;
      }
      map.locate({ setView: true });
    };
    return container;
  };
  nearMeControl.addTo(map.value);
}

function handlePmCreate(
  ...[{ layer }]: Parameters<L.PM.CreateEventHandler>
): ReturnType<L.PM.CreateEventHandler> {
  if (activeGeomanLayer.value)
    map.value?.removeLayer(activeGeomanLayer.value);

  activeGeomanLayer.value = layer as L.Polygon | L.Circle;

  if (layer instanceof L.Polygon) {
    emit("update:modelValue", layer.toGeoJSON());
  }
  else if (layer instanceof L.Circle) {
    emit(
      "update:modelValue",
      L.PM.Utils.circleToPolygon(layer).toGeoJSON(),
    );
  }
}

function handlePmRemove(
  ..._args: Parameters<L.PM.RemoveEventHandler>
): ReturnType<L.PM.RemoveEventHandler> {
  removeCurrentLayer();
}

function removeCurrentLayer() {
  if (!activeGeomanLayer.value)
    return;

  activeGeomanLayer.value.remove();
  activeGeomanLayer.value = undefined;
  emit("update:modelValue", null);
}

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

  map.value?.on("pm:create", handlePmCreate);
  map.value?.on("pm:remove", handlePmRemove);
  map.value?.on("locationfound", successGeo);
}
function successGeo(...[event]: Parameters<L.LocationEventHandlerFn>) {
  nearMe.value = true;
  gpsLocation.value = event.latlng;

  removeCurrentLayer();

  const circlePolygon = L.PM.Utils.circleToPolygon(L.circle(gpsLocation.value, { radius: nearMeRadius.value * 1000 }), 60);
  circlePolygon.addTo(map.value!);

  activeGeomanLayer.value = circlePolygon;
  emit(
    "update:modelValue",
    circlePolygon.toGeoJSON(),
  );

  map.value?.fitBounds(circlePolygon.getBounds(), {
    padding: [10, 10],
  });
}
</script>

<template>
  <div id="map" style="height: 300px" />
</template>

<style>
.icon-near-me {
  background-image: url("~/assets/icon-near-me.svg");
}
</style>
