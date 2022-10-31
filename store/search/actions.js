import {
  RESET_GEOJSON,
  RESET_INSTITUTIONS,
  RESET_MODULE_OPTIONS,
  RESET_MODULE_FILTERS,
  RESET_MODULE_QUERY,
} from '../mutation_types'

export default {
  async resetFilters({ commit }, module) {
    const { initState } = await import(`/${module}/state`)

    const initStateObj = initState()

    commit(RESET_MODULE_QUERY, { module, initQuery: initStateObj.query })
    commit(RESET_MODULE_FILTERS, { module, initFilters: initStateObj.filters })
    commit(RESET_MODULE_OPTIONS, { module, initOptions: initStateObj.options })

    commit(RESET_GEOJSON)
    commit(RESET_INSTITUTIONS)
  },
}
