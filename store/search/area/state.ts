import { SearchModuleState } from '../types'
import { AREA } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    items: [],
    count: 0,
    options: AREA.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      byIds: {
        name: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'area.name',
          fields: ['name', 'name_en'],
        },
        county: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'area.county',
          fields: ['maakond'],
        },
        type: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'area.areaType',
          fields: ['area_type'],
        },
      },
      allIds: ['name', 'county', 'type'],
    },
  }
}

export default initState
