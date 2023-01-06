import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { SampleFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<SampleFilters>(),
}
