import { STRATIGRAPHY } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: STRATIGRAPHY.options,
    useMap: false,
    useInstitutions: false,
    filters: {
      byIds: {
        id: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'stratigraphy.id',
          fields: ['id'],
        },
        stratigraphy: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'stratigraphy.stratigraphy',
          fields: ['stratigraphy', 'stratigraphy_en'],
        },
        index: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'stratigraphy.index',
          fields: ['index_main', 'index_additional'],
        },
        age: {
          value: '',
          type: 'range_alt',
          lookUpType: 'range',
          label: 'stratigraphy.age',
          placeholders: ['stratigraphy.min', 'stratigraphy.max'],
          fields: ['age_base', 'age_top'],
        },
        hierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'equals',
          label: 'stratigraphy.hierarchy',
          fields: ['hierarchy_string'],
        },
      },
      allIds: ['id', 'stratigraphy', 'age'],
    },
  }
}

export default initState
