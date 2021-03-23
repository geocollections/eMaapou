export default ({ app, store }, inject) => {
  const pushHistory = (historyObject) => {
    store.dispatch('history/pushHistory', historyObject)
  }

  const setHistory = (history) => {
    store.dispatch('history/setHistory', history)
  }

  inject('pushHistory', pushHistory)
  inject('setHistory', setHistory)
}
