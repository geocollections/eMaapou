export default ({ app, store }, inject) => {
  app.router.afterEach((to, from) => {
    const name = serializeName(from)

    const id = from.params?.id ?? null

    const historyObject = {
      text: `breadcrumbs.${name}`,
      id,
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

function serializeName(route) {
  let name = route.name ?? 'index'
  if (name.includes('___')) name = name.split('___')[0]
  if (name.includes('-id-')) name = `${name.split('-id-')[0]}-id`
  return name
}
