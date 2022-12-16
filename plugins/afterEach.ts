import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { HistoryEntry } from '~/store/history'

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
export default defineNuxtPlugin(({ app, $accessor, i18n }, _) => {
  app.router?.afterEach((to, from) => {
    const title = document.title
    const parsedTitle = title?.substring(0, title.indexOf('|')).trim()
    if (app.nuxt.err) return
    if (parsedTitle === 'undefined') return
    if (to.params.id === from.params.id) return
    if (parsedTitle === i18n.t('error.occurred')) return
    if (!INCLUDED_PAGES.some((page) => from.name?.includes(page))) return
    const historyObject = {
      title: parsedTitle,
      to: from.path,
    } as HistoryEntry

    if (
      $accessor.history.historyEntries.length > 0 &&
      $accessor.history.historyEntries[0].title === historyObject.title
    )
      return

    $accessor.history.pushHistory(historyObject)
  })
})
