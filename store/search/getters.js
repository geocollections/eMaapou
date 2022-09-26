import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isBoolean from 'lodash/isBoolean'
import { getField } from 'vuex-map-fields'

export default {
  getField,
  hasActiveFilters: (state) => (module) => {
    return Object.values(state[module].filters.byIds).some((filter) => {
      if (Array.isArray(filter.value))
        return filter.value.some(function (v) {
          return v !== null
        })
      else if (isBoolean(filter.value) && filter.value === true) return true
      return !isEmpty(filter.value) && !isNil(filter.value)
    })
  },
}
