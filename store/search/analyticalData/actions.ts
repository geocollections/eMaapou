import uniqueId from 'lodash/uniqueId'
import { actionTree } from 'typed-vuex'
import { searchModuleActionTree } from '../actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
export default {
  ...searchModuleActionTree({ initState: state, getters, mutations }),
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
      },
      updateParameterFilter({ commit }, { id, filter }): void {
        commit('UPDATE_PARAMETER_FILTER', { id, filter })

        this.app.$accessor.headers.toggleHeader({
          module: 'analytical_data',
          headerId: filter.fields[0],
        })
      },
      removeParameterFilter({ commit }, id) {
        commit('REMOVE_PARAMETER_FILTER', id)
      },
      setParameters({ commit }, { parameters }): void {
        commit('SET_PARAMETERS', parameters)

        this.app.$accessor.headers.addParameterHeaders({
          parameters,
        })
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
        })
      },
    }
  ),
}
