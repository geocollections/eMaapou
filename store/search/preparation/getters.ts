import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { PreparationFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<PreparationFilters>(),
}
