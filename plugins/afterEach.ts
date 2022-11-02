import { Plugin } from '@nuxt/types'
import { HistoryEntry } from '~/store/history'

// const EXCLUDED_PAGES = ['index', 'about', 'news', 'news-id', 'search']
const INCLUDED_PAGES = [
  'analysis-id',
  'analytical-data-id',
  'area-id',
  'collection-id',
  'dataset-id',
  'drillcore-id',
  'drillcore-box-id',
  'file-id',
  'locality-id',
  'photo-id',
  'preparation-id',
  'sample-id',
  'site-id',
  'specimen-id',
  'stratigraphy-id',
]
const plugin: Plugin = ({ app, $accessor }, _) => {
  app.router?.afterEach((_, from) => {
    const title = document.title
    const parsedTitle = title.substring(0, title.indexOf('|')).trim()
    if (app.nuxt.err) return
    if (parsedTitle === 'undefined') return
    if (!INCLUDED_PAGES.some((page) => from.name?.includes(page))) return

    const historyObject = {
      title: parsedTitle,
      to: from.path,
    } as HistoryEntry

    $accessor.history.pushHistory(historyObject)
  })
}

export default plugin
