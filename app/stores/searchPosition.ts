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
      searchModule.value = undefined;
    }

    function setSearchPosition(
      newPage: RouteLocationNamedRaw,
      newPosition: number,
      module?: string,
    ) {
      page.value = newPage;
      searchPosition.value = newPosition;
      if (module)
        searchModule.value = module;
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
