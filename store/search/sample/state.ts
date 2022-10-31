import { SearchModuleState } from '../types'
import { SAMPLE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
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
        number: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'sample.number',
          fields: ['number'],
        },
        locality: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'sample.locality',
          fields: ['locality', 'locality_en', 'site_name', 'site_name_en'],
        },
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
        collector: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'sample.collector',
          fields: ['collector', 'collector_full_name'],
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
      },
      allIds: ['number', 'stratigraphy', 'hierarchy'],
    },
  }
}

export default initState
