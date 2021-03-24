const HISTORY_SIZE = 10

export const state = () => {
  return {
    history: [],
  }
}

export const mutations = {
  PUSH_HISTORY(state, historyObject) {
    if (state.history[0]?.to === historyObject.to) return

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
}

export const actions = {
  pushHistory({ commit }, historyObject) {
    commit('PUSH_HISTORY', historyObject)
  },
  setHistory({ commit }, history) {
    commit('SET_HISTORY', history)
  },
}
