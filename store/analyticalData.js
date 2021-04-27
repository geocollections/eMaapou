import { getField, updateField } from 'vuex-map-fields'
import { ANALYTICAL_DATA } from '~/constants'
const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: ANALYTICAL_DATA.options,
    filters: {
      byIds: {
        id: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.id',
          fields: ['id'],
        },
        depth: {
          value: [-20, 5000],
          type: 'range',
          lookUpType: 'range',
          label: 'analyticalData.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
      },
      allIds: ['id', 'depth'],
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
  resetanalyticalDataFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async quickSearchAnalyses(
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
