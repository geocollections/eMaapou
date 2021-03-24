export default ({ app, store }, inject) => {
  const pushHistory = (historyObject) => {
    store.dispatch('history/pushHistory', historyObject)
  }

  const setHistory = (history) => {
    store.dispatch('history/setHistory', history)
  }

  const removeHistory = (index) => {
    store.dispatch('history/removeHistory', index)
  }

  inject('pushHistory', pushHistory)
  inject('setHistory', setHistory)
  inject('removeHistory', removeHistory)
}
