import { SearchModuleState } from '../types'
import { ANALYSIS } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export const initState = (): SearchModuleState => {
  return {
    name: 'analysis',
    items: [],
    count: 0,
    options: ANALYSIS.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      byIds: {
        id: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analysis.id',
          fields: ['id'],
        },
        depth: {
          value: [null, null],
          type: FilterType.Range,
          label: 'analysis.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
      },
      allIds: ['id', 'depth'],
    },
  }
}

export default initState
