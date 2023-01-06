import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { SampleFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<SampleFilters>(),
}
