import type { Map } from "leaflet";

export function useMapWheelZoom() {
  const options = { scrollWheelZoom: false, zoomSnap: 0.1 };
  const active = ref(false);
  const { t } = useI18n();
  const instruction = computed(() => t("portal.map.activateWheelZoom"));

  function activate(map: Map | undefined) {
    if (!map)
      return;

    map.scrollWheelZoom.enable();
    active.value = true;
  }

  return {
    options,
    active,
    instruction,
    activate,
  };
}
