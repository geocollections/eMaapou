import { updateField } from 'vuex-map-fields'
import {
  RESET_GEOJSON,
  RESET_INSTITUTIONS,
  RESET_MODULE_FILTERS,
  RESET_SEARCH_QUERY,
  SET_MODULE_COUNT,
  SET_MODULE_ITEMS,
  SET_MODULE_OPTIONS,
} from '../mutation_types'

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
  [RESET_MODULE_FILTERS](state, { module, initState }) {
    state[module].filters = initState.filters
    state[module].options = {
      ...state[module].options,
      page: initState.options.page,
    }
  },
  [RESET_INSTITUTIONS](state) {
    state.globalFilters.byIds.institutions.value = []
  },
  [RESET_GEOJSON](state) {
    state.globalFilters.byIds.geoJSON.value = null
  },
  [RESET_SEARCH_QUERY](state) {
    state.searchQuery = ''
  },
}
