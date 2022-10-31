import { SearchModuleState } from '../types'
import { LOCALITY } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
export const initState = (): SearchModuleState => {
  return {
    name: 'locality',
    items: [],
    count: 0,
    options: LOCALITY.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      byIds: {
        name: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'locality.name',
          fields: ['locality', 'locality_en'],
        },
        country: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'locality.country',
          fields: ['country', 'country_en'],
        },
        stratigraphy: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'locality.stratigraphy',
          fields: [
            'stratigraphy_base',
            'stratigraphy_base_en',
            'stratigraphy_base_free',
            'stratigraphy_top',
            'stratigraphy_top_en',
            'stratigraphy_top_free',
          ],
        },
        reference: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'locality.reference',
          fields: ['locality_references'],
        },
      },
      allIds: ['name', 'country', 'stratigraphy', 'reference'],
    },
  }
}

export default initState
