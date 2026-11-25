import type { Map } from "leaflet";

export function useMapWheelZoom() {
  const options = { scrollWheelZoom: false, zoomSnap: 0.1 };
  const active = ref(false);
  const { locale } = useI18n();
  const instruction = computed(() => locale.value === "et"
    ? "Kaardi hiirerullikuga suumimiseks klõpsa kaardil"
    : "Click the map to enable scroll-wheel zoom");

  function activate(map: Map | undefined) {
    if (!map)
      return;

    map.scrollWheelZoom.enable();
    active.value = true;
  }

  return { options, active, instruction, activate };
}
