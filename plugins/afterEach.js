export default ({ app, store }, inject) => {
  app.router.afterEach((to, from) => {
    let name = from.name ?? 'index'
    if (name.includes('___')) name = name.split('___')[0]
    const text = `breadcrumbs.${name}`
    const id = from.params?.id ?? null
    const uniqueIdentifier = `${name}.${id}`
    const lastHistoryEntry = store.getters['history/getLastHistoryEntry']
    const lastHistoryEntryUniqueIdentifier =
      lastHistoryEntry?.uniqueIdentifier ?? 'index.null'
    if (
      uniqueIdentifier !== lastHistoryEntryUniqueIdentifier &&
      !uniqueIdentifier.includes('-id-')
    ) {
      store.dispatch('history/pushHistory', {
        text,
        id,
        to: from.path,
        uniqueIdentifier,
      })
    }
  })
}
