import { SearchModuleState } from '../types'
import { AREA } from '~/constants'
import { FilterType } from '~/types/enums'
import { ListIdsFilter, ListTextFilter } from '~/types/filters'

export type AreaFilters = {
  name: ListTextFilter
  county: ListIdsFilter
  type: ListIdsFilter
}

export const initState = (): SearchModuleState<AreaFilters> => {
  return {
    name: 'area',
    items: [],
    count: 0,
    options: AREA.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      name: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        label: '',
        fields: ['name', 'name_en'],
      },
      county: {
        value: [],
        type: FilterType.ListIds,
        label: '',
        fields: ['maakond_id'],
        valueField: 'id',
        valueType: 'number',
        lookupType: 'none',
      },
      type: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        label: '',
        fields: ['area_type_id'],
        valueField: 'id',
        valueType: 'number',
      },
    },
  }
}

export default initState
