import { SearchModuleState } from '../types'
import { STRATIGRAPHY } from '~/constants'
import { FilterType } from '~/types/enums'
import { ListIdsFilter, ListTextFilter, RangeAltFilter } from '~/types/filters'

export type StratigraphyFilters = {
  id: ListTextFilter
  index: ListTextFilter
  age: RangeAltFilter
  stratigraphyHierarchy: ListIdsFilter
}
export const initState = (): SearchModuleState<StratigraphyFilters> => {
  return {
    name: 'stratigraphy',
    items: [],
    count: 0,
    options: STRATIGRAPHY.options,
    useMap: false,
    useInstitutions: false,
    query: '',
    filters: {
      id: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        label: '',
        fields: ['id'],
      },
      index: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        label: '',
        fields: ['index_main', 'index_additional'],
      },
      age: {
        value: [],
        type: FilterType.RangeAlt,
        label: '',
        placeholders: ['stratigraphy.min', 'stratigraphy.max'],
        fields: ['age_base', 'age_top'],
      },
      stratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'startswith',
        label: 'stratigraphy.hierarchy',
        fields: ['hierarchy_string'],
        valueField: 'hierarchy_string',
        valueType: 'string',
      },
    },
  }
}

export default initState
