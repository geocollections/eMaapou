import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export type SearchState = {
  query: string
  globalFilters: {
    byIds: { [K: string]: Filter }
    allIds: string[]
  }
}

export const initState = (): SearchState => {
  return {
    query: '',
    globalFilters: {
      byIds: {
        institutions: {
          type: FilterType.ListOr,
          value: [],
          label: '',
          fields: ['database_id'],
        },
        geoJSON: {
          type: FilterType.Geom,
          value: null,
          label: '',
          fields: ['latlong'],
        },
      },
      allIds: ['institutions', 'geoJSON'],
    },
  }
}

export default initState
