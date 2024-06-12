<script setup lang="ts">
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";

const props = defineProps<{ modelValue: Nullable<any> }>();
const emit = defineEmits(["update:model-value"]);
const map = ref<L.Map>();
const activeGeomanLayer = ref<L.Polygon | L.Circle>();
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
      // @ts-expect-error - this should not be needed
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
    // @ts-expect-error - gestureHandleing does not have types
    gestureHandling: true,
    fullscreenControl: true,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
  })
    .addTo(map.value);

  // @ts-expect-error - nearMe does not have types
  L.Control.NearMe = L.Control.extend({
    onAdd(map: any) {
      const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

      // container.innerHTML = "<a href=\"#\" title=\"Show me\" id=\"near-me\" style=\"font-size: 1.5em; color: #333\"><div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\"><path d=\"M21,3L3,10.53V11.5L9.84,14.16L12.5,21H13.46L21,3Z\" /></svg></div></a>";
      container.innerHTML = "<a href=\"#\" title=\"Near Me\" id=\"near-me\" style=\"font-size: 1.5em; color: #333\" class=\"icon-near-me\"></a>";
      container.onclick = function () {
        if (nearMe.value) {
          nearMe.value = false;
          activeGeomanLayer.value?.remove();
          activeGeomanLayer.value = undefined;
          emit("update:model-value", null);
          return;
        }
        map.locate({ setView: true });
      };
      return container;
    },
    onRemove(_map: any) {
      // Nothing to do here
    },

  });

  // @ts-expect-error - nearMe does not have types
  L.control.nearMe = function (opts) {
  // @ts-expect-error - nearMe does not have types
    return new L.Control.NearMe(opts);
  };
  // @ts-expect-error - nearMe does not have types
  L.control.nearMe({ position: "topleft" }).addTo(map.value);
}

function handlePmCreate(
  ...[{ layer }]: Parameters<L.PM.CreateEventHandler>
): ReturnType<L.PM.CreateEventHandler> {
  if (activeGeomanLayer.value)
    map.value?.removeLayer(activeGeomanLayer.value);

  activeGeomanLayer.value = layer as L.Polygon | L.Circle;

  if (layer instanceof L.Polygon) {
    emit("update:model-value", layer.toGeoJSON());
  }
  else if (layer instanceof L.Circle) {
    emit(
      "update:model-value",
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
  emit("update:model-value", null);
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
    "update:model-value",
    circlePolygon.toGeoJSON(),
  );

  map.value?.fitBounds(circlePolygon.getBounds(), { padding: [10, 10] });
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
