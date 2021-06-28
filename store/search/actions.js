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
  async resetFilters({ commit }, module) {
    const { initState } = await import(`/${module}/state.js`)
    commit(RESET_MODULE_FILTERS, { module, initState: initState() })

    commit(RESET_SEARCH_QUERY)
    commit(RESET_GEOJSON)
    commit(RESET_INSTITUTIONS)
  },
  async searchResource(
    { commit, state },
    {
      resource,
      resourceDefaults,
      module,
      useMap = state[module].useMap,
      useInstitutions = state[module].useInstitutions,
      options = { ...state[module].options, page: 1 },
    }
  ) {
    commit(SET_MODULE_OPTIONS, { module, options })

    const globalFilters = {
      ...(useMap && { geoJSON: state.globalFilters.byIds.geoJSON }),
      ...(useInstitutions && {
        institutions: state.globalFilters.byIds.institutions,
      }),
    }

    const moduleFilters = {
      ...state[module].filters.byIds,
    }
    // NOTE: Right now the geom filter has to be in the last position
    // else the search will not work correctly when drawing circle on map.
    // This can be seen if the globalFilters object is moved above the other filters .
    // This could become a problem another global filter is added after geom filter.
    // The result should not depend on the order of the filters.
    const response = await this.$services.sarvSolr.getResourceList(resource, {
      options,
      search: state.searchQuery,
      queryFields: this.$getQueryFields(resourceDefaults.queryFields),
      searchFilters: {
        ...moduleFilters,
        ...state[module].persistantFilters,
        ...globalFilters,
      },
    })
    commit(SET_MODULE_ITEMS, { module, items: response.items })
    commit(SET_MODULE_COUNT, { module, count: response.count })
  },
}
