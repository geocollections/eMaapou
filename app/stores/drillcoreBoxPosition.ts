export const useDrillcoreBoxPosition = defineStore(
  "drillcoreBoxPosition",
  () => {
    const page = ref(1);

    function $reset() {
      page.value = 0;
    }

    // function setPosition(
    //   newPosition: number,
    // ) {
    //   position.value = newPosition;
    // }

    return {
      page,
      // setPosition,
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
