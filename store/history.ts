import { mutationTree, actionTree } from 'typed-vuex'
const HISTORY_SIZE = 10

export type HistoryEntry = {
  title: string
  to: string
}

export const state = () => {
  return {
    historyEntries: [] as HistoryEntry[],
  }
}

export const mutations = mutationTree(state, {
  PUSH_HISTORY(state, historyObject) {
    // Remove duplicates from history
    state.historyEntries.forEach((h, i) => {
      if (h.to === historyObject.to) state.historyEntries.splice(i, 1)
    })

    if (state.historyEntries.length >= HISTORY_SIZE) state.historyEntries.pop()
    state.historyEntries.unshift(historyObject)
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    pushHistory({ commit }, historyObject) {
      commit('PUSH_HISTORY', historyObject)
    },
  }
)
