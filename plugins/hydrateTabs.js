export default ({ app }, inject) => {
  const hydrateCount = async (tab, params = {}) => {
    if (!tab.id) return tab

    if (tab.isSolr) {
      const res = await app.$services.sarvSolr.getResourceCount(
        tab.table ?? tab.id,
        params.solr?.[tab.id] ?? params.solr?.default ?? {}
      )
      return { ...tab, count: res?.count ?? 0 }
    } else {
      const res = await app.$services.sarvREST.getResourceCount(
        tab.table ?? tab.id,
        params.api?.[tab.id] ?? params.api?.default ?? {},
        params.fields ?? null
      )
      return { ...tab, count: res?.count ?? 0 }
    }
  }

  const hydrateProps = (tab, props) => {
    return {
      ...tab,
      props: { ...tab.props, ...props },
    }
  }

  const hydrateTab = async (tab, options = { props: {}, countParams: {} }) => {
    tab = hydrateProps(tab, options.props)

    return await hydrateCount(tab, options.countParams)
  }

  const validateTabRoute = (route, tabs) => {
    const routeCopy = {
      name: route.name,
      params: route.params,
      path: route.path,
      matched: undefined, // NOTE: if `matched` is not removed, will get maximum call stach error
    }
    if (!tabs.length > 0) return routeCopy
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
    const localePath = app.localeRoute({
      name: initTab?.routeName ?? tabs[0].routeName,
      params: route.params,
    })
    return { ...localePath, matched: undefined }
  }

  const getMaxTab = (route, tabs) => {
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
  inject('hydrateCount', hydrateCount)
  inject('hydrateProps', hydrateProps)
  inject('hydrateTab', hydrateTab)
  inject('validateTabRoute', validateTabRoute)
  inject('getMaxTab', getMaxTab)
}
