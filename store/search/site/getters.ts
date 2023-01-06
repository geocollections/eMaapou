import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { SiteFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<SiteFilters>(),
}
