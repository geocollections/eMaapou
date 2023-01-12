import { mutationTree, getterTree, actionTree } from 'typed-vuex'

type MapState = {
  baseLayer: string // TODO: should be enum
}

export const state = (): MapState => {
  return {
    baseLayer: 'CartoDB',
  }
}

export const mutations = mutationTree(state, {
  SET_BASE_LAYER(state, baseLayer) {
    if (state.baseLayer !== baseLayer) state.baseLayer = baseLayer
  },
})

export const getters = getterTree(state, {
  isBaseLayerEstonian(state) {
    return (
      state.baseLayer === 'Estonian satellite' ||
      state.baseLayer === 'Estonian map'
    )
  },

  getBaseLayer(state) {
    return state.baseLayer
  },
})

export const actions = actionTree(
  { state, mutations, getters },
  {
    setBaseLayer({ commit }, baseLayer) {
      commit('SET_BASE_LAYER', baseLayer)
    },
  }
)
