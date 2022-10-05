import { getField, updateField } from 'vuex-map-fields'

export const state = () => {
  return {
    renderer: 'canvas',
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
