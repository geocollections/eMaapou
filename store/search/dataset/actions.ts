import { searchModuleActions } from '../moduleActions'
import { DatasetFilters } from './state'

export default {
  ...searchModuleActions<DatasetFilters>(),
}
