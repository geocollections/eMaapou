import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { AreaFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<AreaFilters>(),
}
