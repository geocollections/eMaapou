import { getField, updateField } from 'vuex-map-fields'
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

export const mutations = {
  updateField,
}

export const getters = {
  getField,
}
