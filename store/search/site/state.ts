import { SearchModuleState } from '../types'
import { SITE } from '~/constants'
import { FilterType } from '~/types/enums'
import { GeomFilter, ListIdsFilter, ListTextFilter } from '~/types/filters'

export type SiteFilters = {
  name: ListTextFilter
  area: ListIdsFilter
  project: ListIdsFilter
  map: GeomFilter
}

export const initState = (): SearchModuleState<SiteFilters> => {
  return {
    name: 'site',
    items: [],
    count: 0,
    options: SITE.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      name: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        label: '',
        fields: ['name'],
      },
      area: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        label: '',
        fields: ['area_id'],
        valueField: 'id',
        valueType: 'number',
      },
      project: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        label: '',
        fields: ['project_id'],
        valueField: 'id',
        valueType: 'number',
      },
      map: {
        type: FilterType.Geom,
        value: null,
        label: '',
        fields: ['latlong'],
      },
    },
  }
}

export default initState
