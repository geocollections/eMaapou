import { SearchModuleState } from '../types'
import { PREPARATION } from '~/constants'
import { FilterType } from '~/types/enums'
import {
  GeomFilter,
  ListIdsFilter,
  ListTextFilter,
  RangeFilter,
} from '~/types/filters'

export type PreparationFilters = {
  number: ListTextFilter
  locality: ListIdsFilter
  stratigraphyHierarchy: ListIdsFilter
  depth: RangeFilter
  map: GeomFilter
}
export const initState = (): SearchModuleState<PreparationFilters> => {
  return {
    name: 'preparation',
    items: [],
    count: 0,
    options: PREPARATION.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      number: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        fields: ['preparation_number'],
      },
      locality: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        fields: ['locality_id'],
        valueField: 'id',
        valueType: 'number',
      },
      stratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'startswith',
        fields: [
          'stratigraphy_hierarchy',
          'lithostratigraphy_hierarchy',
          'age_hierarchy',
        ],
        valueField: 'hierarchy_string',
        valueType: 'string',
      },
      depth: {
        value: [null, null],
        type: FilterType.Range,
        placeholders: ['depth.min', 'depth.max'],
        fields: ['depth'],
      },
      map: {
        type: FilterType.Geom,
        value: null,
        fields: ['latlong'],
      },
    },
  }
}

export default initState
