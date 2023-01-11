import { getField } from 'vuex-map-fields'
import { searchModuleGetterTree } from '../getters'
import state from './state'
export default { getField, ...searchModuleGetterTree(state) }
