import uniqueId from 'lodash/uniqueId'
import { actionTree } from 'typed-vuex'
import { searchModuleActionTree } from '../actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
export default {
  ...searchModuleActionTree({ state, getters, mutations }),
  ...actionTree(
    { state, getters, mutations },
    {
      addParameterFilter({ commit, getters }): void {
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

        commit('ADD_PARAMETER_FILTER', filter)
        this.app.$accessor.headers.toggleHeader({
          module: 'analytical_data',
          headerId: initParameter.value,
        })
        // dispatch(
        //   'headers/toggleHeader',
        //   {
        //     module: 'analytical_data',
        //     headerId: initParameter.value,
        //   },
        //   { root: true }
        // )
      },
      updateParameterFilter({ commit }, { id, filter }): void {
        commit('UPDATE_PARAMETER_FILTER', { id, filter })

        this.app.$accessor.headers.toggleHeader({
          module: 'analytical_data',
          headerId: filter.fields[0],
        })
        // dispatch(
        //   'headers/toggleHeader',
        //   {
        //     module: 'analytical_data',
        //     headerId: filter.fields[0],
        //   },
        //   { root: true }
        // )
      },
      removeParameterFilter({ commit }, id) {
        commit('REMOVE_PARAMETER_FILTER', id)
      },
      setParameters({ commit }, { parameters }): void {
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

        commit('SET_PARAMETERS', parametersNew)

        this.app.$accessor.headers.addParameterHeaders({
          parameters: parametersNew,
        })

        // dispatch(
        //   'headers/addParameterHeaders',
        //   {
        //     parameters: parametersNew,
        //   },
        //   { root: true }
        // )
        // dispatch('initDefaultParameters')
      },
      initDefaultParameters({ commit, state }): void {
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
          commit('ADD_PARAMETER_FILTER', filter)
          this.app.$accessor.headers.toggleHeader({
            module: 'analytical_data',
            headerId: parameter.value,
          })
          // dispatch(
          //   'headers/toggleHeader',
          //   {
          //     module: 'analytical_data',
          //     headerId: parameter.value,
          //   },
          //   { root: true }
          // )
        })
      },
    }
  ),
}
