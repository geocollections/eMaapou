import { updateField } from 'vuex-map-fields'
import Vue from 'vue'

import {
  SET_PARAMETERS,
  ADD_PARAMETER_FILTER,
  UPDATE_PARAMETER_FILTER,
  REMOVE_PARAMETER_FILTER,
} from '~/store/mutation_types'

export default {
  updateField,
  [SET_PARAMETERS](state, parameters) {
    state.parameters = parameters
  },
  [ADD_PARAMETER_FILTER](state, filter) {
    Vue.set(state.parameterFilters.byIds, filter.id, filter)
    state.parameterFilters.allIds = [
      ...state.parameterFilters.allIds,
      filter.id,
    ]
  },
  [UPDATE_PARAMETER_FILTER](state, { id, filter }) {
    Vue.set(state.parameterFilters.byIds, id, filter)
  },
  [REMOVE_PARAMETER_FILTER](state, removeId) {
    state.parameterFilters.allIds = state.parameterFilters.allIds.filter(
      (id) => id !== removeId
    )
    Vue.delete(state.parameterFilters.byIds, removeId)
  },
}
