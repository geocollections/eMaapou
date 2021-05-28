import { getField, updateField } from 'vuex-map-fields'

const getDefaultState = () => {
  return {
    filters: {
      byIds: {
        institution: {
          type: 'list_or',
          lookUpType: 'equals',
          value: [],
          fields: ['database_id'],
        },
        geoJSON: {
          type: 'geom',
          lookUpType: 'equals',
          value: null,
          fields: ['latlong'],
        },
      },
      allIds: ['institutions', 'geoJSON'],
    },
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
    lookUpTypes: [
      { text: 'contains', value: 'contains' },
      { text: 'equals', value: 'equals' },
      { text: 'starts with', value: 'startsWith' },
      { text: 'ends with', value: 'endsWith' },
      { text: 'does not contain', value: 'doesNotContain' },
      { text: 'greater than', value: 'greaterThan' },
      { text: 'smaller than', value: 'smallerThan' },
    ],
    paginateByOptions: [
      { text: 'common.pagination', value: 10 },
      { text: 'common.pagination', value: 25 },
      { text: 'common.pagination', value: 50 },
      { text: 'common.pagination', value: 100 },
      { text: 'common.pagination', value: 250 },
      { text: 'common.pagination', value: 500 },
      { text: 'common.pagination', value: 1000 },
    ],
  }
}

export const state = () => getDefaultState()

export const getters = {
  getField,
}

export const mutations = {
  updateField,
  RESET_FILTERS(state) {
    const defaultState = getDefaultState()

    state.filters = defaultState.filters
  },
}

export const actions = {
  resetGlobalSearchFilters({ commit }) {
    commit('RESET_FILTERS')
  },
}
