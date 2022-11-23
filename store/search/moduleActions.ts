import { ActionContext } from 'vuex'
import {
  RESET_GEOJSON,
  RESET_INSTITUTIONS,
  RESET_MODULE_OPTIONS,
  RESET_MODULE_FILTERS,
  RESET_MODULE_QUERY,
} from '../mutation_types'
import { SearchModuleState } from './types'

export const searchModuleActions = {
  async resetFilters({ commit, state }: ActionContext<SearchModuleState, any>) {
    const { initState } = await import(`/${state.name}/state`)

    const initStateObj = initState()

    commit(RESET_MODULE_QUERY, { initQuery: initStateObj.query })
    commit(RESET_MODULE_FILTERS, { initFilters: initStateObj.filters })
    commit(RESET_MODULE_OPTIONS, { initOptions: initStateObj.options })

    commit(`search/${RESET_GEOJSON}`, null, { root: true })
    commit(`search/${RESET_INSTITUTIONS}`, null, { root: true })
  },
}
