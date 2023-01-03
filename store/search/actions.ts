import { actionTree } from 'typed-vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'

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
