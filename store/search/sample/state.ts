import { SearchModuleState } from '../types'
import { SAMPLE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export type SampleFilters =
  | 'locality'
  | 'stratigraphy'
  | 'hierarchy'
  | 'depth'
  | 'mass'
  | 'project'
  | 'stratigraphyHierarchy'
  | 'collector'
  | 'number'
  | 'map'

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
      byIds: {
        stratigraphy: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'sample.stratigraphy',
          fields: ['stratigraphy', 'stratigraphy_en'],
        },
        hierarchy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'sample.hierarchy',
          fields: [
            'stratigraphy_hierarchy',
            'age_hierarchy',
            'lithostratigraphy_hierarchy',
          ],
        },
        depth: {
          type: FilterType.Range,
          value: [null, null],
          label: 'sample.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
        mass: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Equals,
          label: 'sample.mass',
          fields: ['mass'],
        },
        project: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Equals,
          label: 'sample.project',
          fields: ['project_name', 'project_name_en'],
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
        stratigraphyHierarchy: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: [
            'stratigraphy_hierarchy',
            'age_hierarchy',
            'lithostratigraphy_hierarchy',
          ],
          valueType: 'string',
          valueField: 'hierarchy_string',
          lookupType: 'startswith',
        },
        collector: {
          value: [],
          type: FilterType.ListText,
          label: '',
          fields: ['collector', 'collector_full_name'],
          lookupType: 'startswith',
        },
        number: {
          value: [],
          type: FilterType.ListText,
          label: '',
          fields: ['number'],
          lookupType: 'none',
        },
        map: {
          type: FilterType.Geom,
          value: null,
          label: '',
          fields: ['latlong'],
        },
      },
      allIds: ['number', 'stratigraphy', 'hierarchy'],
    },
  }
}

export default initState
