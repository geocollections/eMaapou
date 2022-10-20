import { Plugin } from '@nuxt/types'
import { Route } from 'vue-router'

const EXCLUDED_PAGES = ['index', 'about', 'news', 'news-id', 'search']

const plugin: Plugin = ({ app, store }, _) => {
  app.router?.afterEach((_, from) => {
    if (app.nuxt.err) return
    if (EXCLUDED_PAGES.some((page) => from.name?.startsWith(page))) return

    const name = serializeName(from)
    const id = from.params?.id ?? null
    const title = document.title

    const parsedTitle = title.substring(0, title.indexOf('|')).trim()

    const historyObject = {
      text: parsedTitle,
      id,
      name: app.getRouteBaseName(from),
      to: from.path,
      uniqueIdentifier: `${name}.${id}`,
    }

    const lastHistoryEntryUniqueIdentifier =
      store.getters['history/getLastHistoryEntry']?.uniqueIdentifier ??
      'index.null'

    if (
      historyObject.uniqueIdentifier !== lastHistoryEntryUniqueIdentifier &&
      !historyObject.uniqueIdentifier.includes('-id-')
    ) {
      store.dispatch('history/pushHistory', historyObject)
    }
  })
}

const serializeName = (route: Route): string => {
  let name = route.name ?? 'index'
  if (name.includes('___')) name = name.split('___')[0]
  if (name.includes('-id-')) name = `${name.split('-id-')[0]}-id`
  return name
}

export default plugin
