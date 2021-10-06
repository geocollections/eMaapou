export default {
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
    commit('ADD_PARAMETER_HEADERS', {
      parameters: parameterHeaders,
      ids: Object.keys(parameters),
    })
  },
}
