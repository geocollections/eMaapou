import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isBoolean from 'lodash/isBoolean'
import { getField } from 'vuex-map-fields'
import { getterTree } from 'typed-vuex'
import { SearchModuleState } from './types'
import state from './state'
import { Filter } from '~/types/filters'

export const searchModuleGetterTree = <Filters extends { [K: string]: Filter }>(
  state: () => SearchModuleState<Filters>
) => {
  return getterTree(state, {
    hasActiveFilters(state) {
      return Object.values<Filter>(state.filters).some((filter) => {
        if (Array.isArray(filter.value))
          return filter.value.some(function (v) {
            return v !== null
          })
        else if (isBoolean(filter.value) && filter.value === true) return true
        return !isEmpty(filter.value) && !isNil(filter.value)
      })
    },
  })
}

export default getterTree(state, {
  getField,
})
