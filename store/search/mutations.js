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
  SET_MODULE_QUERY(state, { query }) {
    state.query = query
  },
  SET_MODULE_FILTER_VALUE(state, { key, value }) {
    state.filters.byIds[key].value = value
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
  SET_GLOBAL_FILTER_VALUE(state, { key, value }) {
    state.globalFilters.byIds[key].value = value
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
