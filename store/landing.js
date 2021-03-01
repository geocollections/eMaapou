export const state = () => ({
  search: '',
})

export const mutations = {
  updateSearch(state, search) {
    state.search = search
  },
}

export const actions = {
  updateSearch({ commit }, search) {
    commit('updateSearch', search)
  },
}
