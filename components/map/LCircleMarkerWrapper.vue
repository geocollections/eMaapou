<template>
  <div>
    <l-circle-marker
      v-for="(marker, idx) in markers"
      :key="`marker-${idx}-lat-${marker.latitude}-lon-${marker.latitude}`"
      :lat-lng="[marker.latitude, marker.longitude]"
      :radius="6"
      :weight="1.5"
      color="#fff"
      :fill-color="theme.current.value.colors.warning"
      :fill-opacity="1"
      @click="handleClick($event, marker)"
    >
      <l-tooltip v-if="marker.text" :options="tooltipOptions">
        {{ marker.text }}
      </l-tooltip>
    </l-circle-marker>
  </div>
</template>

<script setup lang="ts">
import type * as Leaflet from "leaflet";
import type { MapMarker } from "~/types/map";
import { LCircleMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { useTheme } from "vuetify/lib/framework.mjs";
let L: typeof Leaflet;
if (process.client) {
  L = await import("leaflet");
}

const props = defineProps({
  markers: {
    type: Array as PropType<MapMarker[]>,
    required: false,
    default: () => [],
  },
  maxPermanent: {
    type: Number,
    default: 5,
  },
});
const theme = useTheme();
const localePath = useLocalePath();
const router = useRouter();
const tooltipOptions = computed(() => {
  return {
    permanent: props.markers.length <= props.maxPermanent,
    direction: "top",
    offset: [1, -7],
  };
});
const handleClick = (event: Leaflet.LeafletMouseEvent, marker: MapMarker) => {
  L.DomEvent.stopPropagation(event);
  if (marker.id && marker.routeName) {
    router.push(
      localePath({
        name: `${marker.routeName}-id`,
        params: { id: marker.id.toString() },
      })
    );
  }
};
</script>
