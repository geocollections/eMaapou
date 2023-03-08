import { Plugin } from '@nuxt/types'
import { Location } from 'vue-router'
import { Tab } from '~/constants'
const plugin: Plugin = ({ app }, inject) => {
  const hydrateCount = async (
    tab: Tab,
    options: { solr?: any; api?: any; fields?: any } = {}
  ) => {
    if (!tab.id) return tab
    if (tab.count > 0) return tab
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

  const hydrateProps = (tab: Tab, props: any) => {
    return {
      ...tab,
      props: { ...tab.props, ...props },
    }
  }

  const hydrateTab = async (
    tab: Tab,
    options = { props: {}, countParams: {} }
  ): Promise<Tab> => {
    tab = hydrateProps(tab, options.props)

    return await hydrateCount(tab, options.countParams)
  }

  const getMaxTab = (route: Location, tabs: any[]): Location => {
    if (!(tabs.length > 0)) return route
    const initTab = tabs.reduce((max, tab) =>
      max.count > tab.count ? max : tab
    )

    // Constuct route
    // HACK: Right now we assume that tabs[0] return the base route, but this might not be the case always.
    const path = {
      name: initTab?.routeName ?? tabs[0].routeName,
      query: route.query,
    }
    return path
  }
  inject('hydrateTab', hydrateTab)
  inject('getMaxTab', getMaxTab)
}

export default plugin
