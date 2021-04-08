import { getField, updateField } from 'vuex-map-fields'
import { LOCALITY } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: LOCALITY.options,
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.name',
          fields: ['locality', 'locality_en'],
        },
        country: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.country',
          fields: ['country', 'country_en'],
        },
        stratigraphy: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.stratigraphy',
          fields: [
            'stratigraphy_base',
            'stratigraphy_base_en',
            'stratigraphy_base_free',
            'stratigraphy_top',
            'stratigraphy_top_en',
            'stratigraphy_top_free',
          ],
        },
        reference: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.reference',
          fields: ['locality_references'],
        },
      },
      allIds: ['name', 'country'],
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
  resetLocalityFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async quickSearchLocalities(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const localityResponse = await this.$services.sarvSolr.getResourceList(
      'locality',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(LOCALITY.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', localityResponse.items)
    commit('SET_COUNT', localityResponse.count)
  },
  async searchLocalities(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const localityResponse = await this.$services.sarvSolr.getResourceList(
      'locality',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(LOCALITY.queryFields),
        searchFilters: state.filters.byIds,
      }
    )
    commit('SET_ITEMS', localityResponse.items)
    commit('SET_COUNT', localityResponse.count)
  },
}
