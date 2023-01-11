import { SearchModuleState } from '../types'
import { LOCALITY } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export type LocalityFilters =
  | 'name'
  | 'country'
  | 'stratigraphy'
  | 'reference'
  | 'map'

export const initState = (): SearchModuleState<LocalityFilters> => {
  return {
    name: 'locality',
    items: [],
    count: 0,
    options: LOCALITY.options,
    useMap: true,
    useInstitutions: false,
    query: '',
    filters: {
      name: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        label: 'locality.name',
        fields: ['locality', 'locality_en'],
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
      country: {
        value: [],
        type: FilterType.ListIds,
        label: '',
        fields: ['country_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      reference: {
        value: [],
        type: FilterType.ListIds,
        label: '',
        fields: ['locality_references'],
        valueType: 'string',
        valueField: 'reference',
        lookupType: 'none',
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
