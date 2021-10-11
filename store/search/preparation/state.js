import { PREPARATION } from '~/constants'

export const initState = () => {
  return {
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
          type: 'text',
          lookUpType: 'contains',
          label: 'preparation.number',
          fields: ['preparation_number'],
        },
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'preparation.locality',
          fields: ['locality', 'locality_en'],
        },
        hierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'preparation.hierarchy',
          fields: [
            'stratigraphy_hierarchy',
            'lithostratigraphy_hierarchy',
            'age_hierarchy',
          ],
        },
        depth: {
          value: [null, null],
          type: 'range',
          lookUpType: 'range',
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
