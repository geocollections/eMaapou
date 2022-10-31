import uniqueId from 'lodash/uniqueId'
import { actionTree } from 'typed-vuex'
import { searchModuleActions } from '../moduleActions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import {
  ADD_PARAMETER_FILTER,
  REMOVE_PARAMETER_FILTER,
  SET_PARAMETERS,
  UPDATE_PARAMETER_FILTER,
} from '~/store/mutation_types'
export default actionTree(
  { state, getters, mutations },
  {
    ...searchModuleActions,
    addParameterFilter({ commit, dispatch, getters }) {
      const initParameter = getters.parameterList()[0]

      const id = uniqueId('parameter_')

      const filter = {
        id,
        type: 'range',
        lookUpType: 'range',
        value: [null, null],
        label: initParameter.text,
        placeholders: ['common.from', 'common.to'],
        fields: [initParameter.value],
        isText: false,
      }

      commit(ADD_PARAMETER_FILTER, filter)

      dispatch(
        'headers/toggleHeader',
        {
          module: 'analytical_data',
          headerId: initParameter.value,
        },
        { root: true }
      )
    },
    updateParameterFilter({ commit, dispatch }, { id, filter }) {
      commit(UPDATE_PARAMETER_FILTER, { id, filter })

      dispatch(
        'headers/toggleHeader',
        {
          module: 'analytical_data',
          headerId: filter.fields[0],
        },
        { root: true }
      )
    },
    removeParameterFilter({ commit }, id) {
      commit(REMOVE_PARAMETER_FILTER, id)
    },
    setParameters({ commit, dispatch }, { parameters }) {
      let parametersNew = {}
      if (parameters && parameters.length > 0) {
        parametersNew = parameters.reduce((prev: any, parameter: any) => {
          return {
            ...prev,
            [parameter.parameter_index]: {
              value: parameter.parameter_index,
              text: parameter.parameter,
            },
          }
        }, {})
      }

      commit(SET_PARAMETERS, parametersNew)

      dispatch(
        'headers/addParameterHeaders',
        {
          parameters: parametersNew,
        },
        { root: true }
      )
      dispatch('initDefaultParameters')
    },
    initDefaultParameters({ commit, state, dispatch }) {
      state.defaultParameters.forEach((parameterId) => {
        const id = uniqueId('parameter_')
        const parameter = state.parameters[parameterId]
        const filter = {
          id,
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: parameter.text,
          placeholders: ['common.from', 'common.to'],
          fields: [parameter.value],
          isText: false,
        }
        commit(ADD_PARAMETER_FILTER, filter)
        dispatch(
          'headers/toggleHeader',
          {
            module: 'analytical_data',
            headerId: parameter.value,
          },
          { root: true }
        )
      })
    },
  }
)
