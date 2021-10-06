import { RESET_HEADERS, SHOW_HEADER, TOGGLE_HEADER } from '../mutation_types'

export default {
  toggleHeader({ commit }, { module, headerId }) {
    commit(TOGGLE_HEADER, { module, headerId })
  },
  showHeader({ commit }, { module, headerId }) {
    commit(SHOW_HEADER, { module, headerId })
  },
  async resetHeaders({ commit, dispatch, rootState }, { module, options }) {
    let initHeaders

    if (module === 'analytical_data') {
      const { initState } = await import(`./analytical_data/state.js`)

      initHeaders = initState()
    } else {
      const { initState } = await import(`./state.js`)

      initHeaders = initState()[module]
    }

    commit(RESET_HEADERS, { module, initHeaders })

    if (module === 'analytical_data') {
      dispatch('analytical_data/addParameterHeaders', {
        parameters: rootState.search.analytical_data.parameters,
      })

      rootState.search.analytical_data.defaultParameters.forEach(
        (parameterId) => {
          dispatch('showHeader', { module, headerId: parameterId })
        }
      )
    }

    options.sortBy.forEach((headerId) => {
      dispatch('showHeader', { module, headerId })
    })
  },
}
