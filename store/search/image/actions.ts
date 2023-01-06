import { searchModuleActions } from '../moduleActions'
import { ImageFilters } from './state'

export default {
  ...searchModuleActions<ImageFilters>(),
}
