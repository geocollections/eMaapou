import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  cookiePolicy: true,
  showSearchViewMap: false,
  showSearchViewForm: true,
  showInstitutionFilters: false,
  showExtraOptions: false,
  listOfViews: ['table', 'image', 'gallery'],
})

export const mutations = {
  updateField,
}

export const getters = {
  getField,
}
