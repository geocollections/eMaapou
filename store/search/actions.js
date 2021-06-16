export default {
  resetFilters({ commit }, module) {
    const { initState } = import(`/${module}/state.js`)
    commit('RESET_MODULE_FILTERS', { module, defaultState: initState() })

    commit('RESET_SEARCH')
    commit('RESET_INSTITUTIONS')
    commit('RESET_GEOJSON')
  },
  async searchResource(
    { commit, rootState, state },
    {
      resource,
      resourceDefaults,
      module,
      isMapEnabled = false,
      isInsitutionsEnabled = false,
      options = { ...state[module].options, page: 1 },
    }
  ) {
    commit('SET_OPTIONS', { module, options })

    const additionalFilters = {
      ...(isMapEnabled && { geoJSON: state.filters.byIds.geoJSON }),
      ...(isInsitutionsEnabled && {
        institutions: state.filters.byIds.institutions,
      }),
    }
    const response = await this.$services.sarvSolr.getResourceList(resource, {
      options,
      search: state.searchQuery,
      queryFields: this.$getQueryFields(resourceDefaults.queryFields),
      searchFilters: { ...state[module].filters.byIds, ...additionalFilters },
    })
    commit('SET_ITEMS', { module, items: response.items })
    commit('SET_COUNT', { module, count: response.count })
  },
}
