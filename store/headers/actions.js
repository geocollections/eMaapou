import { RESET_HEADERS, UPDATE_HEADERS } from '../mutation_types'

export default {
  updateHeaders({ commit }, { module, headers }) {
    commit(UPDATE_HEADERS, { module, headers })
  },
  async resetHeaders({ commit }, { module }) {
    const { initState } = await import(`./state.js`)

    const initHeaders = initState()[module]

    commit(RESET_HEADERS, { module, initHeaders })
  },
}
