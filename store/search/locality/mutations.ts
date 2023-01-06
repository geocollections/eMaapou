import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { LocalityFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<LocalityFilters>(),
}
