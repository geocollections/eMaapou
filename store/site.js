import { getField, updateField } from 'vuex-map-fields'
import { SITE } from '~/constants'
const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: SITE.options,
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'site.name',
          fields: ['name'],
        },
        area: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'site.area',
          fields: ['area_name', 'area_name_en'],
        },
        project: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'site.project',
          fields: ['project_name', 'project_name_en'],
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
  RESET_FILTERS(state) {
    const defaultState = getDefaultState()

    state.filters = defaultState.filters
    state.options = { ...state.options, page: defaultState.options.page }
  },
}

export const actions = {
  resetSiteFilters({ commit, dispatch }) {
    commit('RESET_FILTERS')
    dispatch('globalSearch/resetGlobalSearchFilters', null, { root: true })
  },
  async quickSearchSites(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const siteResponse = await this.$services.sarvSolr.getResourceList('site', {
      options,
      search: rootState.landing.search,
      queryFields: this.$getQueryFields(SITE.queryFields),
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

    const globalSearchFilters = {
      geoJSON: rootState.globalSearch.filters.byIds.geoJSON,
    }

    const siteResponse = await this.$services.sarvSolr.getResourceList('site', {
      options,
      search: rootState.landing.search,
      queryFields: this.$getQueryFields(SITE.queryFields),
      searchFilters: { ...state.filters.byIds, ...globalSearchFilters },
    })
    commit('SET_ITEMS', siteResponse.items)
    commit('SET_COUNT', siteResponse.count)
  },
}
