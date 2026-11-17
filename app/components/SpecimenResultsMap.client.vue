<script setup lang="ts">
import type { MapLocation } from "~/types/map";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/dist/Control.FullScreen.css";

const props = defineProps<{ locations: MapLocation[]; query: string; filters: (string | Record<string, string>)[]; label: string; loading?: boolean; error?: boolean; geometry?: any | null }>();
const emit = defineEmits<{ "update:geometry": [geometry: any | null]; "retry": [] }>();
const { locale } = useI18n();
let map: L.Map | undefined;
const container = ref<HTMLElement>();
const expanded = ref(false);
const mapHeight = ref(260);
useResizeObserver(container, ([entry]) => {
  if (entry)
    mapHeight.value = entry.contentRect.height;
  map?.invalidateSize();
});
const colors = usePortalColors();
const draftGeometry = ref<any | null>(null);
const locationMessage = ref("");
const locating = ref(false);
let areaLayer: L.Layer | undefined;
const controls = computed(() => locale.value === "et"
  ? {
      records: "Kirjeid",
      locations: "asukohta",
      retry: "Proovi uuesti",
      failed: "Kirjete laadimine ebaõnnestus.",
      mapFailed: "Asukohtade laadimine ebaõnnestus.",
      expand: "Suurenda kaarti",
      collapse: "Vähenda kaarti",
      rectangle: "Vali ristkülik",
      polygon: "Joonista ala",
      near: "Minust 5 km raadiuses",
      apply: "Rakenda ala",
      clear: "Eemalda ala",
      instruction: "Joonista kaardile ala ja vajuta „Rakenda ala“. Kaardi liigutamine otsingut ei muuda.",
      denied: "Asukohta ei saanud määrata. Vali ala kaardil käsitsi.",
    }
  : {
      records: "Records",
      locations: "locations",
      retry: "Try again",
      failed: "Could not load records.",
      mapFailed: "Could not load locations.",
      expand: "Expand map",
      collapse: "Collapse map",
      rectangle: "Select rectangle",
      polygon: "Draw area",
      near: "Within 5 km of me",
      apply: "Apply area",
      clear: "Clear area",
      instruction: "Draw an area, then choose Apply area. Moving the map does not change the search.",
      denied: "Could not determine your location. Select an area on the map instead.",
    });
function drawArea(shape: "Rectangle" | "Polygon") {
  map?.pm.disableDraw();
  map?.pm.enableDraw(shape, {
    snappable: false,
    allowSelfIntersection: false,
    pathOptions: { color: colors.primary, fillOpacity: 0.1 },
  });
}
function replaceArea(geometry: any | null) {
  if (!map)
    return;
  if (areaLayer)
    map.removeLayer(areaLayer);
  areaLayer = geometry
    ? L.geoJSON(geometry, {
        style: { color: colors.primary, weight: 2, fillOpacity: 0.1 },
        pmIgnore: true,
      })
    : undefined;
  areaLayer?.addTo(map);
  draftGeometry.value = geometry;
}
function clearArea() {
  map?.pm.disableDraw();
  replaceArea(null);
  emit("update:geometry", null);
}
function nearMe() {
  locationMessage.value = "";
  if (!navigator.geolocation) {
    locationMessage.value = controls.value.denied;
    return;
  }
  locating.value = true;
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    locating.value = false;
    if (!map)
      return;
    const area = L.PM.Utils.circleToPolygon(L.circle([coords.latitude, coords.longitude], { radius: 5000 }), 60);
    replaceArea(area.toGeoJSON());
    map.fitBounds(area.getBounds());
  }, () => {
    locating.value = false;
    locationMessage.value = controls.value.denied;
  }, { timeout: 10000 });
}

const localePath = useLocalePath();
const tileError = ref(false);
const selectedLocation = shallowRef<MapLocation>();
const popupTarget = shallowRef<HTMLElement>();
const pointPage = ref(1);
let markers: L.LayerGroup | undefined;
let locationPopup: L.Popup | undefined;
const { data: pointData, status: pointStatus, refresh: refreshRecords } = await useSolrFetch<{
  response: { numFound: number; docs: { id: string; specimen_full_name: string; taxon?: string; locality?: string; locality_en?: string }[] };
}>("/specimen", {
  key: `specimen-map-records-${useId()}`,
  query: computed(() => ({
    json: {
      query: props.query,
      filter: [...props.filters, `latitude:${selectedLocation.value?.latitude ?? 0}`, `longitude:${selectedLocation.value?.longitude ?? 0}`],
      limit: 25,
      offset: (pointPage.value - 1) * 25,
      sort: "id_l asc",
      fields: "id,specimen_full_name,taxon,locality,locality_en",
    },
  })),
  immediate: false,
  watch: false,
});
async function openLocation(location: MapLocation) {
  if (!map || !popupTarget.value || !locationPopup)
    return;
  map.closePopup();
  selectedLocation.value = location;
  pointPage.value = 1;
  locationPopup.setLatLng([location.latitude, location.longitude]).setContent(popupTarget.value).openOn(map);
  const loading = refreshRecords();
  await nextTick();
  locationPopup.update();
  await loading;
}
function changePointPage(options: DataTableOptions) {
  pointPage.value = options.page;
  refreshRecords();
}
watch([pointStatus, mapHeight], async () => {
  await nextTick();
  if (selectedLocation.value)
    locationPopup?.update();
});
function renderMarkers() {
  if (!map || !markers)
    return;
  map.closePopup();
  markers.clearLayers();
  const bounds = L.latLngBounds([]);
  for (const location of props.locations) {
    const { latitude, longitude, count } = location;
    const marker = L.circleMarker([latitude, longitude], {
      radius: Math.min(11, 6 + Math.log10(count) * 1.4),
      color: colors.background,
      weight: 1.5,
      fillColor: colors.primary,
      fillOpacity: 0.85,
    });
    marker.bindTooltip(`${controls.value.records}: ${count.toLocaleString(locale.value)}`);
    marker.on("click", () => openLocation(location));
    marker.addTo(markers);
    bounds.extend([latitude, longitude]);
  }
  if (bounds.isValid()) {
    map.fitBounds(bounds, {
      padding: [24, 24],
      maxZoom: 11,
    });
  }
}
onMounted(async () => {
  await nextTick();
  if (!container.value)
    return;
  map = L.map(container.value, {
    center: [58.5, 25.5],
    zoom: 5,
    scrollWheelZoom: false,
    fullscreenControl: true,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>" }).on("tileerror", () => {
    tileError.value = true;
  }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  markers = L.layerGroup().addTo(map);
  popupTarget.value = document.createElement("div");
  locationPopup = L.popup({ maxWidth: 360, className: "specimen-map-popup" });
  map.on("popupclose", () => selectedLocation.value = undefined);
  map.on("pm:create", (event) => {
    const layer = event.layer as L.Polygon;
    const geometry = layer.toGeoJSON();
    map?.removeLayer(layer);
    replaceArea(geometry);
  });
  replaceArea(props.geometry ?? null);
  renderMarkers();
});
watch([
  () => props.locations,
  locale,
], renderMarkers);
watch(() => props.geometry, value => replaceArea(value ?? null), { deep: true });
onBeforeUnmount(() => map?.remove());
</script>

<template>
  <div
    class="specimen-map-wrap"
    :class="{ 'specimen-map-expanded': expanded }"
    :style="{ '--specimen-map-height': `${mapHeight}px` }"
  >
    <div
      class="specimen-map-controls"
      role="group"
      :aria-label="label"
    >
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        class="portal-map-button header-focus"
        @click="drawArea('Rectangle')"
      >
        {{ controls.rectangle }}
      </UButton>
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        class="portal-map-button"
        @click="drawArea('Polygon')"
      >
        {{ controls.polygon }}
      </UButton>
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        class="portal-map-button"
        :disabled="locating"
        @click="nearMe"
      >
        {{ controls.near }}
      </UButton>
      <UButton
        type="button"
        color="primary"
        variant="solid"
        class="portal-map-primary-button header-focus"

        :disabled="!draftGeometry"
        @click="emit('update:geometry', draftGeometry)"
      >
        {{ controls.apply }}
      </UButton>
      <UButton
        v-if="draftGeometry || geometry"
        type="button"
        color="neutral"
        variant="outline"
        class="portal-map-button"
        @click="clearArea"
      >
        {{ controls.clear }}
      </UButton>
      <UBadge
        v-if="!loading"
        color="neutral"
        variant="soft"
      >
        {{ locations.length.toLocaleString(locale) }} {{ controls.locations }}
      </UBadge>
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        class="portal-map-button specimen-map-expand header-focus"
        :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? controls.collapse : controls.expand }}
      </UButton>
      <span class="specimen-map-help">{{ controls.instruction }}</span>
      <span v-if="locationMessage" role="status">{{ locationMessage }}</span>
    </div>
    <div
      ref="container"
      class="specimen-results-map"
      :aria-label="label"
    />
    <p
      v-if="loading || error || !locations.length || tileError"
      class="specimen-map-status"
      role="status"
    >
      {{ loading ? (locale === 'et' ? 'Asukohtade laadimine…' : 'Loading locations…') : error ? controls.mapFailed : tileError ? (locale === 'et' ? 'Aluskaardi laadimine ebaõnnestus.' : 'Could not load the basemap.') : (locale === 'et' ? 'Valitud filtritega koordinaatidega kirjeid ei leitud.' : 'No records with coordinates match your filters.') }}
      <UButton
        v-if="error"
        color="neutral"
        variant="link"
        @click="emit('retry')"
      >
        {{ controls.retry }}
      </UButton>
    </p>
    <Teleport v-if="popupTarget && selectedLocation" :to="popupTarget">
      <section
        class="specimen-map-records"
        :aria-label="controls.records"
        :aria-busy="pointStatus === 'pending'"
      >
        <header class="specimen-map-records__heading">
          <h3>{{ controls.records }}: {{ selectedLocation.count.toLocaleString(locale) }}</h3>
          <p>{{ selectedLocation.latitude.toFixed(6) }}, {{ selectedLocation.longitude.toFixed(6) }}</p>
        </header>
        <div class="specimen-map-records__list">
          <p v-if="pointStatus === 'pending'" role="status">
            {{ locale === 'et' ? 'Laadin kirjeid…' : 'Loading records…' }}
          </p>
          <div v-else-if="pointStatus === 'error'" role="alert">
            <p>{{ controls.failed }}</p>
            <UButton
              color="neutral"
              variant="outline"
              @click="refreshRecords()"
            >
              {{ controls.retry }}
            </UButton>
          </div>
          <ULink
            v-for="item in pointStatus === 'success' ? pointData?.response.docs : []"
            :key="item.id"
            :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
            class="specimen-map-records__item"
          >
            <span>{{ item.specimen_full_name || item.id }}</span>
            <span v-if="item.taxon">{{ item.taxon }}</span>
            <span>{{ locale === 'et' ? item.locality : item.locality_en || item.locality }}</span>
          </ULink>
        </div>
        <PortalPagination
          v-if="selectedLocation.count > 25"
          compact
          :options="{ page: pointPage, itemsPerPage: 25, sortBy: [] }"
          :count="selectedLocation.count"
          :loading="pointStatus === 'pending'"
          @update="changePointPage"
        />
      </section>
    </Teleport>
  </div>
</template>
