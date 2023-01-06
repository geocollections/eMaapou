import { updateField } from 'vuex-map-fields'

import { searchModuleMutations } from '../mutations'
import { ImageFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<ImageFilters>(),
}
