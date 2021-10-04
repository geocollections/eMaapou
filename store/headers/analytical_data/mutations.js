import Vue from 'vue'

export default {
  ADD_PARAMETER_HEADERS(state, { parameters, ids }) {
    state.byIds = { ...state.byIds, ...parameters }
    state.allIds = [...state.allIds, ...ids]
  },
  UPDATE_HEADER(state, { header, headerId }) {
    Vue.set(state.byIds, headerId, header)
  },
}
