import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'
import { TaxonFilters } from './state'

export default {
  getField,
  ...searchModuleGetters<TaxonFilters>(),
}
