import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { LocalityFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<LocalityFilters>(),
}
