import { SearchModuleState } from '../types'
import { ANALYSIS } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  GeomFilter,
  ListIdsFilter,
  ListTextFilter,
  ObjectFilter,
  RangeFilter,
  TextFilter,
} from '~/types/filters'

export type AnalysisFilters = {
  id: TextFilter
  depth: RangeFilter
  stratigraphy: ObjectFilter
  agent: ListTextFilter
  dataset: TextFilter
  sample: ListIdsFilter
  lab: ListIdsFilter
  method: ListIdsFilter
  locality: ListIdsFilter
  map: GeomFilter
}

export const initState = (): SearchModuleState<AnalysisFilters> => {
  return {
    name: 'analysis',
    items: [],
    count: 0,
    options: ANALYSIS.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      id: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['id'],
      },
      depth: {
        value: [null, null],
        type: FilterType.Range,
        placeholders: ['depth.min', 'depth.max'],
        fields: ['depth'],
      },
      stratigraphy: {
        value: null,
        type: FilterType.Object,
        searchField: 'hierarchy_string',
        lookUpType: LookupType.StartsWith,
        fields: [
          'stratigraphy_hierarchy',
          'lithostratigraphy_hierarchy',
          'age_hierarchy',
        ],
      },
      agent: {
        value: [],
        type: FilterType.ListText,
        fields: ['agent'],
        lookupType: 'startswith',
      },
      dataset: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['dataset_ids'],
      },
      sample: {
        value: [],
        type: FilterType.ListIds,
        fields: ['sample_id', 'sample_number'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },

      lab: {
        value: [],
        type: FilterType.ListIds,
        fields: ['lab_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      method: {
        value: [],
        type: FilterType.ListIds,
        fields: ['method'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      locality: {
        value: [],
        type: FilterType.ListIds,
        fields: ['locality_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
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
