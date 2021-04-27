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

  const populateProps = (tab, props) => {
    return { ...tab, props }
  }

  const validateTabRoute = (route, tabs) => {
    const currentTab = tabs.find(
      (tab) =>
        route.path ===
        app.localePath({
          name: tab.routeName,
          params: route.params,
        })
    )

    if (currentTab.count > 0) return route.path

    // Find tab that has items
    const initTab = tabs.find((tab) => tab.count > 0)
    // Constuct route
    // HACK: Right now we assume that tabs[0] return the base route, but this might not be the case always.
    const path = app.localePath({
      name: initTab?.routeName ?? tabs[0].routeName,
      params: route.params,
    })
    return path
  }

  inject('hydrateCount', hydrateCount)
  inject('populateProps', populateProps)
  inject('validateTabRoute', validateTabRoute)
}
