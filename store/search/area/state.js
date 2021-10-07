import { AREA } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: AREA.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'area.name',
          fields: ['name', 'name_en'],
        },
        county: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'area.county',
          fields: ['maakond', 'maakond_en'],
        },
        type: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'area.areaType',
          fields: ['name', 'name_en'],
        },
      },
      allIds: ['name', 'county', 'type'],
    },
  }
}

export default initState
