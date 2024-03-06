import type { RouteLocationNamedRaw } from "vue-router";

export const useSearchPosition = defineStore(
  "searchPosition",
  () => {
    const page = ref<RouteLocationNamedRaw>();
    const searchPosition = ref(-1);
    const searchModule = ref<string>();

    const fromSearch = computed(() => searchPosition.value > -1);

    function $reset() {
      page.value = undefined;
      searchPosition.value = -1;
    }

    function setSearchPosition(
      newPage: RouteLocationNamedRaw,
      newPosition: number,
      newModule: string,
    ) {
      page.value = newPage;
      searchPosition.value = newPosition;
      searchModule.value = newModule;
    }

    return {
      page,
      searchPosition,
      searchModule,
      fromSearch,
      setSearchPosition,
      $reset,
    };
  },
  {
    persist: {
      paths: ["page", "searchPosition", "searchModule"],
      storage: persistedState.sessionStorage,
    },
  },
);
