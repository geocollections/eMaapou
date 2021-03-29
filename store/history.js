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
      state.history.unshift(lastObject)
    }

    state.history.unshift(historyObject)
  },
}

export const actions = {
  pushHistory({ commit }, historyObject) {
    commit('PUSH_HISTORY', historyObject)
  },
}

export const getters = {
  getLastHistoryEntry(state) {
    return state.history?.[0]
  },
}
