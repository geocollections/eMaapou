import { searchModuleActions } from '../moduleActions'
import { LocalityFilters } from './state'

export default {
  ...searchModuleActions<LocalityFilters>(),
}
