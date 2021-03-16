import { getField, updateField } from 'vuex-map-fields'
import { SAMPLE } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: SAMPLE.options,
    filters: {
      byIds: {
        number: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.number',
          fields: ['number'],
        },
        stratigraphy: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.stratigraphy',
          fields: ['stratigraphy', 'stratigraphy_en'],
        },
        depth: {
          type: 'range',
          lookUpType: 'range',
          value: [-20, 5000],
          label: 'sample.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
      },
      allIds: ['number', 'stratigraphy'],
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
  resetSampleFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async quickSearchSamples(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(SAMPLE.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', sampleResponse.items)
    commit('SET_COUNT', sampleResponse.count)
  },
  async searchSamples(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(SAMPLE.queryFields),
        searchFilters: state.filters.byIds,
      }
    )
    commit('SET_ITEMS', sampleResponse.items)
    commit('SET_COUNT', sampleResponse.count)
  },
}
