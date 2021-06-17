import { ANALYTICAL_DATA } from '~/constants'

import {
  SET_LIST_PARAMETERS,
  UPDATE_ANALYTICAL_DATA_HEADERS,
  SET_SHOWN_ACTIVE_LIST_PARAMETERS,
  INIT_ACTIVE_LIST_PARAMETERS,
  ADD_ACTIVE_LIST_PARAMETER,
  REMOVE_ACTIVE_LIST_PARAMETER,
  UPDATE_ACTIVE_LIST_PARAMETERS,
  UPDATE_ACTIVE_PARAM,
  UPDATE_ACTIVE_LIST_PARAMETERS_FILTERS,
  REMOVE_ACTIVE_LIST_PARAMETER_FILTER,
} from '~/store/mutation_types'

export default {
  async searchAnalyticalData({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'analytical_data',
        resource: 'analytical_data',
        resourceDefaults: ANALYTICAL_DATA,
      },
      { root: true }
    )
  },
  setListParameters({ commit, dispatch }, { parameters, reset }) {
    if (reset) {
      parameters = parameters.map((item) => {
        return { ...item, value: [null, null] }
      })
    } else if (parameters && parameters.length > 0) {
      parameters = parameters.map((item) => {
        // Todo: Check if text field or not
        // Todo: Check: '/' -> 31, '%' -> 199, 'ppm' -> 61, '‰' -> 6, '[grains]' -> 2; TOTAL: 299/347
        return {
          id: item.parameter_index,
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: item.parameter,
          placeholders: ['common.from', 'common.to'],
          fields: [item.parameter_index],
          isText: false,
        }
      })
    }
    commit(SET_LIST_PARAMETERS, parameters)
    dispatch('initActiveListParameters', parameters)
  },
  updateAnalyticalDataHeaders({ commit, dispatch }, value) {
    commit(UPDATE_ANALYTICAL_DATA_HEADERS, value)
    dispatch('setShownActiveListParameters', value)
  },
  setShownActiveListParameters({ commit }, list) {
    commit(SET_SHOWN_ACTIVE_LIST_PARAMETERS, list)
  },
  initActiveListParameters({ commit, dispatch }, parameters) {
    // CaO, MgO, SiO2, Al2O3
    const DEFAULT_PARAMETERS = [
      parameters.find((param) => param.id === 'Ca_pct'),
      parameters.find((param) => param.id === 'MgO_pct'),
      parameters.find((param) => param.id === 'SiO2_pct'),
      parameters.find((param) => param.id === 'Al2O3_pct'),
    ]

    commit(INIT_ACTIVE_LIST_PARAMETERS, DEFAULT_PARAMETERS)
    dispatch('updateAnalyticalDataHeaders', DEFAULT_PARAMETERS)
    dispatch('addActiveListParameterToFilters', DEFAULT_PARAMETERS)
  },
  updateActiveListParameters({ state, commit, dispatch }, payload) {
    if (payload.parameter && payload.keyToReplace !== payload.parameter.id) {
      commit(UPDATE_ACTIVE_LIST_PARAMETERS, payload)
      dispatch('updateAnalyticalDataHeaders', state.activeListParameters)

      dispatch('addActiveListParameterToFilters', state.activeListParameters)
      dispatch('removeActiveListParameterFromFilters', payload.keyToReplace)
    }
    if (payload.keyToReplace === payload.parameter.id) {
      dispatch('updateActiveParam', payload)
    }
  },
  addActiveListParameter({ state, commit, dispatch }) {
    commit(ADD_ACTIVE_LIST_PARAMETER)
    dispatch('updateAnalyticalDataHeaders', state.activeListParameters)
    dispatch('addActiveListParameterToFilters', state.activeListParameters)
  },
  removeActiveListParameter({ state, commit, dispatch }, payload) {
    commit(REMOVE_ACTIVE_LIST_PARAMETER, payload.index)
    dispatch('updateAnalyticalDataHeaders', state.activeListParameters)
    dispatch('removeActiveListParameterFromFilters', payload.filterName)
  },
  addActiveListParameterToFilters({ state, commit }, parameters) {
    const newFilters = Object.entries(parameters).reduce((prev, [k, v]) => {
      if (!state.filters.allIds.includes(v.id)) return { ...prev, [v.id]: v }
      else return prev
    }, {})
    commit(UPDATE_ACTIVE_LIST_PARAMETERS_FILTERS, newFilters)
  },
  removeActiveListParameterFromFilters({ commit }, filterName) {
    commit(REMOVE_ACTIVE_LIST_PARAMETER_FILTER, filterName)
  },
  updateActiveParam({ commit }, payload) {
    commit(UPDATE_ACTIVE_PARAM, payload)
  },
}
