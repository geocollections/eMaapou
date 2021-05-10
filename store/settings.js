import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  cookiePolicy: true,
  showSearchViewMap: false,
  showSearchViewForm: true,
  showInstitutionFilters: true,
  institutions: [
    {
      id: 1,
      acronym: 'GIT',
      name: 'TalTech geoloogia instituut',
      name_en: 'Department of Geology, TalTech',
    },
    {
      id: 2,
      acronym: 'TUG',
      name: 'TÜ Loodusmuuseum, geoloogia',
      name_en: 'University of Tartu, Natural History Museum, geology',
    },
    {
      id: 3,
      acronym: 'ELM',
      name: 'Eesti Loodusmuuseum, geoloogia',
      name_en: 'Eesti Loodusmuuseum, geoloogia',
    },
    {
      id: 4,
      acronym: 'MUMU',
      name: 'Eesti Maaülikooli mullakogud',
      name_en: 'Eesti Maaülikooli mullakogud',
    },
    {
      id: 5,
      acronym: 'TUGO',
      name: 'Tartu Ülikooli geoloogia osakond',
      name_en: 'Tartu University, Department of Geology',
    },
    {
      id: 6,
      acronym: 'EGK',
      name: 'Eesti Geoloogiakeskus',
      name_en: 'Geological Survey of Estonia (EGK)',
    },
    {
      id: 7,
      acronym: 'EGT',
      name: 'Eesti Geoloogiateenistus',
      name_en: 'Geological Survey of Estonia',
    },
  ],
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
