import { getField, updateField } from 'vuex-map-fields'
import { STRATIGRAPHY } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: STRATIGRAPHY.options,
    filters: {
      byIds: {
        id: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'stratigraphy.id',
          fields: ['id'],
        },
        stratigraphy: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'stratigraphy.stratigraphy',
          fields: ['stratigraphy', 'stratigraphy_en'],
        },
        index: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'stratigraphy.index',
          fields: ['index_main', 'index_additional'],
        },
        age: {
          value: [null, null],
          type: 'range',
          lookUpType: 'range',
          label: 'stratigraphy.age',
          placeholders: ['stratigraphy.min', 'stratigraphy.max'],
          fields: ['age_base', 'age_top'],
        },
        hierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'equals',
          label: 'stratigraphy.hierarchy',
          fields: ['hierarchy_string'],
        },
      },
      allIds: ['id', 'stratigraphy', 'age'],
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
  resetStratigraphyFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async searchStratigraphy(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'stratigraphy',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(STRATIGRAPHY.queryFields),
        searchFilters: state.filters.byIds,
      }
    )
    commit('SET_ITEMS', sampleResponse.items)
    commit('SET_COUNT', sampleResponse.count)
  },
}
