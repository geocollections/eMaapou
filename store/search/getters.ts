import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isBoolean from 'lodash/isBoolean'
import { getField } from 'vuex-map-fields'
import { GetterTree } from 'vuex'
import { SearchModuleState } from './types'

export const searchModuleGetters: GetterTree<SearchModuleState, any> = {
  hasActiveFilters: (state) => {
    return Object.values(state.filters.byIds).some((filter) => {
      if (Array.isArray(filter.value))
        return filter.value.some(function (v) {
          return v !== null
        })
      else if (isBoolean(filter.value) && filter.value === true) return true
      return !isEmpty(filter.value) && !isNil(filter.value)
    })
  },
}

export default {
  getField,
}
