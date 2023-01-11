import { updateField } from 'vuex-map-fields'
import { mutationTree } from 'typed-vuex'
import {
  RESET_INSTITUTIONS,
  RESET_MODULE_OPTIONS,
  RESET_MODULE_FILTERS,
  RESET_MODULE_QUERY,
  RESET_QUERY,
  SET_MODULE_COUNT,
  SET_MODULE_ITEMS,
  SET_MODULE_OPTIONS,
} from '../mutation_types'
import state, { SearchState } from './state'
import { SearchModuleState } from './types'
import { IOptions } from '~/services'
import { Filter } from '~/types/filters'

export const searchModuleMutations = <
  Filters extends { [K: string]: Filter }
>() => ({
  [SET_MODULE_ITEMS](
    state: SearchModuleState<Filters>,
    { items }: { items: any[] }
  ) {
    state.items = items
  },
  [SET_MODULE_COUNT](
    state: SearchModuleState<Filters>,
    { count }: { count: number }
  ) {
    state.count = count
  },
  [SET_MODULE_OPTIONS](
    state: SearchModuleState<Filters>,
    { options }: { options: IOptions }
  ) {
    state.options = options
  },
  SET_MODULE_QUERY(
    state: SearchModuleState<Filters>,
    { query }: { query: string }
  ) {
    state.query = query
  },
  SET_MODULE_FILTER_VALUE(
    state: SearchModuleState<Filters>,
    { key, value }: { key: keyof Filters; value: any }
  ) {
    state.filters[key].value = value
  },
  [RESET_MODULE_QUERY](
    state: SearchModuleState<Filters>,
    { initQuery }: { initQuery: string }
  ) {
    state.query = initQuery
  },
  [RESET_MODULE_FILTERS](
    state: SearchModuleState<Filters>,
    { initFilters }: { initFilters: SearchModuleState<Filters>['filters'] }
  ) {
    state.filters = initFilters
  },
  [RESET_MODULE_OPTIONS](
    state: SearchModuleState<Filters>,
    { initOptions }: { initOptions: SearchModuleState<Filters>['options'] }
  ) {
    state.options = {
      ...state.options,
      page: initOptions.page,
    }
  },
})

export default mutationTree(state, {
  updateField,
  SET_GLOBAL_FILTER_VALUE(
    state,
    { key, value }: { key: keyof SearchState['globalFilters']; value: any }
  ) {
    state.globalFilters[key].value = value
  },
  [RESET_INSTITUTIONS](state) {
    state.globalFilters.institutions.value = []
  },
  [RESET_QUERY](state) {
    state.query = ''
  },
})
