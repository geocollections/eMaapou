export default defineNuxtRouteMiddleware((to, _from) => {
  const searchPositionStore = useSearchPosition();

  const { $reset } = searchPositionStore;
  const { page, searchPosition } = storeToRefs(searchPositionStore);

  const toBaseName = to.name?.toString().split("___")[0];

  const isExitingDetailView
    = searchPosition.value > -1
    && !toBaseName?.startsWith(page.value?.name as string)
    && !to.params.id;
  if (isExitingDetailView)
    $reset();
});
