import { getField, updateField } from 'vuex-map-fields'
import { isEmpty, isNil } from 'lodash'
import { TAXON } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: TAXON.options,
    filters: {
      byIds: {
        species: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'taxon.species',
          fields: ['taxon'],
        },
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'taxon.locality',
          fields: ['locality', 'locality_en'],
        },
        stratigraphyHierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'taxon.stratigraphyHierarchy',
          fields: ['stratigraphy_hierarchy'],
        },
        taxonHierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'taxon.taxonHierarchy',
          fields: ['taxon_hierarchy'],
        },

        // hierarchy: {
        //   value: null,
        //   type: 'object',
        //   searchField: 'hierarchy_string',
        //   lookUpType: 'startsWith',
        //   label: 'taxon.hierarchy',
        //   fields: [
        //     'stratigraphy_hierarchy',
        //     'age_hierarchy',
        //     'lithostratigraphy_hierarchy',
        //   ],
        // },
        author: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'taxon.author',
          fields: ['author_year'],
        },
      },
      allIds: [
        'species',
        'stratigraphyHierarchy',
        'taxonHierarchy',
        'stratigraphy',
        'locality',
        'author',
      ],
    },
  }
}

export const state = () => getDefaultState()

export const getters = {
  getField,
  // FIXME: Almost every state module has this function, should be refactored into single function
  hasActiveFilters(state) {
    return Object.values(state.filters.byIds).some((filter) => {
      if (Array.isArray(filter.value))
        return filter.value.some(function (v) {
          return v !== null
        })
      return !isEmpty(filter.value) && !isNil(filter.value)
    })
  },
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
  resetTaxonFilters({ commit, dispatch }) {
    commit('RESET_FILTERS')
    dispatch('globalSearch/resetGlobalSearchFilters', null, { root: true })
  },
  async quickSearchTaxa(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const taxonResponse = await this.$services.sarvSolr.getResourceList(
      'taxon_search',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(TAXON.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', taxonResponse.items)
    commit('SET_COUNT', taxonResponse.count)
  },
  async searchTaxa(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const taxonResponse = await this.$services.sarvSolr.getResourceList(
      'taxon_search',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(TAXON.queryFields),
        searchFilters: {
          ...state.filters.byIds,
          ...rootState.globalSearch.filters.byIds,
        },
      }
    )
    commit('SET_ITEMS', taxonResponse.items)
    commit('SET_COUNT', taxonResponse.count)
  },
}
