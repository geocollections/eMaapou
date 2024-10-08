import type { RouteLocationRaw } from "vue-router";

export async function redirectInvalidTab({
  redirectRoute,
  tabs,
}: {
  redirectRoute: RouteLocationRaw;
  tabs: HydratedTab[];
}) {
  const route = useRoute();
  const router = useRouter();
  const getRouteBaseName = useRouteBaseName();
  const error = useError();

  const isCurrentRouteValid = computed(() => {
    return tabs.some((tab) => {
      return tab.routeName === getRouteBaseName(route);
    });
  });
  if (error.value)
    return;

  if (!isCurrentRouteValid.value)
    await router.replace(redirectRoute);
}
