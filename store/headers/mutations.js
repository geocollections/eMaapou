import {
  TOGGLE_HEADER,
  RESET_HEADERS,
  SHOW_HEADER,
  ADD_PARAMETER_HEADERS,
} from '../mutation_types'

export default {
  [TOGGLE_HEADER](state, { module, headerId }) {
    state[module].byIds[headerId].show = !state[module].byIds[headerId].show
  },
  [SHOW_HEADER](state, { module, headerId }) {
    state[module].byIds[headerId].show = true
  },
  [RESET_HEADERS](state, { module, initHeaders }) {
    state[module] = initHeaders
  },
  [ADD_PARAMETER_HEADERS](state, { parameters, ids }) {
    state.analytical_data.byIds = {
      ...state.analytical_data.byIds,
      ...parameters,
    }
    state.analytical_data.allIds = [...state.analytical_data.allIds, ...ids]
  },
}
