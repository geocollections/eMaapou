import { getField, updateField } from 'vuex-map-fields'
import { actionTree, mutationTree } from 'typed-vuex'
import { Renderer } from '~/types/enums'
type ChartState = {
  renderer: Renderer
  connected: boolean
  ppi: number
}
export const state = (): ChartState => {
  return {
    renderer: Renderer.Canvas,
    connected: true,
    ppi: 96,
  }
}

export const mutations = mutationTree(state, {
  updateField,
  SET_RENDERER(state, renderer: Renderer) {
    state.renderer = renderer
  },
  SET_PPI(state, ppi: number) {
    state.ppi = ppi
  },
})

export const getters = {
  getField,
}

export const actions = actionTree(
  { state, mutations, getters },
  {
    setRenderer({ commit }, renderer: Renderer) {
      commit('SET_RENDERER', renderer)
    },
    setPpi({ commit }, ppi: number) {
      commit('SET_PPI', ppi)
    },
  }
)
