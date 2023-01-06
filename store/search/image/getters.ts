import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { ImageFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<ImageFilters>(),
}
