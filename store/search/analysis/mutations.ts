import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { AnalysisFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<AnalysisFilters>(),
}
