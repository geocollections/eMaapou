import { UPDATE_HEADERS } from '../mutation_types'

export default {
  updateHeaders({ commit }, { module, headers }) {
    commit(UPDATE_HEADERS, { module, headers })
  },
}
