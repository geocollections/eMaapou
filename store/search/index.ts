/* eslint-disable camelcase */
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { initState as state } from './state'
import analysis from './analysis'
import analytical_data from './analytical_data'
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
  actions,
  getters,
  mutations,
  state,
  namespaced: true,
  modules: {
    analysis,
    analytical_data,
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
