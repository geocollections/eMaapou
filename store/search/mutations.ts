import { updateField } from 'vuex-map-fields'
import { mutationTree } from 'typed-vuex'
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
import state from './state'
import { SearchModuleState } from './types'
import { IOptions } from '~/services'

export const searchModuleMutations = {
  [SET_MODULE_ITEMS](state: SearchModuleState, { items }: { items: any[] }) {
    state.items = items
  },
  [SET_MODULE_COUNT](state: SearchModuleState, { count }: { count: number }) {
    state.count = count
  },
  [SET_MODULE_OPTIONS](
    state: SearchModuleState,
    { options }: { options: IOptions }
  ) {
    state.options = options
  },
  SET_MODULE_QUERY(state: SearchModuleState, { query }: { query: string }) {
    state.query = query
  },
  SET_MODULE_FILTER_VALUE(
    state: SearchModuleState,
    { key, value }: { key: string; value: any }
  ) {
    state.filters.byIds[key].value = value
  },
  [RESET_MODULE_QUERY](
    state: SearchModuleState,
    { initQuery }: { initQuery: string }
  ) {
    state.query = initQuery
  },
  [RESET_MODULE_FILTERS](
    state: SearchModuleState,
    { initFilters }: { initFilters: SearchModuleState['filters'] }
  ) {
    state.filters = initFilters
  },
  [RESET_MODULE_OPTIONS](
    state: SearchModuleState,
    { initOptions }: { initOptions: SearchModuleState['options'] }
  ) {
    state.options = {
      ...state.options,
      page: initOptions.page,
    }
  },
}

export default mutationTree(state, {
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
})
