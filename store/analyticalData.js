import { getField, updateField } from 'vuex-map-fields'
import { ANALYTICAL_DATA } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: ANALYTICAL_DATA.options,
    filters: {
      byIds: {
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.locality',
          fields: ['locality', 'locality_id_s', 'site', 'site_id_s'],
        },
        depth: {
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: 'analyticalData.depth',
          placeholders: ['analyticalData.depthMin', 'analyticalData.depthMin'],
          fields: ['depth', 'depth_interval'],
        },
        stratigraphy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'contains',
          label: 'analyticalData.stratigraphy',
          fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
        },
        lithostratigraphy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'contains',
          label: 'analyticalData.lithostratigraphy',
          fields: ['lithostratigraphy_hierarchy'],
        },
        analysis: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.analysis',
          fields: ['id'],
        },
        method: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.method',
          fields: ['analysis_method', 'analysis_method_en', 'method_details'],
        },
        reference: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.reference',
          fields: ['reference', 'reference_id_s'],
        },
        dataset: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.dataset',
          fields: ['dataset_name', 'dataset_id_s'],
        },
        stratigraphyBed: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.stratigraphyBed',
          fields: [
            'stratigraphy',
            'stratigraphy_en',
            'stratigraphy_id_s',
            'lithostratigraphy',
            'lithostratigraphy_en',
            'lithostratigraphy_id_s',
          ],
        },
        rock: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.rock',
          fields: ['rock', 'rock_en', 'rock_txt', 'rock_en_txt', 'rock_id_s'],
        },
        sample: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.sample',
          fields: ['sample_id_s', 'sample_number', 'sample_type'],
        },
      },
      allIds: [
        'stratigraphy',
        'lithostratigraphy',
        'method',
        'reference',
        'dataset',
        'stratigraphyBed',
        'rock',
        'sample',
      ],
    },
    listParameters: [],
    activeListParameters: [],
    shownActiveListParameters: [],
    tableHeaders: [
      {
        text: 'analyticalData.id',
        value: 'id_l',
        translate: true,
      },
      {
        text: 'analyticalData.analysisMethod',
        value: 'analysis_method',
        translate: true,
      },
      {
        text: 'analyticalData.sample',
        value: 'sample_number',
        translate: true,
      },
      { text: 'analyticalData.locality', value: 'locality', translate: true },
      {
        text: 'analyticalData.stratigraphy',
        value: 'stratigraphy',
        translate: true,
      },

      { text: 'analyticalData.depth', value: 'depth', translate: true },
      // {
      //   text: 'analyticalData.depthInterval',
      //   value: 'depth_interval',
      //   translate: true,
      // },
      {
        text: 'analyticalData.rock',
        value: 'rock',
        translate: true,
      },
      {
        text: 'analyticalData.reference',
        value: 'reference',
        translate: true,
      },
      {
        text: 'analyticalData.dataset',
        value: 'dataset_id',
        translate: true,
      },
      {
        text: 'analyticalData.analysis',
        value: 'analysis_id',
        translate: true,
      },
    ],
  }
}

export const state = () => getDefaultState()

export const getters = {
  getField,
  distinctListParameters: (state) => (mustSeeParam) => {
    if (state.listParameters && state.listParameters.length > 0) {
      const distinctList = state.listParameters.filter(
        (param) => !state.activeListParameters.includes(param)
      )
      return [mustSeeParam, ...distinctList]
    } else return [mustSeeParam]
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
  SET_LIST_PARAMETERS(state, parameters) {
    state.listParameters = parameters
  },
  UPDATE_ANALYTICAL_DATA_HEADERS(state, listOfNewHeaders) {
    const ANALYTICAL_DATA_HEADERS_DEFAULT_LENGTH = 9
    if (state.tableHeaders.length > ANALYTICAL_DATA_HEADERS_DEFAULT_LENGTH)
      state.tableHeaders.length = ANALYTICAL_DATA_HEADERS_DEFAULT_LENGTH

    if (listOfNewHeaders && listOfNewHeaders.length > 0) {
      listOfNewHeaders = listOfNewHeaders.map((item) => {
        return {
          text: item.parameter,
          value: item.parameter_index,
          align: 'center',
          translate: false,
        }
      })
    }

    state.tableHeaders = [...state.tableHeaders, ...listOfNewHeaders]
  },
  SET_SHOWN_ACTIVE_LIST_PARAMETERS(state, list) {
    state.shownActiveListParameters = list
  },
  INIT_ACTIVE_LIST_PARAMETERS(state, parameters) {
    state.activeListParameters = parameters
  },
  ADD_ACTIVE_LIST_PARAMETER(state) {
    const LIST_PARAMETERS = state.listParameters.map(
      (item) => item.parameter_index
    )
    const ACTIVE_LIST_PARAMETERS = state.activeListParameters.map(
      (item) => item.parameter_index
    )

    const nextUniqueParam = LIST_PARAMETERS.find(
      (param) => !ACTIVE_LIST_PARAMETERS.includes(param)
    )

    const nextUniqueParamObject = state.listParameters.find(
      (item) => item.parameter_index === nextUniqueParam
    )

    if (nextUniqueParamObject) {
      state.activeListParameters = [
        ...state.activeListParameters,
        nextUniqueParamObject,
      ]
    }
  },

  REMOVE_ACTIVE_LIST_PARAMETER(state, index) {
    state.activeListParameters.splice(index, 1)
  },
  UPDATE_ACTIVE_LIST_PARAMETERS(state, payload) {
    state.activeListParameters.splice(payload.indexToReplace, 1, payload.event)
  },
  UPDATE_ACTIVE_PARAM(state, payload) {
    if (state.filters.byIds?.[payload.key]) {
      state.filters.byIds[payload.key].value = payload.value
      state.activeListParameters.find(
        (item) => item.parameter_index === payload.key
      ).value = payload.value
    }
  },
  UPDATE_ACTIVE_LIST_PARAMETERS_FILTERS(state, newFilters) {
    state.filters = {
      byIds: { ...state.filters.byIds, ...newFilters },
      allIds: Object.keys(state.filters.byIds),
    }
  },
  REMOVE_ACTIVE_LIST_PARAMETER_FILTER(state, filterName) {
    if (filterName) {
      const index = state.filters.allIds.indexOf(filterName)
      if (state.filters.byIds[filterName])
        delete state.filters.byIds[filterName]
      if (index !== -1) state.filters.allIds.splice(index, 1)
    }
  },
}

export const actions = {
  resetAnalyticalDataFilters({ state, commit, dispatch }) {
    commit('RESET_FILTERS')
    dispatch('setListParameters', state.listParameters, true)
  },
  async quickSearchAnalyticalData(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const analyticalDataResponse = await this.$services.sarvSolr.getResourceList(
      'analytical_data',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(ANALYTICAL_DATA.queryFields),
        searchFilters: {},
      }
    )
    commit('SET_ITEMS', analyticalDataResponse.items)
    commit('SET_COUNT', analyticalDataResponse.count)
  },
  async searchAnalyticalData(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const analyticalDataResponse = await this.$services.sarvSolr.getResourceList(
      'analytical_data',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(ANALYTICAL_DATA.queryFields),
        searchFilters: state.filters.byIds,
      }
    )
    commit('SET_ITEMS', analyticalDataResponse.items)
    commit('SET_COUNT', analyticalDataResponse.count)
  },
  setListParameters({ commit, dispatch }, parameters, reset = false) {
    if (reset) {
      commit('SET_LIST_PARAMETERS', parameters)
      dispatch('initActiveListParameters', parameters)
    } else if (parameters && parameters.length > 0) {
      parameters = parameters.map((item) => {
        // Todo: Check if text field or not
        // Todo: Check: '/' -> 31, '%' -> 199, 'ppm' -> 61, '‰' -> 6, '[grains]' -> 2; TOTAL: 299/347
        return {
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: item.parameter,
          placeholders: ['common.from', 'common.to'],
          parameter: item.parameter,
          parameter_index: item.parameter_index,
          fields: [item.parameter_index],
          isText: false,
        }
      })
      commit('SET_LIST_PARAMETERS', parameters)
      dispatch('initActiveListParameters', parameters)
    }
  },
  updateAnalyticalDataHeaders({ commit, dispatch }, value) {
    commit('UPDATE_ANALYTICAL_DATA_HEADERS', value)
    dispatch('setShownActiveListParameters', value)
  },
  setShownActiveListParameters({ commit }, list) {
    commit('SET_SHOWN_ACTIVE_LIST_PARAMETERS', list)
  },
  initActiveListParameters({ commit, dispatch }, parameters) {
    // Ag, Au, U
    // CaO, MgO, SiO, Al2O3
    const DEFAULT_PARAMETERS = [
      parameters[24],
      parameters[109],
      parameters[163],
      parameters[1],
    ]

    commit('INIT_ACTIVE_LIST_PARAMETERS', DEFAULT_PARAMETERS)
    dispatch('updateAnalyticalDataHeaders', DEFAULT_PARAMETERS)
    dispatch('addActiveListParameterToFilters', DEFAULT_PARAMETERS)
  },
  updateActiveListParameters({ state, commit, dispatch }, payload) {
    if (
      payload.event &&
      payload.keyToReplace !== payload.event.parameter_index
    ) {
      commit('UPDATE_ACTIVE_LIST_PARAMETERS', payload)
      dispatch('updateAnalyticalDataHeaders', state.activeListParameters)

      dispatch('addActiveListParameterToFilters', state.activeListParameters)
      dispatch('removeActiveListParameterFromFilters', payload.keyToReplace)
    }
  },
  addActiveListParameter({ state, commit, dispatch }) {
    if (state.activeListParameters && state.activeListParameters.length < 10) {
      commit('ADD_ACTIVE_LIST_PARAMETER')
      dispatch('updateAnalyticalDataHeaders', state.activeListParameters)
      dispatch('addActiveListParameterToFilters', state.activeListParameters)
    }
  },

  removeActiveListParameter({ state, commit, dispatch }, payload) {
    if (state.activeListParameters && state.activeListParameters.length >= 2) {
      commit('REMOVE_ACTIVE_LIST_PARAMETER', payload.index)
      dispatch('updateAnalyticalDataHeaders', state.activeListParameters)
      dispatch('removeActiveListParameterFromFilters', payload.filterName)
    }
  },

  addActiveListParameterToFilters({ state, commit }, activeListParameters) {
    const newFilters = Object.entries(activeListParameters).reduce(
      (prev, [k, v]) => {
        if (!state.filters.allIds.includes(v.parameter_index))
          return { ...prev, [v.parameter_index]: v }
        else return prev
      },
      {}
    )
    commit('UPDATE_ACTIVE_LIST_PARAMETERS_FILTERS', newFilters)
  },

  removeActiveListParameterFromFilters({ commit }, filterName) {
    commit('REMOVE_ACTIVE_LIST_PARAMETER_FILTER', filterName)
  },

  updateActiveParam({ commit }, payload) {
    commit('UPDATE_ACTIVE_PARAM', payload)
  },
}
