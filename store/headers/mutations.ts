import { mutationTree } from 'typed-vuex'
import {
  TOGGLE_HEADER,
  RESET_HEADERS,
  SHOW_HEADER,
  ADD_PARAMETER_HEADERS,
} from '../mutation_types'
import state, { HeadersState } from './state'

export default mutationTree(state, {
  [TOGGLE_HEADER](
    state,
    { module, headerId }: { module: keyof HeadersState; headerId: string }
  ) {
    state[module].byIds[headerId].show = !state[module].byIds[headerId].show
  },
  [SHOW_HEADER](
    state,
    { module, headerId }: { module: keyof HeadersState; headerId: string }
  ) {
    state[module].byIds[headerId].show = true
  },
  [RESET_HEADERS](
    state,
    { module, initHeaders }: { module: keyof HeadersState; initHeaders: any }
  ) {
    state[module] = initHeaders
  },
  [ADD_PARAMETER_HEADERS](state, { parameters, ids }) {
    state.analytical_data.byIds = {
      ...state.analytical_data.byIds,
      ...parameters,
    }
    state.analytical_data.allIds = [...state.analytical_data.allIds, ...ids]
  },
})
