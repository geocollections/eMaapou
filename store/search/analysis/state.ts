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
        label: 'analysis.id',
        fields: ['id'],
      },
      depth: {
        value: [null, null],
        type: FilterType.Range,
        label: 'analysis.depth',
        placeholders: ['depth.min', 'depth.max'],
        fields: ['depth'],
      },
      stratigraphy: {
        value: null,
        type: FilterType.Object,
        searchField: 'hierarchy_string',
        lookUpType: LookupType.StartsWith,
        label: 'analysis.stratigraphy',
        fields: [
          'stratigraphy_hierarchy',
          'lithostratigraphy_hierarchy',
          'age_hierarchy',
        ],
      },
      agent: {
        value: [],
        type: FilterType.ListText,
        label: '',
        fields: ['agent'],
        lookupType: 'startswith',
      },
      dataset: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'analysis.dataset',
        fields: ['dataset_ids'],
      },
      sample: {
        value: [],
        type: FilterType.ListIds,
        label: '',
        fields: ['sample_id', 'sample_number'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },

      lab: {
        value: [],
        type: FilterType.ListIds,
        label: '',
        fields: ['lab_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      method: {
        value: [],
        type: FilterType.ListIds,
        label: '',
        fields: ['method'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      locality: {
        value: [],
        type: FilterType.ListIds,
        label: '',
        fields: ['locality_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      map: {
        type: FilterType.Geom,
        value: null,
        label: '',
        fields: ['latlong'],
      },
    },
  }
}

export default initState
