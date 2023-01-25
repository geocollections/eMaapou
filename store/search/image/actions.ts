import {actionTree} from 'typed-vuex'
import { searchModuleActionTree } from '../actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
export default {
  ...searchModuleActionTree({ state, getters, mutations }),
  ...actionTree(
    {state, getters, mutations},
    {
      setView({commit}, view) {
        commit('SET_VIEW', view)
      }
    }
  )
}
