import { mutationTree } from 'typed-vuex'
import uniq from 'lodash/uniq'
import state, { HeadersState } from './state'
export default mutationTree(state, {
  TOGGLE_HEADER(
    state,
    { module, headerId }: { module: keyof HeadersState; headerId: string }
  ) {
    state[module].byIds[headerId].show = !state[module].byIds[headerId].show
  },
  SHOW_HEADER(
    state,
    { module, headerId }: { module: keyof HeadersState; headerId: string }
  ) {
    state[module].byIds[headerId].show = true
  },
  RESET_HEADERS(
    state,
    { module, initHeaders }: { module: keyof HeadersState; initHeaders: any }
  ) {
    state[module] = initHeaders
  },
  ADD_PARAMETER_HEADERS(state, { parameters, ids }) {
    state.analytical_data.byIds = {
      ...state.analytical_data.byIds,
      ...parameters,
    }
    // NOTE: `uniq` is added currently because the search form from where the parameter headers are added is loaded twice, once for mobile and once for desktop.
    // Therefore the headers appear twice if `uniq` is omitted.
    // Could be removed after the search form rendering is redone, so that it renders only once.
    state.analytical_data.allIds = uniq([
      ...state.analytical_data.allIds,
      ...ids,
    ])
  },
})
