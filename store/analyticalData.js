import { getField, updateField } from 'vuex-map-fields'
import { ANALYTICAL_DATA } from '~/constants'
const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: ANALYTICAL_DATA.options,
    filters: {
      byIds: {
        stratigraphy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'contains',
          label: 'analyticalData.stratigraphy',
          fields: ['stratigraphy_hierarchy'],
        },
        lithostratigraphy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'contains',
          label: 'analyticalData.lithostratigraphy',
          fields: ['lithostratigraphy_hierarchy'],
        },
        method: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.method',
          fields: ['analysis_method', 'analysis_method_en', 'method_details'],
        },
        reference: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.reference',
          fields: ['reference'],
        },
        dataset: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.dataset',
          fields: ['dataset_name'],
        },
        stratigraphyBed: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.stratigraphyBed',
          fields: [
            'stratigraphy',
            'stratigraphy_en',
            'lithostratigraphy',
            'lithostratigraphy_en',
          ],
        },
        rock: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.rock',
          fields: ['rock', 'rock_en', 'rock_txt', 'rock_en_txt'],
        },
        sample: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.sample',
          fields: ['sample_id', 'sample_number', 'sample_type'],
        },
        // Todo: Dynamic parameters
      },
      allIds: [
        'stratigraphy',
        'lithostratigraphy',
        'method',
        'reference',
        'dataset',
        'stratigraphyBed',
        'rock',
        'sample',
        // Todo: Dynamic parameters
      ],
    },
  }
}

export const state = () => getDefaultState()

export const getters = {
  getField,
}

export const mutations = {
  updateField,
  SET_ITEMS(state, items) {
    state.items = items
  },
  SET_COUNT(state, count) {
    state.count = count
  },
  SET_OPTIONS(state, options) {
    state.options = options
  },
  RESET_FILTERS(state) {
    const defaultState = getDefaultState()

    state.filters = defaultState.filters
    state.options = { ...state.options, page: defaultState.options.page }
  },
}

export const actions = {
  resetAnalyticalDataFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async quickSearchAnalyticalData(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const analyticalDataResponse = await this.$services.sarvSolr.getResourceList(
      'analytical_data',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(ANALYTICAL_DATA.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', analyticalDataResponse.items)
    commit('SET_COUNT', analyticalDataResponse.count)
  },
  async searchAnalyticalData(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const analyticalDataResponse = await this.$services.sarvSolr.getResourceList(
      'analytical_data',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(ANALYTICAL_DATA.queryFields),
        searchFilters: state.filters.byIds,
      }
    )
    commit('SET_ITEMS', analyticalDataResponse.items)
    commit('SET_COUNT', analyticalDataResponse.count)
  },
}
