const HISTORY_SIZE = 10

export const state = () => {
  return {
    history: [],
  }
}

export const mutations = {
  PUSH_HISTORY(state, historyObject) {
    if (state.history.length >= HISTORY_SIZE) state.history.shift()

    if (state.history.length > 0) {
      const lastObject = state.history.pop()
      state.history.push({ ...lastObject, disabled: false })
    }

    state.history.push({ ...historyObject, disabled: true })
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
