import { getField, updateField } from 'vuex-map-fields'
export const state = () => ({
  search: '',
})

export const getters = {
  getField,
}

export const mutations = {
  updateField,
  updateSearch(state, search) {
    state.search = search
  },
  RESET_SEARCH(state) {
    state.search = ''
  },
}

export const actions = {
  updateSearch({ commit }, search) {
    commit('updateSearch', search)
  },
  resetSearch({ commit }) {
    commit('RESET_SEARCH')
  },
}
