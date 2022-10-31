import { updateField } from 'vuex-map-fields'

import { searchModuleMutations } from '../mutations'
export default {
  updateField,
  ...searchModuleMutations,
}
