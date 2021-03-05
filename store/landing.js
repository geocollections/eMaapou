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
}

export const actions = {
  updateSearch({ commit }, search) {
    commit('updateSearch', search)
  },
}
