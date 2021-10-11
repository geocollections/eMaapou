import _ from 'lodash'
import { ANALYTICAL_DATA, HEADERS_ANALYTICAL_DATA } from '~/constants'
import {
  ADD_PARAMETER_FILTER,
  REMOVE_PARAMETER_FILTER,
  SET_PARAMETERS,
  UPDATE_PARAMETER_FILTER,
} from '~/store/mutation_types'

export default {
  addParameterFilter({ commit, dispatch, getters }) {
    const initParameter = getters.parameterList()[0]

    const id = _.uniqueId('parameter_')

    const filter = {
      id,
      type: 'range',
      lookUpType: 'range',
      value: [null, null],
      label: initParameter.label,
      placeholders: ['common.from', 'common.to'],
      fields: [initParameter.id],
      isText: false,
    }

    commit(ADD_PARAMETER_FILTER, filter)

    dispatch(
      'headers/toggleHeader',
      {
        module: 'analytical_data',
        headerId: initParameter.id,
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

  async searchAnalyticalData({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'analytical_data',
        resource: 'analytical_data',
        resourceDefaults: {
          ...ANALYTICAL_DATA,
          headers: HEADERS_ANALYTICAL_DATA,
        },
      },
      { root: true }
    )
  },
  setParameters({ commit, dispatch }, { parameters }) {
    let parametersNew = {}
    if (parameters && parameters.length > 0) {
      parametersNew = parameters.reduce((prev, parameter) => {
        return {
          ...prev,
          [parameter.parameter_index]: {
            id: parameter.parameter_index,
            label: parameter.parameter,
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
      const id = _.uniqueId('parameter_')
      const parameter = state.parameters[parameterId]
      const filter = {
        id,
        type: 'range',
        lookUpType: 'range',
        value: [null, null],
        label: parameter.label,
        placeholders: ['common.from', 'common.to'],
        fields: [parameter.id],
        isText: false,
      }
      commit(ADD_PARAMETER_FILTER, filter)
      dispatch(
        'headers/toggleHeader',
        {
          module: 'analytical_data',
          headerId: parameter.id,
        },
        { root: true }
      )
    })
  },
}
