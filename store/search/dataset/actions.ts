import { searchModuleActionTree } from '../actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
export default searchModuleActionTree({ initState: state, mutations, getters })
