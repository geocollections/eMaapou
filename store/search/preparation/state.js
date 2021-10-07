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
          // ??? Should sample_no be included also
          fields: ['sample_number'],
        },
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'preparation.locality',
          fields: ['locality', 'locality_en'],
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
      allIds: ['number', 'locality', 'depth'],
    },
  }
}

export default initState
