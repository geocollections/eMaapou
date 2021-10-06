import { TOGGLE_HEADER, RESET_HEADERS, SHOW_HEADER } from '../mutation_types'

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
}
