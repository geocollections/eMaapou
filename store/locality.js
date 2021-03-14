import { getField, updateField } from 'vuex-map-fields'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: {
      page: 1,
      itemsPerPage: 25,
      sortBy: [],
      sortDesc: [],
    },
    headers: [
      { text: 'locality.id', value: 'id' },
      { text: 'locality.name', value: 'locality' },
      { text: 'locality.country', value: 'country' },
      { text: 'locality.latitude', value: 'latitude' },
      { text: 'locality.longitude', value: 'longitude' },
    ],
    search: {
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
  RESET_SEARCH(state) {
    const defaultState = getDefaultState()

    state.search = defaultState.search
    state.options = { ...state.options, page: defaultState.options.page }
  },
}

export const actions = {
  resetLocalitySearch({ commit }) {
    commit('RESET_SEARCH')
  },
  async quickSearchLocalities(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      locality: () => (this.$i18n.locale === 'et' ? 'locality' : 'locality_en'),
      country: () => (this.$i18n.locale === 'et' ? 'country' : 'country_en'),
    }

    const localityResponse = await this.$services.sarvSolr.getResourceList(
      'locality',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
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
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      locality: () => (this.$i18n.locale === 'et' ? 'locality' : 'locality_en'),
      country: () => (this.$i18n.locale === 'et' ? 'country' : 'country_en'),
    }

    const localityResponse = await this.$services.sarvSolr.getResourceList(
      'locality',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
        searchFilters: state.search.byIds,
      }
    )
    commit('SET_ITEMS', localityResponse.items)
    commit('SET_COUNT', localityResponse.count)
  },
}
