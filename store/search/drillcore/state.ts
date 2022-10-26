import { SearchModuleState } from '../types'
import { DRILLCORE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
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
        country: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'locality.country',
          fields: ['country', 'country_en'],
        },
        repository: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'drillcore.repository',
          fields: ['core_repository', 'core_repository_en'],
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
      },
      allIds: ['name', 'repository', 'country', 'storage', 'boxes'],
    },
  }
}

export default initState
