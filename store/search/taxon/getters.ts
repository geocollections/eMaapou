import { searchModuleGetterTree } from '../getters'
import state, { TaxonFilters } from './state'
export default searchModuleGetterTree<TaxonFilters>(state)
