import { updateField } from 'vuex-map-fields'
import { mutationTree } from 'typed-vuex'
import { searchModuleMutations } from '../mutations'
import state, { TaxonFilters } from './state'
export default mutationTree(state, {
  updateField,
  ...searchModuleMutations<TaxonFilters>(),
})
