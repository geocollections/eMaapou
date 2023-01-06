import { searchModuleActions } from '../moduleActions'
import { PreparationFilters } from './state'

export default {
  ...searchModuleActions<PreparationFilters>(),
}
