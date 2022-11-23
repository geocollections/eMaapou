import { getField, updateField } from 'vuex-map-fields'

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

export const mutations = {
  updateField,
}

export const getters = {
  getField,
}
