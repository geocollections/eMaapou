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
const fullscreen = ref(false);
const wheelZoomActive = ref(false);
const toolbar = ref<HTMLElement>();
watch(toolbar, (element) => {
  if (!element)
    return;
  L.DomEvent.disableClickPropagation(element);
  L.DomEvent.disableScrollPropagation(element);
});
const mapHeight = ref(340);
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
      activateZoom: "Kaardi hiirerullikuga suumimiseks klõpsa kaardil",
      retry: "Proovi uuesti",
      failed: "Kirjete laadimine ebaõnnestus.",
      mapFailed: "Asukohtade laadimine ebaõnnestus.",
      expand: "Suurenda kaarti",
      collapse: "Vähenda kaarti",
      rectangle: "Vali ristkülik",
      polygon: "Joonista ala",
      near: "Minust 5 km raadiuses",
      zoomIn: "Suumi sisse",
      zoomOut: "Suumi välja",
      fullscreen: "Täisekraan",
      clear: "Eemalda ala",
      instruction: "Joonistatud ala rakendub kohe. Kaardi liigutamine otsingut ei muuda.",
      denied: "Asukohta ei saanud määrata. Vali ala kaardil käsitsi.",
    }
  : {
      records: "Records",
      locations: "locations",
      activateZoom: "Click the map to enable scroll-wheel zoom",
      retry: "Try again",
      failed: "Could not load records.",
      mapFailed: "Could not load locations.",
      expand: "Expand map",
      collapse: "Collapse map",
      rectangle: "Select rectangle",
      polygon: "Draw area",
      near: "Within 5 km of me",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fullscreen: "Fullscreen",
      clear: "Clear area",
      instruction: "Draw an area to filter immediately. Moving the map does not change the search.",
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
    emit("update:geometry", area.toGeoJSON());
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
function locationName(location: MapLocation) {
  return (locale.value === "et"
    ? location.name
    : location.nameEn || location.name) || (locale.value === "et"
    ? "Asukoht"
    : "Location");
}
function markerRadius(count: number) {
  if (count <= 10)
    return 6;
  if (count <= 100)
    return 12;
  return 18;
}
function activateWheelZoom() {
  map?.scrollWheelZoom.enable();
  wheelZoomActive.value = true;
}
function renderMarkers() {
  if (!map || !markers)
    return;
  map.closePopup();
  markers.clearLayers();
  const bounds = L.latLngBounds([]);
  for (const location of props.locations) {
    const { latitude, longitude, count } = location;
    const marker = L.circleMarker([latitude, longitude], {
      radius: markerRadius(count),
      color: colors.background,
      weight: 2,
      fillColor: colors.primary,
      fillOpacity: 0.9,
    });
    const preview = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = locationName(location);
    const total = document.createElement("span");
    total.textContent = `${controls.value.records}: ${count.toLocaleString(locale.value)}`;
    preview.append(title, total);
    marker.bindTooltip(preview, { className: "specimen-map-point-tooltip", direction: "auto", opacity: 1 });
    marker.on("click", () => {
      if (!map?.pm.globalDrawModeEnabled()) {
        marker.closeTooltip();
        openLocation(location);
      }
    });
    marker.addTo(markers);
    bounds.extend([latitude, longitude]);
  }
  if (!props.filters.length && ["*", "*:*"].includes(props.query.trim())) {
    const center = L.latLng(58.5, 20);
    const region = center.toBounds(5000000);
    map.fitBounds([
      [
        center.lat,
        region.getWest(),
      ],
      [
        center.lat,
        region.getEast(),
      ],
    ], {
      padding: [24, 0],
    });
  }
  else if (bounds.isValid() && !props.geometry) {
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
    center: [58.5, 20],
    zoom: 5,
    zoomSnap: 0.1,
    scrollWheelZoom: false,
    fullscreenControl: true,
    zoomControl: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>" }).on("tileerror", () => {
    tileError.value = true;
  }).addTo(map);
  map.fullscreenControl?.getContainer()?.setAttribute("hidden", "");
  map.on("enterFullscreen", () => fullscreen.value = true);
  map.on("exitFullscreen", () => fullscreen.value = false);
  map.on("click", activateWheelZoom);
  L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);
  markers = L.layerGroup().addTo(map);
  popupTarget.value = document.createElement("div");
  locationPopup = L.popup({ maxWidth: 360, className: "specimen-map-popup" });
  map.on("popupclose", () => selectedLocation.value = undefined);
  map.on("pm:create", (event) => {
    const layer = event.layer as L.Polygon;
    const geometry = layer.toGeoJSON();
    map?.removeLayer(layer);
    replaceArea(geometry);
    emit("update:geometry", geometry);
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
      ref="container"
      class="specimen-results-map"
      :aria-label="label"
    />
    <Teleport v-if="container" :to="container">
      <div
        v-show="!selectedLocation"
        ref="toolbar"
        class="specimen-map-controls"
        role="group"
        :aria-label="label"
        :aria-description="controls.instruction"
      >
        <UTooltip
          v-for="action in [{ label: controls.zoomIn, icon: 'i-lucide-plus', run: () => map?.zoomIn() }, { label: controls.zoomOut, icon: 'i-lucide-minus', run: () => map?.zoomOut() }, { label: controls.fullscreen, icon: fullscreen ? 'i-lucide-shrink' : 'i-lucide-expand', run: () => map?.toggleFullscreen() }]"
          :key="action.label"
          :portal="false"
          :text="action.label"
          :content="{ side: 'right' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            :icon="action.icon"
            class="portal-map-icon header-focus"
            :aria-label="action.label"
            @click="action.run"
          />
        </UTooltip>
        <UTooltip
          :portal="false"
          :text="controls.rectangle"
          :content="{ side: 'right' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-square-dashed"
            class="portal-map-icon header-focus"
            :aria-label="controls.rectangle"
            @click="drawArea('Rectangle')"
          />
        </UTooltip>
        <UTooltip
          :portal="false"
          :text="controls.polygon"
          :content="{ side: 'right' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-pentagon"
            class="portal-map-icon header-focus"
            :aria-label="controls.polygon"
            @click="drawArea('Polygon')"
          />
        </UTooltip>
        <UTooltip
          :portal="false"
          :text="controls.near"
          :content="{ side: 'right' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-locate-fixed"
            class="portal-map-icon header-focus"
            :aria-label="controls.near"
            :loading="locating"
            :disabled="locating"
            @click="nearMe"
          />
        </UTooltip>
        <UTooltip
          v-if="draftGeometry || geometry"
          :portal="false"
          :text="controls.clear"
          :content="{ side: 'right' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-trash-2"
            class="portal-map-icon header-focus"
            :aria-label="controls.clear"
            @click="clearArea"
          />
        </UTooltip>
        <UTooltip
          :portal="false"
          :text="expanded ? controls.collapse : controls.expand"
          :content="{ side: 'right' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
            class="portal-map-icon header-focus"
            :aria-label="expanded ? controls.collapse : controls.expand"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
          />
        </UTooltip>
      </div>
      <UBadge
        v-if="!loading && !selectedLocation"
        color="neutral"
        variant="soft"
        class="specimen-map-count"
      >
        {{ locations.length.toLocaleString(locale) }} {{ controls.locations }}
      </UBadge>
      <button
        v-if="!wheelZoomActive && !selectedLocation"
        type="button"
        class="specimen-map-zoom-instruction"
        :aria-label="controls.activateZoom"
        @click.stop="activateWheelZoom"
      >
        {{ controls.activateZoom }}
      </button>
      <p
        v-if="loading || error || !locations.length || tileError || locationMessage"
        class="specimen-map-status"
        role="status"
      >
        {{ loading ? (locale === 'et' ? 'Asukohtade laadimine…' : 'Loading locations…') : error ? controls.mapFailed : tileError ? (locale === 'et' ? 'Aluskaardi laadimine ebaõnnestus.' : 'Could not load the basemap.') : locationMessage || (locale === 'et' ? 'Valitud filtritega koordinaatidega kirjeid ei leitud.' : 'No records with coordinates match your filters.') }}
        <UButton
          v-if="error"
          color="neutral"
          variant="link"
          @click.stop="emit('retry')"
        >
          {{ controls.retry }}
        </UButton>
      </p>
    </Teleport>
    <Teleport v-if="popupTarget && selectedLocation" :to="popupTarget">
      <section
        class="specimen-map-records"
        :aria-label="controls.records"
        :aria-busy="pointStatus === 'pending'"
      >
        <header class="specimen-map-records__heading">
          <h3>{{ locationName(selectedLocation) }}</h3>
          <div class="specimen-map-records__meta">
            <span>{{ controls.records }}: {{ selectedLocation.count.toLocaleString(locale) }}</span>
            <span>{{ selectedLocation.latitude.toFixed(4) }}, {{ selectedLocation.longitude.toFixed(4) }}</span>
          </div>
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
            <div class="specimen-map-records__label">
              <span>{{ item.specimen_full_name || item.id }}</span>
              <span v-if="item.taxon">{{ item.taxon }}</span>
            </div>
            <UIcon name="i-lucide-arrow-right" class="specimen-map-records__arrow" />
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
