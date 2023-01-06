import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { StratigraphyFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<StratigraphyFilters>(),
}
