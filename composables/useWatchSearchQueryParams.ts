export function useWatchSearchQueryParams(cb: () => void, ignoreParams = ["page", "itemsPerPage", "sortDesc", "sortBy"]) {
  const route = useRoute();
  watch(
    () => route.query,
    (newVal, oldVal) => {
      for (const param of ignoreParams) {
        if (newVal[param] !== oldVal[param])
          return;
      }

      cb();
    },
  );
}
