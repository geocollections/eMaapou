export const useDrillcoreBoxPosition = defineStore(
  "drillcoreBoxPosition",
  () => {
    const page = ref(1);

    function $reset() {
      page.value = 0;
    }

    return {
      page,
      $reset,
    };
  },
  {
    persist: {
      pick: ["page"],
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
  },
);
