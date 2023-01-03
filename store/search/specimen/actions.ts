import { actionTree } from 'typed-vuex'
import { searchModuleActions } from '../moduleActions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
export default actionTree(
  { state, getters, mutations },
  {
    ...searchModuleActions,
  }
)
