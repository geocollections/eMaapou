import { getField, updateField } from 'vuex-map-fields'
import { SAMPLE } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: SAMPLE.options,
    filters: {
      byIds: {
        number: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.number',
          fields: ['number'],
        },
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.locality',
          fields: ['locality', 'locality_en', 'site_name', 'site_name_en'],
        },
        stratigraphy: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.stratigraphy',
          fields: ['stratigraphy', 'stratigraphy_en'],
        },
        hierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'sample.hierarchy',
          fields: [
            'stratigraphy_hierarchy',
            'age_hierarchy',
            'lithostratigraphy_hierarchy',
          ],
        },
        collector: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.collector',
          fields: ['collector', 'collector_full_name'],
        },
        depth: {
          type: 'range',
          lookUpType: 'range',
          value: [-20, 5000],
          label: 'sample.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
        mass: {
          value: '',
          type: 'text',
          lookUpType: 'equals',
          label: 'sample.mass',
          fields: ['mass'],
        },
        project: {
          value: '',
          type: 'text',
          lookUpType: 'equals',
          label: 'sample.project',
          fields: ['project_name', 'project_name_en'],
        },
        // mass: {
        //   type: 'range',
        //   lookUpType: 'range',
        //   value: [0, 1000000],
        //   label: 'sample.mass',
        //   placeholders: ['mass.min', 'mass.max'],
        //   fields: ['mass'],
        // },
      },
      allIds: ['number', 'stratigraphy', 'hierarchy'],
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
  resetSampleFilters({ commit, dispatch }) {
    commit('RESET_FILTERS')
    dispatch('globalSearch/resetGlobalSearchFilters', null, { root: true })
  },
  async quickSearchSamples(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(SAMPLE.queryFields),
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

    const sampleResponse = await this.$services.sarvSolr.getResourceList(
      'sample',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(SAMPLE.queryFields),
        searchFilters: {
          ...state.filters.byIds,
          ...rootState.globalSearch.filters.byIds,
        },
      }
    )
    commit('SET_ITEMS', sampleResponse.items)
    commit('SET_COUNT', sampleResponse.count)
  },
}
