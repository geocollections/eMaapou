import {
  Ref,
  useContext,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import isEqual from 'lodash/isEqual'
import { Location } from 'vue-router'
import { Tab } from '~/constants'

export function useRedirectInvalidTabRoute({
  tabs,
  watchableObject,
  pending,
  validRoute,
}: {
  tabs: Ref<Tab[]>
  watchableObject: Ref<any>
  pending: Ref<any>
  validRoute: Ref<any>
}) {
  const route = useRoute()
  const router = useRouter()
  const { getRouteBaseName, localeLocation } = useContext()

  watch([watchableObject, pending], ([_object, pending]) => {
    if (pending) return
    validRoute.value = redirectToValidRoute({
      tabs: tabs.value,
    })
  })

  const redirectToValidRoute = ({ tabs }: { tabs: Tab[] }) => {
    const location = {
      name: getRouteBaseName(route.value),
      params: route.value.params,
    }
    const validRoute = localeLocation(getValidTabRoute(location, tabs))

    if (validRoute === undefined) return validRoute
    if (router.resolve(validRoute).href !== route.value.path)
      router.replace(validRoute)

    return validRoute
  }

  const getValidTabRoute = (currentRoute: Location, tabs: Tab[]): Location => {
    if (tabs.length < 1) return currentRoute
    const currentTab = tabs.find((tab) =>
      isEqual(
        {
          name: currentRoute.name,
          params: currentRoute.params,
        },
        {
          name: tab.routeName,
          params: currentRoute.params,
        }
      )
    )
    // If current tab is valid and contains items return the current route
    if (currentTab !== undefined && currentTab.count > 0) return currentRoute
    // Find tab that has items
    const tabWithItems = tabs.find((tab) => tab.count > 0)

    // If there is another tab with items return that
    if (tabWithItems !== undefined)
      return { name: tabWithItems.routeName, params: currentRoute.params }

    // If there is no tab with items return base route
    // HACK: Right now we assume that tabs[0] return the base route, but this might not be the case always.
    return {
      name: tabs[0].routeName,
      params: currentRoute.params,
    }
  }
}
