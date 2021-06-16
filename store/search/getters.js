import { isEmpty, isNil } from 'lodash'
import { getField } from 'vuex-map-fields'

export default {
  getField,
  hasActiveFilters: (state) => (module) => {
    return Object.values(state[module].filters.byIds).some((filter) => {
      if (Array.isArray(filter.value))
        return filter.value.some(function (v) {
          return v !== null
        })
      return !isEmpty(filter.value) && !isNil(filter.value)
    })
  },
}
