export default ({ app }, inject) => {
  const hydrateCount = async (tab, params = {}) => {
    if (!tab.id) return tab

    if (tab.isSolr) {
      const res = await app.$services.sarvSolr.getResourceCount(
        tab.id,
        params.solr?.[tab.id] ?? params.solr?.default ?? {}
      )
      return { ...tab, count: res?.count ?? 0 }
    } else {
      const res = await app.$services.sarvREST.getResourceCount(
        tab.id,
        params.api?.[tab.id] ?? params.api?.default ?? {}
      )
      return { ...tab, count: res?.count ?? 0 }
    }
  }

  const populateProps = (tab, props) => {
    return { ...tab, props }
  }

  inject('hydrateCount', hydrateCount)
  inject('populateProps', populateProps)
}
