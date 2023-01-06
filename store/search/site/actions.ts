import { searchModuleActions } from '../moduleActions'
import { SiteFilters } from './state'

export default {
  ...searchModuleActions<SiteFilters>(),
}
