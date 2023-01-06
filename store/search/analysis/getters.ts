import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { AnalysisFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<AnalysisFilters>(),
}
