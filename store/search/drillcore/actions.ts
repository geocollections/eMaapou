import { searchModuleActions } from '../moduleActions'
import { DrillcoreFilters } from './state'

export default {
  ...searchModuleActions<DrillcoreFilters>(),
}
