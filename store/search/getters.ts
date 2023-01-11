import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isBoolean from 'lodash/isBoolean'
import { getField } from 'vuex-map-fields'
import { SearchModuleState } from './types'
import { Filter } from '~/types/filters'

export const searchModuleGetters = <
  Filters extends { [K: string]: Filter }
>() => ({
  hasActiveFilters: (state: SearchModuleState<Filters>) => {
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

export default {
  getField,
}
