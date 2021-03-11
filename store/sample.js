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
      { text: 'sample.id', value: 'id' },
      { text: 'sample.number', value: 'number' },
      { text: 'sample.locality', value: 'locality' },
      { text: 'sample.depth', value: 'depth' },
      { text: 'sample.depthInterval', value: 'depth_interval' },
      { text: 'sample.stratigraphy', value: 'stratigraphy' },
      { text: 'sample.collector', value: 'collector' },
      { text: 'sample.dateCollected', value: 'date_collected' },
    ],
    search: {
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
  async quickSearchSamples(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      id: () => 'id',
      number: () => 'number',
      depth: () => 'depth',
      depth_interval: () => 'depth_interval',
      stratigraphy: () =>
        this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
      collector: () => 'collector',
      date_collected: () => 'date_collected',
    }

    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
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
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      id: () => 'id',
      number: () => 'number',
      depth: () => 'depth',
      depth_interval: () => 'depth_interval',
      stratigraphy: () =>
        this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
      collector: () => 'collector',
      date_collected: () => 'date_collected',
    }

    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
        searchFilters: state.search.byIds,
      }
    )
    commit('SET_ITEMS', sampleResponse.items)
    commit('SET_COUNT', sampleResponse.count)
  },
}
