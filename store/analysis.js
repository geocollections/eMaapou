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
      { text: 'analysis.id', value: 'id' },
      {
        text: 'analysis.sampleNumber',
        value: 'sample_number',
      },
      { text: 'analysis.locality', value: 'locality' },
      { text: 'analysis.depth', value: 'depth' },
      { text: 'analysis.stratigraphy', value: 'stratigraphy' },
      { text: 'analysis.method', value: 'analysis_method' },
      { text: 'analysis.lab', value: 'lab' },
    ],
    search: {
      byIds: {
        id: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analysis.id',
          fields: ['id'],
        },
        depth: {
          value: [-20, 5000],
          type: 'range',
          lookUpType: 'range',
          label: 'analysis.depth',
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
  RESET_SEARCH(state) {
    const defaultState = getDefaultState()

    state.search = defaultState.search
    state.options = { ...state.options, page: defaultState.options.page }
  },
}

export const actions = {
  resetAnalysisSearch({ commit }) {
    commit('RESET_SEARCH')
  },
  async quickSearchAnalyses(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    const queryFields = {
      id: () => 'id',
      sample_number: () => 'sample_number',
      locality: () => (this.$i18n.locale === 'et' ? 'locality' : 'locality_en'),
      depth: () => 'depth',
      stratigraphy: () =>
        this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
      analysis_method: () =>
        this.$i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en',
      lab: () => 'lab',
    }

    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'analysis',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', analysisResponse.items)
    commit('SET_COUNT', analysisResponse.count)
  },
  async searchAnalyses(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    const queryFields = {
      id: () => 'id',
      sample_number: () => 'sample_number',
      locality: () => (this.$i18n.locale === 'et' ? 'locality' : 'locality_en'),
      depth: () => 'depth',
      stratigraphy: () =>
        this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
      analysis_method: () =>
        this.$i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en',
      lab: () => 'lab',
    }

    const analysisResponse = await this.$services.sarvSolr.getResourceList(
      'analysis',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
        searchFilters: state.search.byIds,
      }
    )
    commit('SET_ITEMS', analysisResponse.items)
    commit('SET_COUNT', analysisResponse.count)
  },
}
