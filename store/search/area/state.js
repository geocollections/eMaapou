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
          fields: ['maakond'],
        },
        type: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'area.areaType',
          fields: ['area_type'],
        },
      },
      allIds: ['name', 'county', 'type'],
    },
  }
}

export default initState
