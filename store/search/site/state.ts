import { SearchModuleState } from '../types'
import { SITE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    items: [],
    count: 0,
    options: SITE.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      byIds: {
        name: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'site.name',
          fields: ['name'],
        },
        area: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'site.area',
          fields: ['area_name', 'area_name_en'],
        },
        project: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'site.project',
          fields: ['project_name', 'project_name_en'],
        },
      },
      allIds: ['name'],
    },
  }
}

export default initState
