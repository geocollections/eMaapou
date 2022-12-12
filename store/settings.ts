import { getField, updateField } from 'vuex-map-fields'
import { mutationTree, actionTree } from 'typed-vuex'
type SettingsState = {
  cookiePolicy: boolean
  showSearchViewMap: boolean
  showSearchViewForm: boolean
  showInstitutionFilters: boolean
  showExtraOptions: boolean
}

export const state = (): SettingsState => ({
  cookiePolicy: true,
  showSearchViewMap: false,
  showSearchViewForm: true,
  showInstitutionFilters: false,
  showExtraOptions: false,
})

export const mutations = mutationTree(state, {
  updateField,
  SET_COOKIE_POLICY(state, value: boolean) {
    state.cookiePolicy = value
  },
})

export const getters = {
  getField,
}

export const actions = actionTree(
  { state, mutations, getters },
  {
    setCookiePolicy({ commit }, value: boolean) {
      commit('SET_COOKIE_POLICY', value)
    },
  }
)
