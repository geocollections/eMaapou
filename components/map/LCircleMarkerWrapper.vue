<script setup lang="ts">
import type * as Leaflet from "leaflet";
import { LCircleMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { useTheme } from "vuetify/lib/framework.mjs";
import type { MapMarker } from "~/types/map";

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
let L: typeof Leaflet;
if (process.client)
  L = await import("leaflet");

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
function handleClick(event: Leaflet.LeafletMouseEvent, marker: MapMarker) {
  L.DomEvent.stopPropagation(event);
  if (marker.id && marker.routeName) {
    router.push(
      localePath({
        name: `${marker.routeName}-id`,
        params: { id: marker.id.toString() },
      }),
    );
  }
}
</script>

<template>
  <div>
    <LCircleMarker
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
      <LTooltip v-if="marker.text" :options="tooltipOptions">
        {{ marker.text }}
      </LTooltip>
    </LCircleMarker>
  </div>
</template>
