import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { StratigraphyFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<StratigraphyFilters>(),
}
