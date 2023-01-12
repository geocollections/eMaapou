/* eslint-disable camelcase */
import getters from './getters'
import mutations from './mutations'
import { initState as state } from './state'
import actions from './actions'
import analysis from './analysis'
import analyticalData from './analyticalData'
import area from './area'
import drillcore from './drillcore'
import image from './image'
import locality from './locality'
import preparation from './preparation'
import sample from './sample'
import site from './site'
import specimen from './specimen'
import stratigraphy from './stratigraphy'
import dataset from './dataset'
import taxon from './taxon'
export default {
  getters,
  mutations,
  state,
  actions,
  namespaced: true,
  modules: {
    analysis,
    analyticalData,
    dataset,
    taxon,
    area,
    drillcore,
    image,
    locality,
    preparation,
    sample,
    site,
    specimen,
    stratigraphy,
  },
}
