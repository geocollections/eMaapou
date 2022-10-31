import { getField } from 'vuex-map-fields'
import { searchModuleGetters } from '../getters'

export default {
  getField,
  ...searchModuleGetters,
}
