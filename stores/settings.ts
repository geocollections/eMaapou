import { Renderer } from "~/types/enums";

export const useSettings = defineStore("settings", () => {
  const cookieConsent = ref(false);
  const showCookieConsent = ref(true);
  const showSearchViewMap = ref(false);
  const showSearchViewForm = ref(true);
  const showInstitutionFilters = ref(false);
  const showExtraOptions = ref(false);

  const mapBaseLayer = ref("CartoDB");

  const isBaseLayerEstonian = computed(() => {
    return (
      mapBaseLayer.value === "Estonian satellite" ||
      mapBaseLayer.value === "Estonian map"
    );
  });

  // Chart options
  const renderer = ref<Renderer>(Renderer.Canvas);
  const connected = ref(true);
  const ppi = ref(96);

  return {
    cookieConsent,
    showSearchViewMap,
    showSearchViewForm,
    showInstitutionFilters,
    showExtraOptions,
    mapBaseLayer,
    isBaseLayerEstonian,
    renderer,
    connected,
    ppi,
  };
});
