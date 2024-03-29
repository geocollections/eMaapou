import { SearchModuleState } from '../types'
import { SAMPLE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  BooleanFilter,
  GeomFilter,
  ListIdsFilter,
  ListIdsMultiFilter,
  ListTextFilter,
  ObjectFilter,
  RangeFilter,
  TextFilter,
} from '~/types/filters'

export type SampleFilters = {
  stratigraphy: TextFilter
  hierarchy: ObjectFilter
  depth: RangeFilter
  mass: TextFilter
  project: TextFilter
  locality: ListIdsFilter
  stratigraphyHierarchy: ListIdsFilter
  rockHierarchy: ListIdsMultiFilter
  collector: ListTextFilter
  number: ListTextFilter
  map: GeomFilter
  hasImage: BooleanFilter
  hasCoordinates: BooleanFilter
}
export const initState = (): SearchModuleState<SampleFilters> => {
  return {
    name: 'sample',
    items: [],
    count: 0,
    options: SAMPLE.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      stratigraphy: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['stratigraphy', 'stratigraphy_en'],
      },
      hierarchy: {
        value: null,
        type: FilterType.Object,
        searchField: 'hierarchy_string',
        lookUpType: LookupType.StartsWith,
        fields: [
          'stratigraphy_hierarchy',
          'age_hierarchy',
          'lithostratigraphy_hierarchy',
        ],
      },
      hasImage: {
        value: false,
        type: FilterType.Boolean,
        fields: ['has_image'],
      },
      hasCoordinates: {
        value: false,
        type: FilterType.Boolean,
        fields: ['has_map'],
      },
      depth: {
        type: FilterType.Range,
        value: [null, null],
        placeholders: ['depth.min', 'depth.max'],
        fields: ['depth'],
      },
      mass: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Equals,
        fields: ['mass'],
      },
      project: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Equals,
        fields: ['project_name', 'project_name_en'],
      },
      locality: {
        value: [],
        type: FilterType.ListIds,
        fields: ['locality_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      stratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        fields: [
          'stratigraphy_hierarchy',
          'age_hierarchy',
          'lithostratigraphy_hierarchy',
        ],
        valueType: 'string',
        valueField: 'hierarchy_string',
        lookupType: 'startswith',
      },
      rockHierarchy: {
        value: [],
        type: FilterType.ListIdsMulti,
        fields: ['hierarchy_string_rock'],
        valueType: 'string',
        valueField: 'hierarchy_strings',
        idValueField: 'id',
        lookupType: 'startswith',
      },
      collector: {
        value: [],
        type: FilterType.ListText,
        fields: ['collector', 'collector_full_name'],
        lookupType: 'contains',
      },
      number: {
        value: [],
        type: FilterType.ListText,
        fields: ['number'],
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
