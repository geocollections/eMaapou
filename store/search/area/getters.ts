import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { AreaFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<AreaFilters>(),
}
