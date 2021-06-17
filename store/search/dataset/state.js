import { DATASET } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: DATASET.options,
    useMap: false,
    useInstitutions: true,
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.name',
          fields: ['name', 'name_en'],
        },
        owner: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.owner',
          fields: [
            'owner_id',
            'owner_agent',
            'owner_forename',
            'owner_surename',
            'owner_txt',
          ],
        },
        date: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.date',
          fields: ['date', 'date_txt'],
        },
        remarks: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'dataset.remarks',
          fields: ['remarks'],
        },
        parameters: {
          value: [],
          type: 'list',
          lookUpType: 'contains',
          label: 'dataset.parameters',
          fields: ['parameter_index_list'],
        },
      },
      allIds: ['name', 'owner', 'date', 'remarks'],
    },
  }
}

export default initState
