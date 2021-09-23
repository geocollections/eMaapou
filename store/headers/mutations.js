import { UPDATE_HEADERS, RESET_HEADERS } from '../mutation_types'

export default {
  [UPDATE_HEADERS](state, { module, headers }) {
    state[module] = headers
  },
  [RESET_HEADERS](state, { module }) {},
}
