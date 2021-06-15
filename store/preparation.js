import { getField, updateField } from 'vuex-map-fields'
import { isEmpty, isNil } from 'lodash'
import { PREPARATION } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: PREPARATION.options,
    filters: {
      // TODO
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
  hasActiveFilters(state) {
    return Object.values(state.filters.byIds).some((filter) => {
      if (Array.isArray(filter.value))
        return filter.value.some(function (v) {
          return v !== null
        })
      return !isEmpty(filter.value) && !isNil(filter.value)
    })
  },
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
  resetPreparationFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async quickSearchPreparations(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const preparationResponse = await this.$services.sarvSolr.getResourceList(
      'preparation',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(PREPARATION.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', preparationResponse.items)
    commit('SET_COUNT', preparationResponse.count)
  },
  async searchPreparations(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const preparationResponse = await this.$services.sarvSolr.getResourceList(
      'preparation',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(PREPARATION.queryFields),
        searchFilters: state.filters.byIds,
      }
    )
    commit('SET_ITEMS', preparationResponse.items)
    commit('SET_COUNT', preparationResponse.count)
  },
}
