import { getField, updateField } from 'vuex-map-fields'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: {
      page: 1,
      itemsPerPage: 25,
      sortBy: ['id'],
      sortDesc: [true],
    },
    headers: [
      { text: 'site.id', value: 'id' },
      { text: 'site.name', value: 'name' },
      { text: 'site.latitude', value: 'latitude' },
      { text: 'site.longitude', value: 'longitude' },
    ],
    search: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'site.name',
          fields: ['name'],
        },
        latitude: {
          type: 'range',
          lookUpType: 'range',
          value: [-90, 90],
          label: 'site.latitude',
          placeholders: ['coorinates.min', 'coorinates.max'],
          fields: ['latitude'],
        },
        longitude: {
          type: 'range',
          lookUpType: 'range',
          value: [-180, 180],
          label: 'site.longitude',
          placeholders: ['coorinates.min', 'coorinates.max'],
          fields: ['longitude'],
        },
      },
      allIds: ['name'],
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
  resetSiteSearch({ commit }) {
    commit('RESET_SEARCH')
  },
  async quickSearchSites(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      id: () => 'id_numeric',
      name: () => 'name',
      project: () =>
        this.$i18n.locale === 'et' ? 'project__name' : 'project__name_en',
    }

    const siteResponse = await this.$services.sarvSolr.getResourceList('site', {
      tableOptions: options,
      search: rootState.landing.search,
      queryFields,
      searchFilters: {},
    })
    commit('SET_ITEMS', siteResponse.items)
    commit('SET_COUNT', siteResponse.count)
  },
  async searchSites(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      id: () => 'id_numeric',
      name: () => 'name',
      project: () =>
        this.$i18n.locale === 'et' ? 'project__name' : 'project__name_en',
    }

    const siteResponse = await this.$services.sarvSolr.getResourceList('site', {
      tableOptions: options,
      search: rootState.landing.search,
      queryFields,
      searchFilters: state.search.byIds,
    })
    commit('SET_ITEMS', siteResponse.items)
    commit('SET_COUNT', siteResponse.count)
  },
}
