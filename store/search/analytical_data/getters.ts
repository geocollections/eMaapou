import { getField } from 'vuex-map-fields'
import { getterTree } from 'typed-vuex'
import { searchModuleGetters } from '../getters'
import state from './state'
import { Filter } from '~/types/filters'
export default getterTree(state, {
  getField,
  ...searchModuleGetters,
  parameterList:
    (state) =>
    (filter: Filter | null = null) => {
      // Collect parameters that are already in use
      // also filter out the parameter field of current filter
      // so that it can be seen on in the list

      let usedParameters = state.parameterFilters.allIds.map(
        (id) => state.parameterFilters.byIds[id].fields[0]
      )

      if (filter) {
        usedParameters = usedParameters.filter((v) => v !== filter.fields[0])

        return [
          ...Object.values(state.parameters).filter((parameter) => {
            return !usedParameters.includes(parameter.id)
          }),
        ]
      } else {
        return [
          ...Object.values(state.parameters).filter((parameter) => {
            return !usedParameters.includes(parameter.id)
          }),
        ]
      }
    },
})
