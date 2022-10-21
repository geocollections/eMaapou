import { Plugin } from '@nuxt/types'
import { Route, Location } from 'vue-router'
const plugin: Plugin = ({ app }, inject) => {
  const hydrateCount = async (
    tab: any,
    options: { solr?: any; api?: any; fields?: any } = {}
  ) => {
    if (!tab.id) return tab

    if (tab.isSolr) {
      const res = await app.$services.sarvSolr.getResourceCount(
        tab.table ?? tab.id,
        options.solr?.[tab.id] ?? options.solr?.default ?? {}
      )
      return { ...tab, count: res?.count ?? 0 }
    } else {
      const res = await app.$services.sarvREST.getResourceCount(
        tab.table ?? tab.id,
        options.api?.[tab.id] ?? options.api?.default ?? {},
        options.fields ?? null
      )
      return { ...tab, count: res?.count ?? 0 }
    }
  }

  const hydrateProps = (tab: any, props: any) => {
    return {
      ...tab,
      props: { ...tab.props, ...props },
    }
  }

  const hydrateTab = async (
    tab: object,
    options = { props: {}, countParams: {} }
  ): Promise<object> => {
    tab = hydrateProps(tab, options.props)

    return await hydrateCount(tab, options.countParams)
  }

  const validateTabRoute = (
    route: Location,
    tabs: any[]
  ): Location | undefined => {
    const routeCopy = {
      name: route.name,
      params: route.params,
      path: route.path,
    }
    if (!(tabs.length > 0)) return routeCopy
    const currentTab = tabs.find(
      (tab) =>
        route.path ===
        app.localePath({
          name: tab.routeName,
          params: route.params,
        })
    )
    if (currentTab.count > 0) return routeCopy
    // Find tab that has items
    const initTab = tabs.find((tab) => tab.count > 0)
    // Constuct route
    // HACK: Right now we assume that tabs[0] return the base route, but this might not be the case always.
    const localePath = app.localeLocation({
      name: initTab?.routeName ?? tabs[0].routeName,
      params: route.params,
    })
    return localePath
  }

  const getMaxTab = (route: Route, tabs: any[]): Route | undefined => {
    const initTab = tabs.reduce((max, tab) =>
      max.count > tab.count ? max : tab
    )

    // Constuct route
    // HACK: Right now we assume that tabs[0] return the base route, but this might not be the case always.
    const path = app.localeRoute({
      name: initTab?.routeName ?? tabs[0].routeName,
      params: route.params,
      query: route.query,
    })
    return path
  }
  inject('hydrateTab', hydrateTab)
  inject('validateTabRoute', validateTabRoute)
  inject('getMaxTab', getMaxTab)
}

export default plugin
