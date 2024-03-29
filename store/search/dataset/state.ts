import { SearchModuleState } from '../types'
import { DATASET } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  ListFilter,
  ListIdsFilter,
  ListTextFilter,
  TextFilter,
} from '~/types/filters'

export type DatasetFilters = {
  name: ListTextFilter
  owner: ListTextFilter
  date: ListTextFilter
  remarks: TextFilter
  parameters: ListFilter
  analysisParameter: ListIdsFilter
}
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
      name: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        fields: ['name', 'name_en'],
      },
      owner: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'contains',
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
        fields: ['date', 'date_txt'],
      },
      remarks: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['remarks'],
      },
      parameters: {
        value: [],
        type: FilterType.List,
        fields: ['parameter_index_list'],
      },
      analysisParameter: {
        value: [],
        type: FilterType.ListIds,
        fields: ['parameter_index_list'],
        valueType: 'string',
        valueField: 'parameter_index',
        lookupType: 'none',
      },
    },
  }
}

export default initState
