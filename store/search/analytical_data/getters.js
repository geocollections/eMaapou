import { getField } from 'vuex-map-fields'

export default {
  getField,
  distinctListParameters: (state) => (mustSeeParam) => {
    if (state.listParameters && state.listParameters.length > 0) {
      const distinctList = state.listParameters.filter(
        (param) =>
          !state.activeListParameters.find((item) => item.id === param.id)
      )
      return [mustSeeParam, ...distinctList]
    } else return [mustSeeParam]
  },
}
