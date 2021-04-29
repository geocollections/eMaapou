import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  cookiePolicy: true,
  showSearchViewMap: false,
  showSearchViewForm: true,
})

export const actions = {
  closeCookiePolicy({ commit }) {
    commit('CLOSE_COOKIE_POLICY')
  },
}

export const mutations = {
  updateField,

  CLOSE_COOKIE_POLICY(state) {
    state.cookiePolicy = false
  },
}

export const getters = {
  getField,
}
