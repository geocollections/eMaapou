import { getField } from 'vuex-map-fields'

export default {
  getField,
  // Filters out fields that are already in use
  distinctListParameters: (state) => (mustSeeParam) => {
    if (state.listParameters && state.listParameters.length > 0) {
      const distinctList = state.listParameters.filter(
        (param) =>
          !state.activeListParameters.find((item) => item.id === param.id)
      )
      return [mustSeeParam, ...distinctList]
    } else return [mustSeeParam]
  },

  parameterList:
    (state) =>
    (filter = null) => {
      // Collect parameters that are already in use
      // also filter out the parameter field of current filter
      // so that it can be seen on in the list

      let usedParameters = state.parameterFilters.allIds.map(
        (id) => state.parameterFilters.byIds[id].fields[0]
      )

      if (filter) {
        usedParameters = usedParameters.filter((v) => v !== filter.fields[0])

        return [
          ...Object.values(state.parameters).filter((parameter) => {
            return !usedParameters.includes(parameter.id)
          }),
        ]
      } else {
        return [
          ...Object.values(state.parameters).filter((parameter) => {
            return !usedParameters.includes(parameter.id)
          }),
        ]
      }
    },
}
