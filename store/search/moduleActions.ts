import { ActionContext } from 'vuex'
import {
  RESET_GEOJSON,
  RESET_INSTITUTIONS,
  RESET_MODULE_OPTIONS,
  RESET_MODULE_FILTERS,
  RESET_MODULE_QUERY,
} from '../mutation_types'
import { SearchModuleState } from './types'

export type SearchModuleActions<Filters extends string | number | symbol> = {
  resetFilters: (
    ctx: ActionContext<SearchModuleState<Filters>, any>
  ) => Promise<void>
  setFilterValue: (
    ctx: ActionContext<SearchModuleState<Filters>, any>,
    { key, value }: { key: Filters; value: any }
  ) => void
  setQuery: (
    ctx: ActionContext<SearchModuleState<Filters>, any>,
    newQuery: string
  ) => void
}

export const searchModuleActions = <
  T extends string | number | symbol
>(): SearchModuleActions<T> => ({
  async resetFilters({ commit, state }) {
    const { initState } = await import(`/${state.name}/state`)

    const initStateObj = initState()

    commit(RESET_MODULE_QUERY, { initQuery: initStateObj.query })
    commit(RESET_MODULE_FILTERS, { initFilters: initStateObj.filters })
    commit(RESET_MODULE_OPTIONS, { initOptions: initStateObj.options })

    commit(`search/${RESET_GEOJSON}`, null, { root: true })
    commit(`search/${RESET_INSTITUTIONS}`, null, { root: true })
  },
  setFilterValue({ commit }, { key, value }) {
    commit('SET_MODULE_FILTER_VALUE', { key, value })
  },
  setQuery({ commit }, newQuery) {
    commit('SET_MODULE_QUERY', { query: newQuery })
  },
})
