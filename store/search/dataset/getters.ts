import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { DatasetFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<DatasetFilters>(),
}
