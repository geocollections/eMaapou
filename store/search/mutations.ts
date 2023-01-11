import { updateField } from 'vuex-map-fields'
import { mutationTree } from 'typed-vuex'
import state, { SearchState } from './state'
import { SearchModuleState } from './types'
import { IOptions } from '~/services'
import { Filter } from '~/types/filters'

export const searchModuleMutationTree = <
  Filters extends { [K: string]: Filter }
>(
  state: () => SearchModuleState<Filters>
) => {
  return mutationTree(state, {
    SET_MODULE_ITEMS(state, { items }: { items: any[] }) {
      state.items = items
    },
    SET_MODULE_COUNT(state, { count }: { count: number }) {
      state.count = count
    },
    SET_MODULE_OPTIONS(state, { options }: { options: IOptions }) {
      state.options = options
    },
    SET_MODULE_QUERY(state, { query }: { query: string }) {
      state.query = query
    },
    SET_MODULE_FILTER_VALUE(
      state,
      { key, value }: { key: keyof Filters; value: any }
    ) {
      state.filters[key].value = value
    },
    RESET_MODULE_QUERY(state, { initQuery }: { initQuery: string }) {
      state.query = initQuery
    },
    RESET_MODULE_FILTERS(
      state,
      { initFilters }: { initFilters: SearchModuleState<Filters>['filters'] }
    ) {
      state.filters = initFilters
    },
    RESET_MODULE_OPTIONS(
      state,
      { initOptions }: { initOptions: SearchModuleState<Filters>['options'] }
    ) {
      state.options = {
        ...state.options,
        page: initOptions.page,
      }
    },
  })
}

export default mutationTree(state, {
  updateField,
  SET_GLOBAL_FILTER_VALUE(
    state,
    { key, value }: { key: keyof SearchState['globalFilters']; value: any }
  ) {
    state.globalFilters[key].value = value
  },
  RESET_INSTITUTIONS(state) {
    state.globalFilters.institutions.value = []
  },
  RESET_QUERY(state) {
    state.query = ''
  },
})
