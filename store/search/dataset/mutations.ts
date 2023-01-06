import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { DatasetFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<DatasetFilters>(),
}
