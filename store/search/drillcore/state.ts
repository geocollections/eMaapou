import { SearchModuleState } from '../types'
import { DRILLCORE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export type DrillcoreFilters =
  | 'name'
  | 'country'
  | 'repository'
  | 'storage'
  | 'boxes'
  | 'map'

export const initState = (): SearchModuleState<DrillcoreFilters> => {
  return {
    name: 'drillcore',
    items: [],
    count: 0,
    options: DRILLCORE.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      byIds: {
        name: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'drillcore.name',
          fields: ['drillcore', 'drillcore_en'],
        },
        storage: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'drillcore.storage',
          fields: ['location'],
        },
        boxes: {
          type: FilterType.Range,
          value: [null, null],
          label: 'drillcore.boxes',
          placeholders: ['boxes.min', 'boxes.max'],
          fields: ['boxes'],
        },
        country: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['country_id'],
          valueType: 'number',
          valueField: 'id',
          lookupType: 'none',
        },
        repository: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['core_repository_id'],
          valueType: 'number',
          valueField: 'id',
          lookupType: 'none',
        },
        map: {
          type: FilterType.Geom,
          value: null,
          label: '',
          fields: ['latlong'],
        },
      },
      allIds: ['name', 'repository', 'country', 'storage', 'boxes'],
    },
  }
}

export default initState
