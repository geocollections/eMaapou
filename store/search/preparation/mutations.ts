import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { PreparationFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<PreparationFilters>(),
}
