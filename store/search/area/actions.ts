import { searchModuleActions } from '../moduleActions'
import { AreaFilters } from './state'

export default {
  ...searchModuleActions<AreaFilters>(),
}
