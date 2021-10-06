import {
  ADD_PARAMETER_HEADERS,
  RESET_HEADERS,
  SHOW_HEADER,
  TOGGLE_HEADER,
} from '../mutation_types'

export default {
  toggleHeader({ commit }, { module, headerId }) {
    commit(TOGGLE_HEADER, { module, headerId })
  },
  showHeader({ commit }, { module, headerId }) {
    commit(SHOW_HEADER, { module, headerId })
  },
  async resetHeaders({ commit, dispatch, rootState }, { module, options }) {
    const { initState } = await import(`./state.js`)

    const initHeaders = initState()[module]

    commit(RESET_HEADERS, { module, initHeaders })

    if (module === 'analytical_data') {
      dispatch('addParameterHeaders', {
        parameters: rootState.search.analytical_data.parameters,
      })

      Object.values(
        rootState.search.analytical_data.parameterFilters.byIds
      ).forEach((filter) => {
        dispatch('showHeader', { module, headerId: filter.fields[0] })
      })
    }

    options.sortBy.forEach((headerId) => {
      dispatch('showHeader', { module, headerId })
    })
  },
  addParameterHeaders({ commit }, { parameters }) {
    const parameterHeaders = Object.entries(parameters).reduce(
      (prev, [key, parameter]) => {
        return {
          ...prev,
          [key]: {
            text: parameter.label,
            value: parameter.id,
            align: 'center',
            translate: false,
            apiFieldValue: parameter.id,
            show: false,
          },
        }
      },
      {}
    )
    commit(ADD_PARAMETER_HEADERS, {
      parameters: parameterHeaders,
      ids: Object.keys(parameters),
    })
  },
}
