import { getField, updateField } from 'vuex-map-fields'
import { DATASET } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: DATASET.options,
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.name',
          fields: ['name', 'name_en'],
        },
        owner: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.owner',
          fields: [
            'owner_id',
            'owner_agent',
            'owner_forename',
            'owner_surename',
            'owner_txt',
          ],
        },
        date: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.date',
          fields: ['date', 'date_txt'],
        },
        remarks: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.remarks',
          fields: ['remarks'],
        },
        parameters: {
          value: [],
          type: 'list',
          lookUpType: 'contains',
          label: 'dataset.parameters',
          fields: ['parameter_index_list'],
        },
      },
      allIds: ['name', 'owner', 'date', 'remarks'],
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
  resetDatasetFilters({ commit, dispatch }) {
    commit('RESET_FILTERS')
    dispatch('globalSearch/resetGlobalSearchFilters', null, { root: true })
  },
  async quickSearchDatasets(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const datasetResponse = await this.$services.sarvSolr.getResourceList(
      'dataset',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(DATASET.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', datasetResponse.items)
    commit('SET_COUNT', datasetResponse.count)
  },
  async searchDatasets(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const datasetResponse = await this.$services.sarvSolr.getResourceList(
      'dataset',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(DATASET.queryFields),
        searchFilters: {
          ...state.filters.byIds,
          ...rootState.globalSearch.filters.byIds,
        },
      }
    )
    commit('SET_ITEMS', datasetResponse.items)
    commit('SET_COUNT', datasetResponse.count)
  },
}
