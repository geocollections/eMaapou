export const useSearchPosition = () => {
  const searchPosition = ref(-1);
  const fromSearch = computed(() => searchPosition.value > -1);

  return { searchPosition, fromSearch };
};
