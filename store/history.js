const HISTORY_SIZE = 10

export const state = () => {
  return {
    history: [],
  }
}

export const mutations = {
  PUSH_HISTORY(state, historyObject) {
    // Remove duplicates from history
    state.history.forEach((h, i) => {
      if (h.to === historyObject.to) state.history.splice(i, 1)
    })

    if (state.history.length >= HISTORY_SIZE) state.history.pop()

    if (state.history.length > 0) {
      const lastObject = state.history.shift()
      state.history.unshift({ ...lastObject, disabled: false })
    }

    state.history.unshift({ ...historyObject, disabled: true })
  },
  SET_HISTORY(state, history) {
    state.history = history
  },
  REMOVE_HISTORY(state, index) {
    state.history.splice(index, 1)
  },
}

export const actions = {
  pushHistory({ commit }, historyObject) {
    commit('PUSH_HISTORY', historyObject)
  },
  setHistory({ commit }, history) {
    commit('SET_HISTORY', history)
  },
  removeHistory({ commit }, index) {
    commit('REMOVE_HISTORY', index)
  },
}
