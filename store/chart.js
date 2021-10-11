import { getField, updateField } from 'vuex-map-fields'

export const state = () => {
  return {
    renderer: 'canvas',
    connected: true,
  }
}

export const mutations = {
  updateField,
}

export const getters = {
  getField,
}
