import { updateField } from 'vuex-map-fields'
import { searchModuleMutations } from '../mutations'
import { SiteFilters } from './state'
export default {
  updateField,
  ...searchModuleMutations<SiteFilters>(),
}
