import { SearchModuleState } from '../types'
import { DATASET } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export type DatasetFilters =
  | 'name'
  | 'owner'
  | 'date'
  | 'remarks'
  | 'parameters'
  | 'analysisParameter'

export const initState = (): SearchModuleState<DatasetFilters> => {
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
          value: [],
          type: FilterType.ListText,
          lookupType: 'none',
          label: '',
          fields: ['name', 'name_en'],
        },
        owner: {
          value: [],
          type: FilterType.ListText,
          lookupType: 'contains',
          label: '',
          fields: [
            'owner_id',
            'owner_agent',
            'owner_forename',
            'owner_surename',
            'owner_txt',
          ],
        },
        date: {
          value: [],
          type: FilterType.ListText,
          lookupType: 'contains',
          label: '',
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
        analysisParameter: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['parameter_index_list'],
          valueType: 'string',
          valueField: 'parameter_index',
          lookupType: 'none',
        },
      },
      allIds: ['name', 'owner', 'date', 'remarks'],
    },
  }
}

export default initState
