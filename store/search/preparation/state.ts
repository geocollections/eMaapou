import { SearchModuleState } from '../types'
import { PREPARATION } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    name: 'preparation',
    items: [],
    count: 0,
    options: PREPARATION.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      byIds: {
        number: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'preparation.number',
          fields: ['preparation_number'],
        },
        locality: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'preparation.locality',
          fields: ['locality', 'locality_en'],
        },
        hierarchy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'preparation.hierarchy',
          fields: [
            'stratigraphy_hierarchy',
            'lithostratigraphy_hierarchy',
            'age_hierarchy',
          ],
        },
        depth: {
          value: [null, null],
          type: FilterType.Range,
          label: 'preparation.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
      },
      allIds: ['number', 'locality', 'depth', 'hierarchy'],
    },
  }
}

export default initState
