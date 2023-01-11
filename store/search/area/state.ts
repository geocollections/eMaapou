import { SearchModuleState } from '../types'
import { AREA } from '~/constants'
import { FilterType } from '~/types/enums'

export type AreaFilters = 'name' | 'county' | 'type'

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
