import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { DrillcoreFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<DrillcoreFilters>(),
}
