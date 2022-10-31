import { updateField } from 'vuex-map-fields'
import {
  RESET_GEOJSON,
  RESET_INSTITUTIONS,
  RESET_MODULE_OPTIONS,
  RESET_MODULE_FILTERS,
  RESET_MODULE_QUERY,
  RESET_QUERY,
  SET_MODULE_COUNT,
  SET_MODULE_ITEMS,
  SET_MODULE_OPTIONS,
} from '../mutation_types'

export const searchModuleMutations = {
  [SET_MODULE_ITEMS](state, { items }) {
    state.items = items
  },
  [SET_MODULE_COUNT](state, { count }) {
    state.count = count
  },
  [SET_MODULE_OPTIONS](state, { options }) {
    state.options = options
  },
  [RESET_MODULE_QUERY](state, { initQuery }) {
    state.query = initQuery
  },
  [RESET_MODULE_FILTERS](state, { initFilters }) {
    state.filters = initFilters
  },
  [RESET_MODULE_OPTIONS](state, { initOptions }) {
    state.options = {
      ...state.options,
      page: initOptions.page,
    }
  },
}

export default {
  updateField,
  [SET_MODULE_ITEMS](state, { module, items }) {
    state[module].items = items
  },
  [SET_MODULE_COUNT](state, { module, count }) {
    state[module].count = count
  },
  [SET_MODULE_OPTIONS](state, { module, options }) {
    state[module].options = options
  },
  [RESET_MODULE_QUERY](state, { module, initQuery }) {
    state[module].query = initQuery
  },
  [RESET_MODULE_FILTERS](state, { module, initFilters }) {
    state[module].filters = initFilters
  },
  [RESET_MODULE_OPTIONS](state, { module, initOptions }) {
    state[module].options = {
      ...state[module].options,
      page: initOptions.page,
    }
  },
  [RESET_INSTITUTIONS](state) {
    state.globalFilters.byIds.institutions.value = []
  },
  [RESET_GEOJSON](state) {
    state.globalFilters.byIds.geoJSON.value = null
  },
  [RESET_QUERY](state) {
    state.query = ''
  },
}
