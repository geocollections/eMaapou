import { SearchModuleState } from '../types'
import { DRILLCORE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  GeomFilter,
  ListIdsFilter,
  ListTextFilter,
  RangeAltFilter,
  RangeFilter,
  TextFilter,
} from '~/types/filters'

export type DrillcoreFilters = {
  name: ListTextFilter
  storage: TextFilter
  boxes: RangeFilter
  country: ListIdsFilter
  repository: ListIdsFilter
  map: GeomFilter
  stratigraphyAge: RangeAltFilter
}
export const initState = (): SearchModuleState<DrillcoreFilters> => {
  return {
    name: 'drillcore',
    items: [],
    count: 0,
    options: DRILLCORE.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      name: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        fields: ['drillcore', 'drillcore_en'],
      },
      storage: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['location'],
      },
      boxes: {
        type: FilterType.Range,
        value: [null, null],
        placeholders: ['boxes.min', 'boxes.max'],
        fields: ['boxes'],
      },
      country: {
        value: [],
        type: FilterType.ListIds,
        fields: ['country_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      repository: {
        value: [],
        type: FilterType.ListIds,
        fields: ['core_repository_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      map: {
        type: FilterType.Geom,
        value: null,
        fields: ['latlong'],
      },
      stratigraphyAge: {
        value: [],
        type: FilterType.RangeAlt,
        placeholders: ['stratigraphy.min', 'stratigraphy.max'],
        fields: ['age_base', 'age_top'],
      },
    },
  }
}

export default initState
