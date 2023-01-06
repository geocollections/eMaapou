import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { DrillcoreFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<DrillcoreFilters>(),
}
