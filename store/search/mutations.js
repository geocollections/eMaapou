import { updateField } from 'vuex-map-fields'

export default {
  updateField,
  SET_ITEMS(state, { module, items }) {
    state[module].items = items
  },
  SET_COUNT(state, { module, count }) {
    state[module].count = count
  },
  SET_OPTIONS(state, { module, options }) {
    state[module].options = options
  },
  RESET_MODULE_FILTERS(state, { module, defaultState }) {
    state[module].filters = defaultState.filters
    state[module].options = {
      ...state[module].options,
      page: defaultState.options.page,
    }
  },
  RESET_INSTITUTIONS(state) {
    state.filters.byIds.institutions = []
  },
  RESET_GEOJSON(state) {
    state.filters.byIds.geoJSON = null
  },
  RESET_SEARCH(state) {
    state.search = ''
  },
}
