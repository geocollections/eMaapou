import { updateField } from 'vuex-map-fields'

import { searchModuleMutationTree } from '../mutations'
import state from './state'
export default { updateField, ...searchModuleMutationTree(state) }
