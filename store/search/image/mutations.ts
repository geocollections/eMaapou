import {mutationTree} from 'typed-vuex'
import { updateField } from 'vuex-map-fields'

import { searchModuleMutationTree } from '../mutations'
import state from './state'
export default {
  updateField,
  ...searchModuleMutationTree(state),
  ...mutationTree(state, {
    SET_VIEW(state, view) {
      state.currentView = view
    }
  })
}

