export default {
  ADD_PARAMETER_HEADERS(state, { parameters, ids }) {
    state.byIds = { ...state.byIds, ...parameters }
    state.allIds = [...state.allIds, ...ids]
  },
}
