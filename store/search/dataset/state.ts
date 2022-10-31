import { SearchModuleState } from '../types'
import { DATASET } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    name: 'dataset',
    items: [],
    count: 0,
    options: DATASET.options,
    useMap: false,
    useInstitutions: true,
    query: '',
    filters: {
      byIds: {
        name: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'dataset.name',
          fields: ['name', 'name_en'],
        },
        owner: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
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
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'dataset.date',
          fields: ['date', 'date_txt'],
        },
        remarks: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'dataset.remarks',
          fields: ['remarks'],
        },
        parameters: {
          value: [],
          type: FilterType.List,
          label: 'dataset.parameters',
          fields: ['parameter_index_list'],
        },
      },
      allIds: ['name', 'owner', 'date', 'remarks'],
    },
  }
}

export default initState
