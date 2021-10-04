import { RESET_HEADERS, TOGGLE_HEADER } from '../mutation_types'

export default {
  toggleHeader({ commit }, { module, headerId }) {
    commit(TOGGLE_HEADER, { module, headerId })
  },
  async resetHeaders({ commit }, { module }) {
    const { initState } = await import(`./state.js`)

    const initHeaders = initState()[module]

    commit(RESET_HEADERS, { module, initHeaders })
  },
}
