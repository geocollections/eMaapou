import { updateField } from 'vuex-map-fields'
import Vue from 'vue'
import {
  UPDATE_PARAMETER,
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
  updateField,
  [UPDATE_PARAMETER](state, payload) {
    Vue.set(state.activeListParameters, payload.index, payload.parameter)
  },
  [SET_LIST_PARAMETERS](state, parameters) {
    state.listParameters = parameters
  },
  [UPDATE_ANALYTICAL_DATA_HEADERS](state, listOfNewHeaders) {
    const ANALYTICAL_DATA_HEADERS_DEFAULT_LENGTH = 9
    if (state.tableHeaders.length > ANALYTICAL_DATA_HEADERS_DEFAULT_LENGTH)
      state.tableHeaders.length = ANALYTICAL_DATA_HEADERS_DEFAULT_LENGTH

    if (listOfNewHeaders && listOfNewHeaders.length > 0) {
      listOfNewHeaders = listOfNewHeaders.map((item) => {
        return {
          text: item.label,
          value: item.id,
          align: 'center',
          translate: false,
        }
      })
    }

    state.tableHeaders = [...state.tableHeaders, ...listOfNewHeaders]
  },
  [SET_SHOWN_ACTIVE_LIST_PARAMETERS](state, list) {
    state.shownActiveListParameters = list
  },
  [INIT_ACTIVE_LIST_PARAMETERS](state, parameters) {
    state.activeListParameters = parameters
  },
  [ADD_ACTIVE_LIST_PARAMETER](state) {
    const LIST_PARAMETERS = state.listParameters.map((item) => item.id)
    const ACTIVE_LIST_PARAMETERS = state.activeListParameters.map(
      (item) => item.id
    )
    const nextUniqueParam = LIST_PARAMETERS.find(
      (param) => !ACTIVE_LIST_PARAMETERS.includes(param)
    )
    const nextUniqueParamObject = state.listParameters.find(
      (item) => item.id === nextUniqueParam
    )

    if (nextUniqueParamObject) {
      state.activeListParameters = [
        ...state.activeListParameters,
        nextUniqueParamObject,
      ]
    }
  },
  [REMOVE_ACTIVE_LIST_PARAMETER](state, index) {
    state.activeListParameters.splice(index, 1)
  },
  [UPDATE_ACTIVE_LIST_PARAMETERS](state, payload) {
    state.activeListParameters.splice(payload.index, 1, payload.parameter)
  },
  [UPDATE_ACTIVE_PARAM](state, payload) {
    if (state.filters.byIds?.[payload.keyToReplace]) {
      state.filters.byIds[payload.keyToReplace].value = payload.parameter.value
      state.activeListParameters.find(
        (item) => item.id === payload.keyToReplace
      ).value = payload.parameter.value
    }
  },
  [UPDATE_ACTIVE_LIST_PARAMETERS_FILTERS](state, newFilters) {
    const byIds = { ...state.filters.byIds, ...newFilters }
    state.filters = {
      byIds,
      allIds: Object.keys(byIds),
    }
  },
  [REMOVE_ACTIVE_LIST_PARAMETER_FILTER](state, filterName) {
    if (filterName) {
      const index = state.filters.allIds.indexOf(filterName)
      if (state.filters.byIds[filterName])
        delete state.filters.byIds[filterName]
      if (index !== -1) state.filters.allIds.splice(index, 1)
    }
  },
}
