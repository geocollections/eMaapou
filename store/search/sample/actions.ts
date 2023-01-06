import { searchModuleActions } from '../moduleActions'
import { SampleFilters } from './state'

export default {
  ...searchModuleActions<SampleFilters>(),
}
