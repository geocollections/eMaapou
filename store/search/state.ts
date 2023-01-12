import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export type SearchState = {
  query: string
  globalFilters: {
    institutions: Filter
  }
}

export const initState = (): SearchState => {
  return {
    query: '',
    globalFilters: {
      institutions: {
        type: FilterType.ListOr,
        value: [],
        label: '',
        fields: ['database_id'],
      },
    },
  }
}

export default initState
