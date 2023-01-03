import { getField } from 'vuex-map-fields'
import { getterTree } from 'typed-vuex'
import { searchModuleGetters } from '../getters'
import state from './state'

export default getterTree(state, {
  getField,
  ...searchModuleGetters,
})
