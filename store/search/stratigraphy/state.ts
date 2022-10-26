import { SearchModuleState } from '../types'
import { STRATIGRAPHY } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    items: [],
    count: 0,
    options: STRATIGRAPHY.options,
    useMap: false,
    useInstitutions: false,
    query: '',
    filters: {
      byIds: {
        id: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'stratigraphy.id',
          fields: ['id'],
        },
        stratigraphy: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'stratigraphy.stratigraphy',
          fields: ['stratigraphy', 'stratigraphy_en'],
        },
        index: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'stratigraphy.index',
          fields: ['index_main', 'index_additional'],
        },
        age: {
          value: '',
          type: FilterType.RangeAlt,
          label: 'stratigraphy.age',
          placeholders: ['stratigraphy.min', 'stratigraphy.max'],
          fields: ['age_base', 'age_top'],
        },
        hierarchy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.Equals,
          label: 'stratigraphy.hierarchy',
          fields: ['hierarchy_string'],
        },
      },
      allIds: ['id', 'stratigraphy', 'age'],
    },
  }
}

export default initState
