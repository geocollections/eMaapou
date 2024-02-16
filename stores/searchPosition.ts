import type { RouteLocationNamedRaw } from "vue-router";

export const useSearchPosition = defineStore(
  "searchPosition",
  () => {
    const page = ref<RouteLocationNamedRaw>();
    const searchPosition = ref(-1);

    const fromSearch = computed(() => searchPosition.value > -1);

    function $reset() {
      page.value = undefined;
      searchPosition.value = -1;
    }

    function setSearchPosition(
      newPage: RouteLocationNamedRaw,
      newPosition: number,
    ) {
      page.value = newPage;
      searchPosition.value = newPosition;
    }

    return {
      page,
      searchPosition,
      fromSearch,
      setSearchPosition,
      $reset,
    };
  },
  {
    persist: {
      paths: ["page", "searchPosition"],
      storage: persistedState.sessionStorage,
    },
  },
);
