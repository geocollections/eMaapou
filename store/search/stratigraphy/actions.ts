import { searchModuleActions } from '../moduleActions'
import { StratigraphyFilters } from './state'

export default {
  ...searchModuleActions<StratigraphyFilters>(),
}
