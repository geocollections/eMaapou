import { ANALYSIS } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: ANALYSIS.options,
    useMap: true,
    useInstitutions: true,
    filters: {
      byIds: {
        id: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analysis.id',
          fields: ['id'],
        },
        depth: {
          value: [-20, 5000],
          type: 'range',
          lookUpType: 'range',
          label: 'analysis.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
      },
      allIds: ['id', 'depth'],
    },
  }
}

export default initState
