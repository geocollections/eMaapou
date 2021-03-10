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
      { text: 'drillcore.name', value: 'drillcore' },
      { text: 'drillcore.depth', value: 'depth' },
      { text: 'drillcore.boxes', value: 'boxes' },
      { text: 'drillcore.boxNumbers', value: 'box_numbers' },
      { text: 'drillcore.storage', value: 'location' },
      { text: 'drillcore.year', value: 'year' },
      { text: 'drillcore.remarks', value: 'remarks' },
    ],
    search: {
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
  RESET_SEARCH(state) {
    const defaultState = getDefaultState()

    state.search = defaultState.search
    state.options = { ...state.options, page: defaultState.options.page }
  },
}

export const actions = {
  resetDrillcoreSearch({ commit }) {
    commit('RESET_SEARCH')
  },
  async quickSearchDrillcores(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    const queryFields = {
      drillcore: () =>
        this.$i18n.locale === 'et' ? 'drillcore' : 'drillcore_en',
      depth: () => 'depth',
      boxes: () => 'boxes',
      box_numbers: () => 'box_numbers',
      storage__location: () => 'storage__location',
      year: () => 'year',
      remarks: () => 'remarks',
    }

    const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
      'drillcore',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
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
    // TODO: move these functions somewhere where they are not created every time the action is called
    const queryFields = {
      drillcore: () =>
        this.$i18n.locale === 'et' ? 'drillcore' : 'drillcore_en',
      depth: () => 'depth',
      boxes: () => 'boxes',
      box_numbers: () => 'box_numbers',
      storage__location: () => 'storage__location',
      year: () => 'year',
      remarks: () => 'remarks',
    }

    const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
      'drillcore',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
        searchFilters: state.search.byIds,
      }
    )
    commit('SET_ITEMS', drillcoreResponse.items)
    commit('SET_COUNT', drillcoreResponse.count)
  },
}
