import { searchModuleActionTree } from '../actions'
import state from './state'
import mutations from './mutations'
import getters from './getters'
export default searchModuleActionTree({ state, mutations, getters })
