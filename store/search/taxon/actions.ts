import { searchModuleActions } from '../moduleActions'
import { TaxonFilters } from './state'

export default {
  ...searchModuleActions<TaxonFilters>(),
}
