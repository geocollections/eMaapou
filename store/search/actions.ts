import { actionTree } from 'typed-vuex'

import state from './state'
import getters, { searchModuleGetterTree } from './getters'
import mutations, { searchModuleMutationTree } from './mutations'
import { SearchModuleState } from './types'
import { Filter } from '~/types/filters'

export const searchModuleActionTree = <F extends { [K: string]: Filter }>({
  state,
  mutations,
  getters,
}: {
  state: () => SearchModuleState<F>
  mutations: ReturnType<typeof searchModuleMutationTree>
  getters: ReturnType<typeof searchModuleGetterTree>
}) =>
  actionTree(
    { state, mutations, getters },
    {
      async resetFilters({ commit, state }): Promise<void> {
        const { initState } = await import(`/${state.name}/state`)

        const initStateObj = initState()
        commit('RESET_MODULE_QUERY', { initQuery: initStateObj.query })
        commit('RESET_MODULE_FILTERS', { initFilters: initStateObj.filters })
        commit('RESET_MODULE_OPTIONS', { initOptions: initStateObj.options })

        this.app.$accessor.search.RESET_INSTITUTIONS()
      },
      setFilterValue({ commit }, { key, value }: { key: keyof F; value: any }) {
        commit('SET_MODULE_FILTER_VALUE', { key: key as string, value })
      },
      setQuery({ commit }, newQuery) {
        commit('SET_MODULE_QUERY', { query: newQuery ?? '' })
      },
    }
  )
export default actionTree(
  { state, getters, mutations },
  {
    setInstitutionsFilter({ commit }, newInstitutions) {
      commit('SET_GLOBAL_FILTER_VALUE', {
        key: 'institutions',
        value: newInstitutions,
      })
    },
  }
)
