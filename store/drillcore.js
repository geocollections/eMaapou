import { getField, updateField } from 'vuex-map-fields'
import { DRILLCORE } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: DRILLCORE.options,
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'drillcore.name',
          fields: ['drillcore', 'drillcore_en'],
        },
        country: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.country',
          fields: ['country', 'country_en'],
        },
        repository: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'drillcore.repository',
          fields: ['core_repository', 'core_repository_en'],
        },
        storage: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'drillcore.storage',
          fields: ['location'],
        },
        boxes: {
          type: 'range',
          lookUpType: 'range',
          value: [0, 150],
          label: 'drillcore.boxes',
          placeholders: ['boxes.min', 'boxes.max'],
          fields: ['boxes'],
        },
      },
      allIds: ['name', 'repository', 'country', 'storage', 'boxes'],
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
  resetDrillcoreFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async quickSearchDrillcores(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
      'drillcore',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(DRILLCORE.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', drillcoreResponse.items)
    commit('SET_COUNT', drillcoreResponse.count)
  },
  async searchDrillcores(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
      'drillcore',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(DRILLCORE.queryFields),
        searchFilters: state.filters.byIds,
      }
    )
    commit('SET_ITEMS', drillcoreResponse.items)
    commit('SET_COUNT', drillcoreResponse.count)
  },
}
