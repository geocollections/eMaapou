import { SET_BASE_LAYER } from './mutation_types'

export const state = () => {
  return {
    baseLayer: 'CartoDB',
  }
}

export const mutations = {
  [SET_BASE_LAYER](state, baseLayer) {
    if (state.baseLayer !== baseLayer) state.baseLayer = baseLayer
  },
}

export const actions = {
  setBaseLayer({ commit }, baseLayer) {
    commit(SET_BASE_LAYER, baseLayer)
  },
}

export const getters = {
  isBaseLayerEstonian(state) {
    return (
      state.baseLayer === 'Estonian satellite' ||
      state.baseLayer === 'Estonian map'
    )
  },

  getBaseLayer(state) {
    return state.baseLayer
  },
}
