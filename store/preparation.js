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
      { text: 'preparation.id', value: 'id' },
      {
        text: 'preparation.preparation_number',
        value: 'preparation_number',
      },
      { text: 'preparation.locality', value: 'locality' },
      { text: 'preparation.depth', value: 'depth' },
      {
        text: 'preparation.stratigraphy',
        value: 'stratigraphy',
      },
      { text: 'preparation.agent', value: 'agent' },
      { text: 'preparation.mass', value: 'mass' },
    ],
    search: {
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
  resetSampleSearch({ commit }) {
    commit('RESET_SEARCH')
  },
  async quickSearchPreparations(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      id: () => 'id',
      preparation_number: () => 'preparation_number',
      locality: () => (this.$i18n.locale === 'et' ? 'locality' : 'locality_en'),
      depth: () => 'depth',
      stratigraphy: () =>
        this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
      agent: () => 'agent',
      mass: () => 'mass',
    }

    const preparationResponse = await this.$services.sarvSolr.getResourceList(
      'preparation',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
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
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      id: () => 'id',
      preparation_number: () => 'preparation_number',
      locality: () => (this.$i18n.locale === 'et' ? 'locality' : 'locality_en'),
      depth: () => 'depth',
      stratigraphy: () =>
        this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
      agent: () => 'agent',
      mass: () => 'mass',
    }

    const preparationResponse = await this.$services.sarvSolr.getResourceList(
      'preparation',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
        searchFilters: state.search.byIds,
      }
    )
    commit('SET_ITEMS', preparationResponse.items)
    commit('SET_COUNT', preparationResponse.count)
  },
}
